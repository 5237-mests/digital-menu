<script lang="ts">
  import { api } from "$lib/api";
  import { getAuthState } from "$lib/auth";
  import {
    onKitchenQueueUpdated,
    onOrderCreated,
    onOrderUpdated,
  } from "$lib/socket";
  import type { Order, OrderStatus } from "@restaurant/shared-types";
  import { onMount } from "svelte";

  let orders = $state<Order[]>([]);
  let error = $state("");
  let loading = $state(true);

  // Track visibility, individual order item data, and fetch loading states
  let visibleOrderItems = $state(new Set<number>());
  let orderDetailsCache = $state<Record<number, any>>({});
  let loadingDetails = $state<Record<number, boolean>>({});

  // Dynamic filter for active dashboard orders
  const activeOrders = $derived(
    orders.filter((o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"),
  );

  async function loadOrders() {
    const auth = getAuthState();
    if (!auth.accessToken) return;
    orders = await api.getOrders(auth.accessToken);
  }

  async function toggleOrderItems(orderId: number) {
    if (visibleOrderItems.has(orderId)) {
      visibleOrderItems.delete(orderId);
      // Force reactivity update by re-assigning a new Set instance
      visibleOrderItems = new Set(visibleOrderItems);
      return;
    }

    // Add the ID and create a fresh Set reference to trigger the UI update
    visibleOrderItems.add(orderId);
    visibleOrderItems = new Set(visibleOrderItems);

    if (!orderDetailsCache[orderId]) {
      const auth = getAuthState();
      if (!auth.accessToken) return;

      try {
        loadingDetails[orderId] = true;
        const details = await api.getOrder(orderId);
        orderDetailsCache[orderId] = details;
      } catch (err) {
        console.error(`Failed to load details for order ${orderId}`, err);
      } finally {
        loadingDetails[orderId] = false;
      }
    }
  }

  async function updateStatus(orderId: number, status: OrderStatus) {
    const auth = getAuthState();
    if (!auth.accessToken) return;

    await api.updateOrderStatus(auth.accessToken, orderId, status);
    await loadOrders();
  }

  onMount(() => {
    loadOrders()
      .catch((caught) => {
        error =
          caught instanceof Error ? caught.message : "Unable to load orders";
      })
      .finally(() => {
        loading = false;
      });

    const unsubscribers = [
      onOrderCreated(() => void loadOrders()),
      onOrderUpdated(() => void loadOrders()),
      onKitchenQueueUpdated(() => void loadOrders()),
    ];

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  });

  const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
    PENDING: "PREPARING",
    PREPARING: "READY",
    READY: "DELIVERED",
  };
</script>

<main class="mx-auto max-w-6xl px-4 py-6">
  {#if error}
    <p class="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-200">
      {error}
    </p>
  {/if}

  {#if loading}
    <p class="text-slate-300">Loading queue...</p>
  {:else}
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {#each activeOrders as order (order.id)}
        <article class="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-sm text-teal-300">Order Number: {order.id}</p>
              <p class="mt-1 text-lg font-semibold">Table #{order.tableId}</p>
            </div>
            <span
              class="rounded-full bg-teal-500/20 px-3 py-1 text-xs font-medium text-teal-200"
            >
              {order.status}
            </span>
          </div>

          <p class="mt-3 text-sm text-slate-300">Total: ${order.total}</p>

          <button
            class="mt-3 text-sm text-slate-300 underline block"
            onclick={() => toggleOrderItems(order.id)}
          >
            {visibleOrderItems.has(order.id) ? "Hide items" : "Show items"}
          </button>

          {#if visibleOrderItems.has(order.id)}
            <div class="mt-3 border-t border-white/5 pt-2">
              {#if loadingDetails[order.id]}
                <p class="text-xs text-slate-400 animate-pulse">
                  Loading items...
                </p>
              {:else if orderDetailsCache[order.id]}
                <ul class="space-y-2">
                  {#each orderDetailsCache[order.id].items as item}
                    <li class="flex items-center justify-between gap-2">
                      <span class="text-sm text-slate-300"
                        >{item.item_name}</span
                      >
                      <span class="text-sm text-slate-300"
                        >x{item.quantity}</span
                      >
                    </li>
                  {/each}
                </ul>
              {:else}
                <p class="text-xs text-red-400">Failed to load items.</p>
              {/if}
            </div>
          {/if}

          <!-- {#if order.specialInstructions}
            <p class="mt-3 text-sm text-slate-300">
              <strong>Special Instructions:</strong>
              {order.specialInstructions}
            </p>
          {/if} -->

          <!-- {#if order.notes}
            <p class="mt-3 text-sm text-slate-300">
              <strong>Notes:</strong>
              {order.notes}
            </p>
          {/if} -->

          <div
            class="mt-4 border-t border-white/5 pt-2 text-xs text-slate-400 space-y-1"
          >
            {#if order.createdAt}
              <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
            {/if}
            <!-- {#if order.updatedAt}
              <p>Updated: {new Date(order.updatedAt).toLocaleString()}</p>
            {/if} -->
          </div>

          <div class="mt-4 flex flex-col gap-2">
            <!-- <button
              class="w-full rounded-xl bg-red-600/80 hover:bg-red-600 px-4 py-2 text-sm font-medium transition"
              onclick={() => updateStatus(order.id, "CANCELLED")}
            >
              Cancel Order**
            </button> -->

            {#if nextStatus[order.status]}
              <button
                class="w-full rounded-xl bg-teal-600 hover:bg-teal-500 px-4 py-2 text-sm font-medium transition"
                onclick={() =>
                  updateStatus(order.id, nextStatus[order.status]!)}
              >
                Mark {nextStatus[order.status]}
              </button>
            {/if}
          </div>
        </article>
      {:else}
        <p class="text-slate-300 col-span-full text-center py-12">
          No active orders in the queue.
        </p>
      {/each}
    </div>
  {/if}
</main>
