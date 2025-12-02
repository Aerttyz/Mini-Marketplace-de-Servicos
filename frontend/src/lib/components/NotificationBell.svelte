<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { api, user } from '$lib/api';
  import { slide } from 'svelte/transition';

  interface Notification {
    id: string;
    message: string;
    read: boolean;
    createdAt: string;
  }

  let notifications: Notification[] = [];
  let isOpen = false;
  let interval: any;

  // Filtra apenas as não lidas para o contador
  $: unreadCount = notifications.filter(n => !n.read).length;

  async function loadNotifications() {
    if (!$user) return;
    try {
      // Busca do backend
      const res = await api('/notifications', 'GET', null, $user.access_token);
      if (Array.isArray(res)) {
        notifications = res;
      }
    } catch (e) {
      console.error('Erro ao carregar notificações', e);
    }
  }

  async function markAsRead(id: string) {
    try {
      await api(`/notifications/${id}/read`, 'PATCH', null, $user?.access_token);
      // Atualiza localmente para remover o destaque de "não lida"
      notifications = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    } catch (e) {
      console.error(e);
    }
  }

  function toggle() {
    isOpen = !isOpen;
  }

  // Fecha o dropdown se clicar fora (simples)
  function handleOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (isOpen && !target.closest('.notification-container')) {
      isOpen = false;
    }
  }

  onMount(() => {
    loadNotifications();
    // Polling: Atualiza a cada 30 segundos para ver se tem novidade
    interval = setInterval(loadNotifications, 30000);
    document.addEventListener('click', handleOutsideClick);
  });

  onDestroy(() => {
    clearInterval(interval);
    if (typeof document !== 'undefined') 
      document.removeEventListener('click', handleOutsideClick);
  });
</script>

<div class="relative notification-container">
  <button on:click={toggle} class="relative p-2 text-gray-600 hover:text-blue-600 transition rounded-full hover:bg-gray-100">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>

    {#if unreadCount > 0}
      <span class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
        {unreadCount}
      </span>
    {/if}
  </button>

  {#if isOpen}
    <div transition:slide={{ duration: 200 }} class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
      <div class="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
        <h3 class="text-sm font-bold text-gray-700">Notificações</h3>
        <button on:click={loadNotifications} class="text-xs text-blue-600 hover:underline">Atualizar</button>
      </div>

      <div class="max-h-80 overflow-y-auto">
        {#if notifications.length === 0}
          <div class="p-6 text-center text-sm text-gray-500">
            Nenhuma notificação.
          </div>
        {:else}
          <ul class="divide-y divide-gray-50">
            {#each notifications as notification}
              <li 
                class={`p-4 hover:bg-gray-50 transition cursor-pointer ${notification.read ? 'opacity-60' : 'bg-blue-50/30'}`}
                on:click={() => markAsRead(notification.id)}
              >
                <div class="flex justify-between items-start gap-2">
                  <p class="text-sm text-gray-800">{notification.message}</p>
                  {#if !notification.read}
                    <span class="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                  {/if}
                </div>
                <span class="text-xs text-gray-400 mt-1 block">
                  {new Date(notification.createdAt).toLocaleDateString()} às {new Date(notification.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  {/if}
</div>