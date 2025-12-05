<script lang="ts">
  import { api } from '$lib/api';
  import { goto } from '$app/navigation';
  import { slide } from 'svelte/transition'; 

  let username = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let role = $state('CLIENT');
  let city = $state('');
  let description = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleRegister(event: Event) {
    event.preventDefault();
    if (password !== confirmPassword) { error = 'As senhas não coincidem.'; return; }
    loading = true; error = '';

    try {
      const payload: any = { username, email, password, confirmPassword, role };
      if (role === 'PROVIDER') {
        if (!city || !description) throw new Error('Preencha cidade e descrição.');
        payload.city = city; payload.description = description;
      }
      await api('/user', 'POST', payload);
      alert('Conta criada com sucesso!');
      goto('/login');
    } catch (e: any) {
      error = Array.isArray(e.message) ? e.message.join(', ') : e.message;
    } finally { loading = false; }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100">
    
    <div class="text-center">
      <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">Crie sua Conta</h2>
      <p class="mt-2 text-sm text-gray-500">
        Junte-se ao marketplace e conecte-se.
      </p>
    </div>
    
    {#if error}
      <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-pulse">
        <div class="flex">
          <div class="ml-3">
            <p class="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    {/if}
    
    <form class="mt-8 space-y-5" onsubmit={handleRegister}>
      
      <div>
        <div class="block text-sm font-medium text-gray-700 mb-2">Eu sou:</div>
        <div class="grid grid-cols-2 gap-3">
          <label class="relative cursor-pointer group">
            <input type="radio" bind:group={role} value="CLIENT" class="peer sr-only">
            <div class="p-3 text-center rounded-xl border border-gray-200 bg-white transition-all hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 peer-checked:ring-1 peer-checked:ring-blue-500">
              <span class="block text-sm font-bold">Cliente</span>
              <span class="text-xs text-gray-500 peer-checked:text-blue-600">Quero contratar</span>
            </div>
          </label>

          <label class="relative cursor-pointer group">
            <input type="radio" bind:group={role} value="PROVIDER" class="peer sr-only">
            <div class="p-3 text-center rounded-xl border border-gray-200 bg-white transition-all hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 peer-checked:ring-1 peer-checked:ring-blue-500">
              <span class="block text-sm font-bold">Profissional</span>
              <span class="text-xs text-gray-500 peer-checked:text-blue-600">Quero trabalhar</span>
            </div>
          </label>
        </div>
      </div>

      <div class="space-y-4">
        <div class="relative">
          <input id="username" bind:value={username} type="text" required 
                 class="peer w-full border-gray-300 border-b-2 border-t-0 border-x-0 bg-transparent px-0 py-2 text-gray-900 placeholder-transparent focus:border-blue-600 focus:ring-0 sm:text-sm" 
                 placeholder="Nome Completo" />
          <label for="username" 
                 class="absolute left-0 -top-3.5 text-xs text-gray-600 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-blue-600">
            Nome Completo
          </label>
        </div>

        <div class="relative">
          <input id="email" bind:value={email} type="email" required 
                 class="peer w-full border-gray-300 border-b-2 border-t-0 border-x-0 bg-transparent px-0 py-2 text-gray-900 placeholder-transparent focus:border-blue-600 focus:ring-0 sm:text-sm" 
                 placeholder="Email" />
          <label for="email" 
                 class="absolute left-0 -top-3.5 text-xs text-gray-600 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-blue-600">
            Email
          </label>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="relative">
            <input id="password" bind:value={password} type="password" required minlength="8"
                   class="peer w-full border-gray-300 border-b-2 border-t-0 border-x-0 bg-transparent px-0 py-2 text-gray-900 placeholder-transparent focus:border-blue-600 focus:ring-0 sm:text-sm" 
                   placeholder="Senha" />
            <label for="password" 
                   class="absolute left-0 -top-3.5 text-xs text-gray-600 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-blue-600">
              Senha
            </label>
          </div>
          <div class="relative">
            <input id="confirmPassword" bind:value={confirmPassword} type="password" required minlength="8"
                   class="peer w-full border-gray-300 border-b-2 border-t-0 border-x-0 bg-transparent px-0 py-2 text-gray-900 placeholder-transparent focus:border-blue-600 focus:ring-0 sm:text-sm" 
                   placeholder="Confirmar" />
            <label for="confirmPassword" 
                   class="absolute left-0 -top-3.5 text-xs text-gray-600 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-blue-600">
              Confirmar
            </label>
          </div>
        </div>
      </div>

      {#if role === 'PROVIDER'}
        <div transition:slide class="bg-gray-50 p-4 rounded-xl space-y-4 border border-gray-100">
          <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wide">Perfil Profissional</h4>
          
          <div class="relative">
            <input id="city" bind:value={city} type="text" required 
                   class="peer w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                   placeholder=" " />
            <label for="city" class="absolute left-3 -top-2 bg-gray-50 px-1 text-xs text-gray-500">Cidade</label>
          </div>

          <div class="relative">
            <textarea id="desc" bind:value={description} required rows="2"
                      class="peer w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder=" "></textarea>
            <label for="desc" class="absolute left-3 -top-2 bg-gray-50 px-1 text-xs text-gray-500">Bio / Experiência</label>
          </div>
        </div>
      {/if}

      <button type="submit" disabled={loading}
        class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 disabled:opacity-70 disabled:cursor-not-allowed mt-6">
        {#if loading}
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Processando...
        {:else}
          Finalizar Cadastro
        {/if}
      </button>

      <div class="text-center mt-4">
        <p class="text-xs text-gray-500">
          Já tem uma conta? 
          <a href="/login" class="font-medium text-blue-600 hover:text-blue-500 transition hover:underline">Entrar agora</a>
        </p>
      </div>
    </form>
  </div>
</div>