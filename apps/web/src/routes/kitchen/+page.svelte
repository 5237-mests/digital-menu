<script lang="ts">
  import { api } from '$lib/api';
  import { getAuthState } from '$lib/auth';
  import { onKitchenQueueUpdated, onOrderCreated, onOrderUpdated } from '$lib/socket';
  import type { Order, OrderStatus } from '@restaurant/shared-types';
  import { onMount } from 'svelte';

  let orders = $state<Order[]>([]);
  let error = $state('');
  let loading = $state(true);

  async function loadOrders() {
    const auth = getAuthState();
    if (!auth.accessToken) {
      return;
    }

    orders = await api.getOrders(auth.accessToken);
  }

  async function updateStatus(orderId: number, status: OrderStatus) {
    const auth = getAuthState();
    if (!auth.accessToken) {
      return;
    }

    await api.updateOrderStatus(auth.accessToken, orderId, status);
    await loadOrders();
  }

  onMount(() => {
    loadOrders()
      .catch((caught) => {
        error = caught instanceof Error ? caught.message : 'Unable to load orders';
      })
      .finally(() => {
        loading = false;
      });

    const unsubscribers = [
      onOrderCreated(() => void loadOrders()),
      onOrderUpdated(() => void loadOrders()),
      onKitchenQueueUpdated(() => void loadOrders())
    ];

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  });

  const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
    PENDING: 'PREPARING',
    PREPARING: 'READY',
    READY: 'DELIVERED'
  };
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
  {#if error}
    <p class="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>
  {/if}

  {#if loading}
    <p class="text-slate-300">Loading queue...</p>
  {:else}
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {#each orders.filter((order) => order.status !== 'DELIVERED' && order.status !== 'CANCELLED') as order}
        <article class="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-teal-300">{order.orderNumber}</p>
              <p class="mt-1 text-lg font-semibold">Table #{order.tableId}</p>
            </div>
            <span class="rounded-full bg-teal-500/20 px-3 py-1 text-xs font-medium text-teal-200">{order.status}</span>
          </div>
          <p class="mt-3 text-sm text-slate-300">Total: ${order.total}</p>

          {#if nextStatus[order.status]}
            <button class="mt-4 w-full rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium" onclick={() => updateStatus(order.id, nextStatus[order.status]!)}>
              Mark {nextStatus[order.status]}
            </button>
          {/if}
        </article>
      {:else}
        <p class="text-slate-300">No active orders in the queue.</p>
      {/each}
    </div>
  {/if}
</main>
