<script lang="ts">
  import type { PageData } from './$types';
  import { api, user } from '$lib/api';
  import { goto } from '$app/navigation';

  let { data }: { data: PageData } = $props();

  let categories = $derived(data.categories);
  
  let name = $state("");
  let description = $state("");
  let categoryId = $state("");
  let photoUrl = $state("");
  let variations = $state([{ name: '', price: 0, duration_minutes: 30 }]);

  function addVariation() { 
    variations.push({ name: '', price: 0, duration_minutes: 30 }); 
  }
  function removeVariation(index: number) { 
    if (variations.length > 1) variations = variations.filter((_, i) => i !== index); 
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (!$user) return;

    try {
      await api('/services', 'POST', {
        name, description, categoryId, providerId: 'ignore',
        photos: photoUrl ? [photoUrl] : [], variations
      }, $user.access_token);
      alert('Serviço criado com sucesso!');
      goto('/provider');
    } catch (e: any) { alert('Erro: ' + e.message); }
  }
</script>

<div class="max-w-3xl mx-auto py-12 px-4 sm:px-6">
  <div class="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
    
    <div class="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
      <h1 class="text-2xl font-bold text-gray-900">Novo Serviço</h1>
      <p class="text-gray-500 text-sm mt-1">Preencha os dados do serviço que você vai oferecer.</p>
    </div>

    <form onsubmit={handleSubmit} class="p-8 space-y-8">
      
      <div class="space-y-6">
        <div>
          <label for="service-name" class="block text-sm font-semibold text-gray-700 mb-2">Nome do Serviço</label>
          <input id="service-name" bind:value={name} placeholder="Ex: Manicure Completa e Spa" required 
                 class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="category" class="block text-sm font-semibold text-gray-700 mb-2">Categoria</label>
            <select id="category" bind:value={categoryId} required class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4 bg-white">
              <option value="" disabled selected>Selecione...</option>
              {#each categories as cat}
                <option value={cat.id}>{cat.name}</option>
              {/each}
            </select>
          </div>
          <div>
            <label for="photo-url" class="block text-sm font-semibold text-gray-700 mb-2">Foto da Capa (URL)</label>
            <input id="photo-url" bind:value={photoUrl} placeholder="https://..." class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4" />
          </div>
        </div>

        <div>
          <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">Descrição Detalhada</label>
          <textarea id="description" bind:value={description} rows="4" required class="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4" placeholder="Descreva o que está incluso no serviço..."></textarea>
        </div>
      </div>

      <div class="border-t border-gray-100 my-8"></div>

      <div>
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-lg font-bold text-gray-900">Opções & Preços</h2>
            <p class="text-sm text-gray-500">Adicione variações (ex: "Pé", "Mão", "Pé e Mão").</p>
          </div>
          <button type="button" onclick={addVariation} class="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
            + Adicionar Opção
          </button>
        </div>

        <div class="space-y-4">
          {#each variations as variation, i}
            <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-gray-50 p-5 rounded-xl border border-gray-100 relative group transition hover:border-blue-200">
              <div class="flex-1 w-full">
                <label for="variation-name" class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Nome da Opção</label>
                <input id="variation-name" bind:value={variation.name} placeholder="Ex: Apenas Mão" required 
                       class="w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div class="w-full sm:w-32">
                <label for="variation-price" class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Preço (R$)</label>
                <input id="variation-price" type="number" bind:value={variation.price} min="0" step="0.01" required 
                       class="w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div class="w-full sm:w-32">
                <label for="variation-duration" class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Duração (min)</label>
                <input id="variation-duration" type="number" bind:value={variation.duration_minutes} required 
                       class="w-full border-gray-300 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              
              {#if variations.length > 1}
                <button type="button" onclick={() => removeVariation(i)} 
                        class="absolute -top-2 -right-2 sm:static sm:mt-5 bg-white text-red-500 shadow-sm border border-gray-200 p-2 rounded-full hover:bg-red-50 hover:text-red-700 transition">
                  ✕
                </button>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <div class="pt-4">
        <button type="submit" class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition transform">
          Publicar Serviço
        </button>
      </div>
    </form>
  </div>
</div>