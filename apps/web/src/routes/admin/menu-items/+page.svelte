<script lang="ts">
  import { api } from '$lib/api';
  import { getAuthState } from '$lib/auth';
  import type { Category, MenuItem } from '@restaurant/shared-types';
  import { onMount } from 'svelte';

  let items = $state<MenuItem[]>([]);
  let categories = $state<Category[]>([]);
  let name = $state('');
  let categoryId = $state(0);
  let price = $state('9.99');
  let preparationTime = $state(10);
  let error = $state('');

  async function load() {
    const token = getAuthState().accessToken!;
    [items, categories] = await Promise.all([api.getMenuItems(token), api.getCategories(token)]);
    if (!categoryId && categories[0]) {
      categoryId = categories[0].id;
    }
  }

  async function createItem() {
    const token = getAuthState().accessToken!;
    await api.createMenuItem(token, { name, categoryId, price, preparationTime, isAvailable: true });
    name = '';
    await load();
  }

  async function removeItem(id: number) {
    const token = getAuthState().accessToken!;
    await api.deleteMenuItem(token, id);
    await load();
  }

  onMount(() => {
    load().catch((caught) => {
      error = caught instanceof Error ? caught.message : 'Unable to load menu items';
    });
  });
</script>

<main class="mx-auto max-w-4xl space-y-4 px-4 py-6">
  <h2 class="text-2xl font-semibold">Menu items</h2>
  {#if error}<p class="text-sm text-red-700">{error}</p>{/if}
  <form class="grid gap-2 rounded-2xl bg-white p-4 ring-1 ring-slate-200 md:grid-cols-2" onsubmit={(event) => { event.preventDefault(); void createItem(); }}>
    <input class="rounded-xl border border-slate-300 px-3 py-2" bind:value={name} placeholder="Name" required />
    <select class="rounded-xl border border-slate-300 px-3 py-2" bind:value={categoryId}>
      {#each categories as category}
        <option value={category.id}>{category.name}</option>
      {/each}
    </select>
    <input class="rounded-xl border border-slate-300 px-3 py-2" bind:value={price} placeholder="Price" required />
    <input class="rounded-xl border border-slate-300 px-3 py-2" type="number" bind:value={preparationTime} min="1" />
    <button class="rounded-xl bg-teal-700 px-4 py-2 text-white md:col-span-2" type="submit">Add item</button>
  </form>
  <ul class="space-y-2">
    {#each items as item}
      <li class="flex items-center justify-between rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200">
        <div>
          <p class="font-medium">{item.name}</p>
          <p class="text-sm text-slate-600">${item.price}</p>
        </div>
        <button class="text-sm text-red-700" onclick={() => removeItem(item.id)}>Delete</button>
      </li>
    {/each}
  </ul>
</main>
