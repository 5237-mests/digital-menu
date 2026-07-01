<script lang="ts">
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { setAuthState } from '$lib/auth';

  let email = $state('admin@example.com');
  let password = $state('Admin123!');
  let error = $state('');
  let loading = $state(false);
  let redirectTo = $state('/admin');

  $effect(() => {
    const params = new URLSearchParams(window.location.search);
    redirectTo = params.get('redirect') ?? '/admin';
  });

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    loading = true;
    error = '';

    try {
      const response = await api.login(email, password);
      setAuthState({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user
      });
      await goto(redirectTo);
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'Login failed';
    } finally {
      loading = false;
    }
  }
</script>

<main class="mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
  <form class="w-full space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200" onsubmit={submit}>
    <div>
      <h1 class="text-2xl font-semibold text-slate-900">Staff login</h1>
      <p class="mt-1 text-sm text-slate-600">Sign in to access kitchen or admin tools.</p>
    </div>

    {#if error}
      <p class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
    {/if}

    <label class="block space-y-1 text-sm">
      <span>Email</span>
      <input class="w-full rounded-xl border border-slate-300 px-3 py-2" bind:value={email} type="email" required />
    </label>

    <label class="block space-y-1 text-sm">
      <span>Password</span>
      <input class="w-full rounded-xl border border-slate-300 px-3 py-2" bind:value={password} type="password" required />
    </label>

    <button class="w-full rounded-xl bg-teal-700 px-4 py-2 font-medium text-white disabled:opacity-60" disabled={loading} type="submit">
      {loading ? 'Signing in...' : 'Sign in'}
    </button>
  </form>
</main>
