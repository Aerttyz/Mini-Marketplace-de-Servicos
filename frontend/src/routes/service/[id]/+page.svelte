<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { api, user } from '$lib/api';
  import type { Service, Variation } from '$lib/types';

  let service: Service | null = null;
  let selectedDate = '';
  let availableSlots: string[] = [];
  let selectedSlot = '';
  let selectedVariation: Variation | null = null;
  let message = '';

  onMount(async () => {
    service = await api(`/services/${$page.params.id}`);
    if (service && service.variations.length > 0) {
        selectedVariation = service.variations[0];
    }
  });

  async function checkAvailability() {
    if (!selectedDate || !service) return;
    availableSlots = await api(`/availability/${service.provider.id}/slots?date=${selectedDate}`);
  }

  async function book() {
    if (!$user) return alert('Faça login para contratar');
    
    // 🔒 BLOQUEIO LÓGICO: Impede prestador de contratar
    if ($user.role === 'PROVIDER') {
      return alert('Prestadores não podem contratar serviços. Entre com uma conta de Cliente.');
    }

    if (!selectedSlot || !selectedVariation || !selectedDate) return;

    try {
      const dateTimeString = `${selectedDate}T${selectedSlot}:00.000Z`;

      await api('/appointments', 'POST', {
        providerId: service?.provider.id,
        variationId: selectedVariation?.id,
        startDate: dateTimeString
      }, $user.access_token);

      message = '✅ Serviço contratado com sucesso!';
      availableSlots = availableSlots.filter(s => s !== selectedSlot);
      selectedSlot = '';
    } catch (e: any) {
      alert(e.message);
    }
  }
</script>

{#if service}
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded shadow">
    <div>
      <img src={service.photos[0] || ''} alt={service.name} class="w-full h-64 object-cover rounded mb-4 bg-gray-200"/>
      <h1 class="text-3xl font-bold">{service.name}</h1>
      <p class="text-gray-600 mt-2">{service.description}</p>
      
      <div class="mt-6 border-t pt-4">
        <h3 class="font-semibold mb-2">Prestador:</h3>
        <p>{service.provider.user.username}</p>
        <p class="text-sm text-gray-500">{service.provider.user.city}</p>
      </div>
    </div>

    <div class="bg-gray-50 p-6 rounded border h-fit">
      <h2 class="text-xl font-bold mb-4">Contratar Serviço</h2>

      {#if message}
        <div class="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm font-medium">{message}</div>
      {/if}

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Opção</label>
        <select bind:value={selectedVariation} class="w-full border p-2 rounded bg-white">
          {#each service.variations as v}
            <option value={v}>{v.name} - R$ {v.price} ({v.duration_minutes} min)</option>
          {/each}
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Data</label>
        <input 
          type="date" 
          bind:value={selectedDate} 
          on:change={checkAvailability}
          class="w-full border p-2 rounded"
        />
      </div>

      {#if availableSlots.length > 0}
        <div class="mb-6">
          <label class="block text-sm font-medium mb-2">Horários Disponíveis</label>
          <div class="grid grid-cols-4 gap-2">
            {#each availableSlots as slot}
              <button 
                class="p-2 text-sm rounded border transition-colors {selectedSlot === slot ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-blue-50 border-gray-200 text-gray-700'}"
                on:click={() => selectedSlot = slot}
              >
                {slot}
              </button>
            {/each}
          </div>
        </div>
      {:else if selectedDate}
        <div class="p-3 bg-orange-50 text-orange-600 text-sm rounded mb-4 border border-orange-100">
          Nenhum horário disponível nesta data.
        </div>
      {/if}

      {#if $user && $user.role === 'PROVIDER'}
        <div class="p-3 bg-gray-200 text-gray-600 text-sm text-center rounded font-medium border border-gray-300">
          Prestadores não podem contratar.<br>Entre como Cliente.
        </div>
      {:else}
        <button 
          on:click={book} 
          disabled={!selectedSlot || !$user}
          class="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {$user ? 'Confirmar Agendamento' : 'Faça Login para Agendar'}
        </button>
      {/if}
    </div>
  </div>
{:else}
  <div class="text-center py-20 text-gray-500">Carregando detalhes do serviço...</div>
{/if}   