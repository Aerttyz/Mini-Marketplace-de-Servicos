<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import type { Service } from '$lib/types';

  let services: Service[] = [];
  let search = '';

  async function loadServices() {
    // Busca serviços (usa o Elasticsearch se search tiver valor)
    const query = search ? `?search=${search}` : '';
    services = await api(`/services${query}`);
  }

  onMount(loadServices);
</script>

<div class="mb-8 flex gap-2">
  <input 
    bind:value={search} 
    placeholder="Buscar serviço (ex: pintura, manicure)..." 
    class="flex-1 border p-2 rounded"
  />
  <button on:click={loadServices} class="bg-blue-600 text-white px-6 rounded">Buscar</button>
</div>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  {#each services as service}
    <div class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
      {#if service.photos.length > 0}
        <img src={service.photos[0]} alt={service.name} class="w-full h-48 object-cover" />
      {:else}
        <div class="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">Sem foto</div>
      {/if}
      
      <div class="p-4">
        <span class="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {service.category.name}
        </span>
        <h3 class="text-lg font-bold mt-2">{service.name}</h3>
        <p class="text-gray-600 text-sm mt-1 line-clamp-2">{service.description}</p>
        
        <div class="mt-4 flex justify-between items-center">
          <div class="text-sm">
            <p class="font-medium text-gray-900">{service.provider.user.username}</p>
            <p class="text-gray-500">{service.provider.user.city || 'Local não inf.'}</p>
          </div>
          <a href={`/service/${service.id}`} class="text-blue-600 font-medium hover:underline">Ver Detalhes</a>
        </div>
      </div>
    </div>
  {/each}
</div>