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

  onMount(async () => {
    try {
      menu = await api.getPublicMenu(qrCode);
      cart = getCart(qrCode);
    } catch (caught) {
      error = caught instanceof Error ? caught.message : "Unable to load menu";
    }
  });

  function addItem(menuItemId: number, name: string, price: string) {
    cart = addToCart(qrCode, { menuItemId, name, price });
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
      await goto(`/menu/${qrCode}/order/${order.order.id}`);
    } catch (caught) {
      error =
        caught instanceof Error ? caught.message : "Unable to place order";
    } finally {
      submitting = false;
    }
  }
</script>

<main class="mx-auto min-h-screen max-w-3xl px-4 py-6 pb-28">
  {#if error}
    <p class="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
      {error}
    </p>
  {/if}

  {#if menu}
    <header class="mb-6 space-y-2">
      <p class="text-sm uppercase tracking-[0.2em] text-teal-700">
        Table {menu.table.tableNumber}
      </p>
      <h1 class="text-3xl font-semibold text-slate-900">Menu</h1>
    </header>

    <div class="space-y-8">
      {#each menu.categories as category}
        <section class="space-y-3">
          <h2 class="text-xl font-semibold text-slate-900">{category.name}</h2>
          <div class="space-y-3">
            {#each menu.menuItems.filter((item) => item.categoryId === category.id) as item}
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
