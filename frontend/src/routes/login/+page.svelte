<script lang="ts">
  import { api, user } from '$lib/api';
  import { goto } from '$app/navigation';

  let email = $state('');
  let password = $state('');
  let error = $state('');

  async function handleLogin(event: Event) {
    event.preventDefault();
    try {
      const res = await api('/auth/login', 'POST', { email, password });
      const payload = JSON.parse(atob(res.access_token.split('.')[1]));
      
      user.set({
        id: payload.sub,
        email: payload.email,
        username: payload.username,
        role: payload.role,
        access_token: res.access_token
      });

      goto('/');
    } catch (e: any) {
      error = e.message;
    }
  }
</script>

<div class="max-w-md mx-auto bg-white p-8 rounded shadow">
  <h2 class="text-2xl font-bold mb-6">Login</h2>
  {#if error} <p class="text-red-500 mb-4">{error}</p> {/if}
  
  <form onsubmit={handleLogin} class="space-y-4">
    <input bind:value={email} type="email" placeholder="Email" class="w-full border p-2 rounded" required />
    <input bind:value={password} type="password" placeholder="Senha" class="w-full border p-2 rounded" required />
    <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Entrar</button>
  </form>
</div>