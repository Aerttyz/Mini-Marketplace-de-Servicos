<script lang="ts">
  import { api, user } from '$lib/api';
  import { goto } from '$app/navigation';
  import { slide } from 'svelte/transition';
  import type { TimeSlot } from '$lib/types';
  import type { PageData } from './$types';
  
  const DAYS = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  let { data }: { data: PageData } = $props();

  let schedule = $state<TimeSlot[][]>(Array(7).fill(null).map(() => []));
  let loading = $state(false);

  function minutesToTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const minutes = (totalMinutes % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  $effect(() => {
    if (data.scheduleData && Array.isArray(data.scheduleData)) {
        const loadedSchedule: TimeSlot[][] = Array(7).fill(null).map(() => []);

        data.scheduleData.forEach((item: any) => {
          const start = minutesToTime(item.start_time);
          const end = minutesToTime(item.end_time);
          loadedSchedule[item.day_of_week].push({ start, end });
        });

        schedule = loadedSchedule;
    }
  });

  function addSlot(dayIndex: number) {
    schedule[dayIndex].push({ start: '08:00', end: '18:00' });
  }

  function removeSlot(dayIndex: number, slotIndex: number) {
    schedule[dayIndex] = schedule[dayIndex].filter((_, i) => i !== slotIndex);
  }

  async function save() {
    if (!$user) return goto('/login');
    
    loading = true;
    try {
      const payload = {
        slots: schedule.flatMap((slots, dayIndex) => 
          slots.map(slot => ({
            dayOfWeek: dayIndex,
            startTime: slot.start,
            endTime: slot.end
          }))
        )
      };

      await api('/availability', 'POST', payload, $user.access_token);
      alert('Agenda salva com sucesso!');
      goto('/provider');
    } catch (e: any) {
      alert('Erro ao salvar: ' + e.message);
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-4xl mx-auto py-10 px-4">
  <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Configurar Horários</h1>
      <p class="text-gray-500 mt-1">Defina seus dias e horários de atendimento.</p>
    </div>
    <div class="flex gap-3">
      <a href="/provider" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium">Cancelar</a>
      <button onclick={save} disabled={loading} 
        class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition transform disabled:opacity-50">
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </div>
  </div>

  <div class="space-y-6">
    {#each DAYS as dayName, dayIndex}
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition hover:shadow-md">
        
        <div class="bg-gray-50/80 px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <div class="flex items-center gap-3">
            <span class="font-bold text-gray-700">{dayName}</span>
            {#if schedule[dayIndex].length === 0}
              <span class="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Fechado</span>
            {:else}
              <span class="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                {schedule[dayIndex].length} horário(s)
              </span>
            {/if}
          </div>
          <button onclick={() => addSlot(dayIndex)} class="text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1.5 rounded transition">
            + Adicionar Horário
          </button>
        </div>

        <div class="p-6">
          {#if schedule[dayIndex].length === 0}
            <p class="text-sm text-gray-400 italic">Nenhum horário definido. Você não aparecerá nas buscas deste dia.</p>
          {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" transition:slide>
              {#each schedule[dayIndex] as slot, i}
                <div class="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 group hover:border-blue-300 transition-colors">
                  <div class="flex-1 flex items-center gap-2">
                    <input type="time" bind:value={slot.start} class="w-full bg-white border-gray-300 rounded text-sm focus:border-blue-500 focus:ring-blue-500 py-1" />
                    <span class="text-gray-400 text-sm">às</span>
                    <input type="time" bind:value={slot.end} class="w-full bg-white border-gray-300 rounded text-sm focus:border-blue-500 focus:ring-blue-500 py-1" />
                  </div>
                  <button onclick={() => removeSlot(dayIndex, i)} 
                    class="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition" title="Remover">
                    ✕
                  </button>
                </div>
              {/each}
            </div>
          {/if}
        </div>

      </div>
    {/each}
  </div>
</div>