<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { api } from "$lib/api";
  import {
    addToCart,
    cartTotal,
    clearCart,
    getCart,
    updateCartItem,
  } from "$lib/cart";
  import type { PublicMenuResponse } from "@restaurant/shared-types";
  import { onMount } from "svelte";

  let menu = $state<PublicMenuResponse | null>(null);
  let cart = $state(getCart(""));
  let error = $state("");
  let submitting = $state(false);
  let qrCode = $derived($page.params.qrCode ?? "");
  let selectedCategoryId = $state<number | null>(null);
  let recentOrderId = $state<number | null>(null);

  onMount(async () => {
    try {
      menu = await api.getPublicMenu(qrCode);
      cart = getCart(qrCode);
      selectedCategoryId = menu.categories[0]?.id ?? null;
      sessionStorage.setItem("last-menu-url", window.location.pathname);

      const storedOrderId = sessionStorage.getItem(`recent-order:${qrCode}`);
      recentOrderId = storedOrderId ? Number(storedOrderId) : null;
    } catch (caught) {
      error = caught instanceof Error ? caught.message : "Unable to load menu";
    }
  });

  function addItem(menuItemId: number, name: string, price: string) {
    cart = addToCart(qrCode, { menuItemId, name, price, notes: "" });
  }

  function selectCategory(categoryId: number) {
    selectedCategoryId = categoryId;
    const target = document.getElementById(`category-${categoryId}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function getCategoryItems(categoryId: number) {
    return (
      menu?.menuItems.filter((item) => item.categoryId === categoryId) ?? []
    );
  }

  async function placeOrder() {
    if (!menu || cart.length === 0) {
      return;
    }

    submitting = true;
    error = "";

    try {
      const order = await api.createOrder({
        tableId: menu.table.id,
        items: cart.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          notes: item.notes || undefined,
        })),
      });
      clearCart(qrCode);
      cart = [];
      sessionStorage.setItem(`recent-order:${qrCode}`, String(order.order.id));
      recentOrderId = order.order.id;
      await goto(`/menu/${qrCode}/order/${order.order.id}`);
    } catch (caught) {
      error =
        caught instanceof Error ? caught.message : "Unable to place order";
    } finally {
      submitting = false;
    }
  }
</script>

<main class="mx-auto min-h-screen max-w-6xl px-4 py-6 pb-28">
  {#if error}
    <p class="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
      {error}
    </p>
  {/if}

  {#if menu}
    <header class="mb-6 space-y-3">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-sm uppercase tracking-[0.2em] text-teal-700">
            Table {menu.table.tableNumber}
          </p>
          <h1 class="text-3xl font-semibold text-slate-900">Menu</h1>
        </div>
        {#if recentOrderId}
          <a
            class="rounded-full bg-teal-700 px-4 py-2 text-sm font-medium text-white"
            href={`/orders/track?orderId=${recentOrderId}`}
          >
            View my order
          </a>
        {/if}
      </div>
    </header>

    <div class="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
      <aside class="mb-6 lg:sticky lg:top-6 lg:self-start">
        <div class="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
          <p
            class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
          >
            Categories
          </p>
          <div
            class="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible"
          >
            {#each menu.categories as category}
              <button
                class={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition ${selectedCategoryId === category.id ? "bg-teal-700 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                onclick={() => selectCategory(category.id)}
                type="button"
              >
                {category.name}
              </button>
            {/each}
          </div>
        </div>
      </aside>

      <div class="space-y-8">
        {#each menu.categories as category}
          <section
            id={`category-${category.id}`}
            class="scroll-mt-24 space-y-3"
          >
            <h2 class="text-xl font-semibold text-slate-900">
              {category.name}
            </h2>
            <div class="space-y-3">
              {#each getCategoryItems(category.id) as item}
                <article
                  class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
                >
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <h3 class="font-medium text-slate-900">{item.name}</h3>
                      {#if item.description}
                        <p class="mt-1 text-sm text-slate-600">
                          {item.description}
                        </p>
                      {/if}
                      <p class="mt-2 text-sm font-medium text-teal-700">
                        {item.price}Birr
                      </p>
                    </div>
                    <button
                      class="rounded-xl bg-teal-700 px-3 py-2 text-sm font-medium text-white"
                      onclick={() => addItem(item.id, item.name, item.price)}
                    >
                      Add
                    </button>
                  </div>
                </article>
              {/each}
            </div>
          </section>
        {/each}
      </div>
    </div>
  {:else if !error}
    <p class="text-slate-600">Loading menu...</p>
  {/if}

  {#if cart.length > 0}
    <aside
      class="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 p-4 backdrop-blur"
    >
      <div class="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <div>
          <p class="text-sm text-slate-600">{cart.length} item(s)</p>
          <p class="text-lg font-semibold">{cartTotal(cart).toFixed(2)}Birr</p>
        </div>
        <button
          class="rounded-xl bg-teal-700 px-4 py-3 font-medium text-white disabled:opacity-60"
          disabled={submitting}
          onclick={placeOrder}
        >
          {submitting ? "Submitting..." : "Place order"}
        </button>
      </div>
      <div class="mx-auto mt-3 max-w-3xl space-y-2">
        {#each cart as item}
          <div class="flex items-center justify-between text-sm">
            <span>{item.name}</span>
            <input
              class="w-16 rounded-lg border border-slate-300 px-2 py-1"
              type="number"
              min="1"
              value={item.quantity}
              onchange={(event) => {
                cart = updateCartItem(
                  qrCode,
                  item.menuItemId,
                  Number((event.currentTarget as HTMLInputElement).value),
                );
              }}
            />
          </div>
        {/each}
      </div>
    </aside>
  {/if}
</main>
