<script lang="ts">
  import { api } from '$lib/api';
  import { getAuthState } from '$lib/auth';
  import type { Category } from '@restaurant/shared-types';
  import { onMount } from 'svelte';

  let categories = $state<Category[]>([]);
  let name = $state('');
  let error = $state('');

  async function load() {
    const token = getAuthState().accessToken!;
    categories = await api.getCategories(token);
  }

  async function createCategory() {
    const token = getAuthState().accessToken!;
    await api.createCategory(token, { name, isActive: true, sortOrder: categories.length * 10 });
    name = '';
    await load();
  }

  async function removeCategory(id: number) {
    const token = getAuthState().accessToken!;
    await api.deleteCategory(token, id);
    await load();
  }

  onMount(() => {
    load().catch((caught) => {
      error = caught instanceof Error ? caught.message : 'Unable to load categories';
    });
  });
</script>

<main class="mx-auto max-w-4xl space-y-4 px-4 py-6">
  <h2 class="text-2xl font-semibold">Categories</h2>
  {#if error}<p class="text-sm text-red-700">{error}</p>{/if}
  <form class="flex gap-2" onsubmit={(event) => { event.preventDefault(); void createCategory(); }}>
    <input class="flex-1 rounded-xl border border-slate-300 px-3 py-2" bind:value={name} placeholder="New category" required />
    <button class="rounded-xl bg-teal-700 px-4 py-2 text-white" type="submit">Add</button>
  </form>
  <ul class="space-y-2">
    {#each categories as category}
      <li class="flex items-center justify-between rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200">
        <span>{category.name}</span>
        <button class="text-sm text-red-700" onclick={() => removeCategory(category.id)}>Delete</button>
      </li>
    {/each}
  </ul>
</main>
