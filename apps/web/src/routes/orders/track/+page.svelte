<script lang="ts">
  import { api } from "$lib/api";
  import { onOrderUpdated } from "$lib/socket";
  import type { OrderDetail } from "@restaurant/shared-types";
  import { onMount } from "svelte";

  let orderIdInput = $state("");
  let orderDetail = $state<OrderDetail | null>(null);
  let error = $state("");
  let loading = $state(false);
  let trackedOrderId = $state<number | null>(null);
  let menuUrl = $state("/menu/table-1");

  onMount(() => {
    const storedMenuUrl = sessionStorage.getItem("last-menu-url");
    if (storedMenuUrl) {
      menuUrl = storedMenuUrl;
    }

    const params = new URLSearchParams(window.location.search);
    const initialOrderId = params.get("orderId");

    if (initialOrderId) {
      orderIdInput = initialOrderId;
      void loadOrder(Number(initialOrderId));
    }

    return onOrderUpdated((payload) => {
      if (trackedOrderId !== null && payload.order.id === trackedOrderId) {
        orderDetail = payload;
      }
    });
  });

  async function loadOrder(orderId: number) {
    if (!Number.isInteger(orderId) || orderId <= 0) {
      error = "Please enter a valid order ID.";
      return;
    }

    loading = true;
    error = "";

    try {
      orderDetail = await api.getOrder(orderId);
      trackedOrderId = orderId;
      const params = new URLSearchParams(window.location.search);
      params.set("orderId", String(orderId));
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`,
      );
    } catch (caught) {
      orderDetail = null;
      error = caught instanceof Error ? caught.message : "Unable to load order";
    } finally {
      loading = false;
    }
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    void loadOrder(Number(orderIdInput));
  }

  function goBackToMenu() {
    if (menuUrl) {
      window.location.assign(menuUrl);
      return;
    }

    window.history.back();
  }

  const statusLabels = {
    PENDING: "Waiting for kitchen",
    PREPARING: "Being prepared",
    READY: "Ready for pickup",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  } as const;
</script>

<main class="mx-auto min-h-screen max-w-3xl px-4 py-10">
  <div class="mb-6 flex flex-wrap gap-3">
    <button
      class="text-sm font-medium text-teal-700"
      type="button"
      onclick={goBackToMenu}
    >
      ← Back to menu
    </button>
  </div>

  <div class="space-y-6">
    <header class="space-y-2">
      <p class="text-sm font-medium uppercase tracking-[0.2em] text-teal-700">
        Order tracking
      </p>
      <h1 class="text-3xl font-semibold text-slate-900">
        Check your order status
      </h1>
      <p class="text-slate-600">
        Enter the order ID from your receipt to see the latest progress.
      </p>
    </header>

    <form
      class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      onsubmit={handleSubmit}
    >
      <label class="block space-y-2 text-sm text-slate-700">
        <span>Order ID</span>
        <input
          class="w-full rounded-xl border border-slate-300 px-3 py-2"
          inputmode="numeric"
          placeholder="e.g. 42"
          bind:value={orderIdInput}
          type="number"
          min="1"
          required
        />
      </label>

      <button
        class="mt-4 w-full rounded-xl bg-teal-700 px-4 py-2 font-medium text-white disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? "Checking..." : "Track order"}
      </button>
    </form>

    {#if error}
      <p class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
        Oops! Our system couldn't find an order with that Order Number. Please
        double-check the number and try again.
      </p>
    {/if}

    {#if orderDetail}
      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p class="text-sm uppercase tracking-[0.2em] text-teal-700">
          Order found
        </p>
        <h2 class="mt-2 text-2xl font-semibold">
          Order Number: {orderDetail.order.id}
        </h2>
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
            <li>{item.quantity} x {item.item_name} — {item.price}Birr</li>
          {/each}
        </ul>
      </section>
    {/if}
  </div>
</main>
