<script lang="ts">
  import { api } from '$lib/api';
  import { getAuthState } from '$lib/auth';
  import type { Table } from '@restaurant/shared-types';
  import { onMount } from 'svelte';

  let tables = $state<Table[]>([]);
  let tableNumber = $state(5);
  let error = $state('');

  async function load() {
    const token = getAuthState().accessToken!;
    tables = await api.getTables(token);
  }

  async function createTable() {
    const token = getAuthState().accessToken!;
    await api.createTable(token, { tableNumber, status: 'AVAILABLE' });
    tableNumber += 1;
    await load();
  }

  async function removeTable(id: number) {
    const token = getAuthState().accessToken!;
    await api.deleteTable(token, id);
    await load();
  }

  onMount(() => {
    load().catch((caught) => {
      error = caught instanceof Error ? caught.message : 'Unable to load tables';
    });
  });
</script>

<main class="mx-auto max-w-4xl space-y-4 px-4 py-6">
  <h2 class="text-2xl font-semibold">Tables & QR codes</h2>
  {#if error}<p class="text-sm text-red-700">{error}</p>{/if}
  <form class="flex gap-2" onsubmit={(event) => { event.preventDefault(); void createTable(); }}>
    <input class="w-32 rounded-xl border border-slate-300 px-3 py-2" type="number" bind:value={tableNumber} min="1" />
    <button class="rounded-xl bg-teal-700 px-4 py-2 text-white" type="submit">Add table</button>
  </form>
  <ul class="space-y-2">
    {#each tables as table}
      <li class="rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="font-medium">Table {table.tableNumber}</p>
            <p class="text-sm text-slate-600">QR: {table.qrCode}</p>
            <a class="text-sm text-teal-700" href={`/menu/${table.qrCode}`}>/menu/{table.qrCode}</a>
          </div>
          <button class="text-sm text-red-700" onclick={() => removeTable(table.id)}>Delete</button>
        </div>
      </li>
    {/each}
  </ul>
</main>
