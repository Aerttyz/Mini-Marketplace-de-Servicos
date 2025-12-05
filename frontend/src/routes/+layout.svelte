<script lang="ts">
  import "./layout.css";
  import { user } from "$lib/api";
  import NotificationBell from "$lib/components/NotificationBell.svelte"; 
  
  function logout() {
    user.set(null);
    window.location.href = '/login';
  }
</script>

<div class="min-h-screen bg-gray-50 text-gray-900">
  <nav class="bg-white shadow-sm p-4 mb-6 sticky top-0 z-40">
    <div class="container mx-auto flex justify-between items-center">
      <a href="/" class="text-xl font-bold text-blue-600 tracking-tight flex items-center gap-2">
        🛠️ Marketplace
      </a>
      
      <div class="flex items-center gap-4 sm:gap-6">
        {#if $user}
          <NotificationBell />

          <div class="hidden md:block h-6 w-px bg-gray-200"></div> <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600 hidden sm:inline">Olá, <b>{$user.username}</b></span>
            
            {#if $user.role === 'PROVIDER'}
              <a href="/provider" class="text-sm font-medium text-blue-600 hover:text-blue-800 transition">Painel</a>
            {/if}
            
            <button onclick={logout} class="text-sm font-medium text-red-500 hover:text-red-700 transition">Sair</button>
          </div>
        {:else}
          <div class="flex items-center gap-4">
            <a href="/login" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Entrar</a>
            <a href="/register" class="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">Cadastrar</a>
          </div>
        {/if}
      </div>
    </div>
  </nav>

  <main class="container mx-auto p-4">
    <slot />
  </main>
</div>