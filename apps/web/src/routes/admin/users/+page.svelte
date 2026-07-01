<script lang="ts">
  import { api } from '$lib/api';
  import { getAuthState } from '$lib/auth';
  import type { PublicUser } from '@restaurant/shared-types';
  import { onMount } from 'svelte';

  let users = $state<PublicUser[]>([]);
  let name = $state('');
  let email = $state('');
  let password = $state('Chef123!');
  let role = $state<'ADMIN' | 'CHEF'>('CHEF');
  let error = $state('');

  async function load() {
    const token = getAuthState().accessToken!;
    users = await api.getUsers(token);
  }

  async function createUser() {
    const token = getAuthState().accessToken!;
    await api.createUser(token, { name, email, password, role });
    name = '';
    email = '';
    await load();
  }

  async function removeUser(id: number) {
    const token = getAuthState().accessToken!;
    await api.deleteUser(token, id);
    await load();
  }

  onMount(() => {
    load().catch((caught) => {
      error = caught instanceof Error ? caught.message : 'Unable to load users';
    });
  });
</script>

<main class="mx-auto max-w-4xl space-y-4 px-4 py-6">
  <h2 class="text-2xl font-semibold">Users</h2>
  {#if error}<p class="text-sm text-red-700">{error}</p>{/if}
  <form class="grid gap-2 rounded-2xl bg-white p-4 ring-1 ring-slate-200 md:grid-cols-2" onsubmit={(event) => { event.preventDefault(); void createUser(); }}>
    <input class="rounded-xl border border-slate-300 px-3 py-2" bind:value={name} placeholder="Name" required />
    <input class="rounded-xl border border-slate-300 px-3 py-2" bind:value={email} type="email" placeholder="Email" required />
    <input class="rounded-xl border border-slate-300 px-3 py-2" bind:value={password} type="password" placeholder="Password" required />
    <select class="rounded-xl border border-slate-300 px-3 py-2" bind:value={role}>
      <option value="CHEF">Chef</option>
      <option value="ADMIN">Admin</option>
    </select>
    <button class="rounded-xl bg-teal-700 px-4 py-2 text-white md:col-span-2" type="submit">Add user</button>
  </form>
  <ul class="space-y-2">
    {#each users as user}
      <li class="flex items-center justify-between rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200">
        <div>
          <p class="font-medium">{user.name}</p>
          <p class="text-sm text-slate-600">{user.email} · {user.role}</p>
        </div>
        <button class="text-sm text-red-700" onclick={() => removeUser(user.id)}>Delete</button>
      </li>
    {/each}
  </ul>
</main>
