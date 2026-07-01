<script lang="ts">
  import { page } from "$app/stores";
  import { api } from "$lib/api";
  import { onOrderUpdated } from "$lib/socket";
  import type { OrderDetail } from "@restaurant/shared-types";
  import { onMount } from "svelte";

  let orderDetail = $state<OrderDetail | null>(null);
  let error = $state("");
  let orderId = $derived(Number($page.params.orderId));

  onMount(async () => {
    try {
      orderDetail = await api.getOrder(orderId);
    } catch (caught) {
      error = caught instanceof Error ? caught.message : "Unable to load order";
    }

    return onOrderUpdated((payload) => {
      if (payload.order.id === orderId) {
        orderDetail = payload;
      }
    });
  });

  const statusLabels = {
    PENDING: "Waiting for kitchen",
    PREPARING: "Being prepared",
    READY: "Ready for pickup",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  } as const;
</script>

<main class="mx-auto flex min-h-screen max-w-lg flex-col gap-6 px-4 py-10">
  <a class="text-sm text-teal-700" href={`/menu/${$page.params.qrCode}`}
    >Back to menu</a
  >

  {#if error}
    <p class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
  {:else if orderDetail}
    <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p class="text-sm uppercase tracking-[0.2em] text-teal-700">
        Order tracking
      </p>
      <h1 class="mt-2 text-2xl font-semibold">
        {orderDetail.order.orderNumber}
      </h1>
      <p class="mt-4 text-lg font-medium text-slate-900">
        {statusLabels[orderDetail.order.status]}
      </p>
      <p class="mt-2 text-sm text-slate-600">
        Estimated prep time: {orderDetail.estimatedPrepTime} min
      </p>
      <p class="mt-2 text-sm text-slate-600">
        Total: {orderDetail.order.total}Birr
      </p>

      <ul class="mt-6 space-y-2 text-sm text-slate-700">
        {#each orderDetail.items as item}
          <li>
            {item.quantity} x {item.item_name} — {item.price}Birr
          </li>
        {/each}
      </ul>
    </section>
  {:else}
    <p class="text-slate-600">Loading order...</p>
  {/if}
</main>
