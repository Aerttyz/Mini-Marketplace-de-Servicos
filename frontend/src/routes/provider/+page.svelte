<script lang="ts">
  import { onMount } from 'svelte';
  import { api, user } from '$lib/api';
  import { goto } from '$app/navigation';

  interface Appointment {
    id: string;
    start_date: string;
    end_date: string;
    status: string;
    client: { username: string; email: string };
    variation: { name: string; price: string; duration_minutes: number };
  }

  let appointments: Appointment[] = [];
  let loading = true;

  onMount(async () => {
    if (!$user || $user.role !== 'PROVIDER') return goto('/login');
    try {
      appointments = await api('/appointments/my-schedule', 'GET', null, $user.access_token);
    } catch (error) {
      console.error(error);
    } finally {
      loading = false;
    }
  });

  function formatDate(isoString: string) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  }

  async function cancelAppointment(id: string) {
    if(!confirm('Deseja realmente cancelar este agendamento?')) return;
    if (!$user) return;
    try {
      await api(`/appointments/${id}/cancel`, 'PATCH', null, $user.access_token);
      appointments = appointments.map(app => 
        app.id === id ? { ...app, status: 'CANCELLED' } : app
      );
    } catch (e: any) { alert(e.message); }
  }
</script>

<div class="max-w-6xl mx-auto px-4 py-8">
  <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Minha Agenda</h1>
      <p class="text-gray-500 mt-1">Gerencie seus serviços contratados e horários.</p>
    </div>
    
    <div class="flex gap-3">
      <a href="/provider/availability" 
         class="bg-white text-gray-700 border border-gray-200 px-5 py-3 rounded-xl font-medium shadow-sm hover:bg-gray-50 hover:border-gray-300 transition transform hover:-translate-y-0.5">
        ⚙️ Configurar Horários
      </a>
      <a href="/provider/create-service" 
         class="bg-blue-600 text-white px-5 py-3 rounded-xl font-medium shadow-lg shadow-blue-200 hover:bg-blue-700 transition transform hover:-translate-y-0.5">
        + Novo Serviço
      </a>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center py-20 text-gray-400 animate-pulse">Carregando agenda...</div>
  {:else if appointments.length === 0}
    <div class="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
      <div class="text-gray-300 text-6xl mb-4">📅</div>
      <h3 class="text-xl font-semibold text-gray-800">Nenhum serviço agendado</h3>
      <p class="text-gray-500 mt-2">Quando os clientes contratarem, eles aparecerão aqui.</p>
    </div>
  {:else}
    <div class="bg-white rounded-2xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100">
          <thead class="bg-gray-50/50">
            <tr>
              <th class="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
              <th class="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Serviço</th>
              <th class="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Data & Hora</th>
              <th class="px-8 py-5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-8 py-5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            {#each appointments as app}
              <tr class="hover:bg-gray-50/50 transition duration-150">
                <td class="px-8 py-6">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      {app.client.username.charAt(0).toUpperCase()}
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-semibold text-gray-900">{app.client.username}</div>
                      <div class="text-sm text-gray-500">{app.client.email}</div>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-6">
                  <div class="text-sm font-medium text-gray-900">{app.variation.name}</div>
                  <div class="text-sm text-gray-500 mt-0.5">R$ {app.variation.price} • {app.variation.duration_minutes} min</div>
                </td>
                <td class="px-8 py-6 text-sm text-gray-600">
                  <span class="bg-gray-100 px-3 py-1 rounded-md text-gray-700 font-medium">
                    {formatDate(app.start_date)}
                  </span>
                </td>
                <td class="px-8 py-6">
                  <span class={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border 
                    ${app.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border-green-200' : 
                      app.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                    {app.status === 'CONFIRMED' ? 'Confirmado' : 
                     app.status === 'CANCELLED' ? 'Cancelado' : app.status}
                  </span>
                </td>
                <td class="px-8 py-6 text-right text-sm">
                  {#if app.status !== 'CANCELLED'}
                    <button on:click={() => cancelAppointment(app.id)} 
                            class="text-red-500 hover:text-red-700 font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg transition">
                      Cancelar
                    </button>
                  {:else}
                    <span class="text-gray-300 italic">Encerrado</span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>