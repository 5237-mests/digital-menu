<script lang="ts">
  import { api } from '$lib/api';
  import { getAuthState } from '$lib/auth';
  import type { DashboardSales, DashboardStats } from '@restaurant/shared-types';
  import { onMount } from 'svelte';

  let stats = $state<DashboardStats | null>(null);
  let sales = $state<DashboardSales[]>([]);
  let error = $state('');

  onMount(async () => {
    const auth = getAuthState();
    if (!auth.accessToken) {
      return;
    }

    try {
      [stats, sales] = await Promise.all([
        api.getDashboardStats(auth.accessToken),
        api.getDashboardSales(auth.accessToken)
      ]);
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'Unable to load dashboard';
    }
  });
</script>

<main class="mx-auto max-w-6xl space-y-6 px-4 py-6">
  {#if error}
    <p class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
  {/if}

  {#if stats}
    <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p class="text-sm text-slate-600">Pending</p>
        <p class="text-3xl font-semibold">{stats.pendingOrders}</p>
      </article>
      <article class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p class="text-sm text-slate-600">Preparing</p>
        <p class="text-3xl font-semibold">{stats.preparingOrders}</p>
      </article>
      <article class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p class="text-sm text-slate-600">Ready</p>
        <p class="text-3xl font-semibold">{stats.readyOrders}</p>
      </article>
      <article class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <p class="text-sm text-slate-600">Total sales</p>
        <p class="text-3xl font-semibold">${stats.totalSales}</p>
      </article>
    </section>
  {/if}

  <section class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
    <h2 class="text-lg font-semibold">Recent sales</h2>
    <div class="mt-4 space-y-2">
      {#each sales as row}
        <div class="flex items-center justify-between text-sm">
          <span>{row.date}</span>
          <span>{row.orders} orders · ${row.totalSales}</span>
        </div>
      {:else}
        <p class="text-sm text-slate-600">No sales yet.</p>
      {/each}
    </div>
  </section>
</main>
