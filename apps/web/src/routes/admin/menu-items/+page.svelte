<script lang="ts">
  import { api } from "$lib/api";
  import { getAuthState } from "$lib/auth";
  import type { Category, MenuItem } from "@restaurant/shared-types";
  import { CldUploadWidget, CldImage } from "svelte-cloudinary";
  import { onMount } from "svelte";

  let items = $state<MenuItem[]>([]);
  let categories = $state<Category[]>([]);
  let name = $state("");
  let categoryId = $state(0);
  let price = $state("9.99");
  let preparationTime = $state(10);
  let image = $state("");
  let error = $state("");
  let uploadError = $state("");

  async function load() {
    const token = getAuthState().accessToken!;
    [items, categories] = await Promise.all([
      api.getMenuItems(token),
      api.getCategories(token),
    ]);
    if (!categoryId && categories[0]) {
      categoryId = categories[0].id;
    }
  }

  function handleUploadSuccess(results: { info?: unknown }) {
    uploadError = "";
    const info = results.info;
    if (info && typeof info !== "string") {
      const data = info as { secure_url?: string; url?: string };
      image = data.secure_url ?? data.url ?? "";
      return;
    }
    uploadError = "Cloudinary upload did not return a valid image URL.";
  }

  function handleUploadError(error: string) {
    uploadError = error || "Unable to upload image";
  }

  async function createItem() {
    const token = getAuthState().accessToken!;
    // convert price to string
    price = price.toString();
    await api.createMenuItem(token, {
      name,
      categoryId,
      price,
      preparationTime,
      isAvailable: true,
      image: image || undefined,
    });
    name = "";
    image = "";
    await load();
  }

  async function removeItem(id: number) {
    const token = getAuthState().accessToken!;
    await api.deleteMenuItem(token, id);
    await load();
  }

  onMount(() => {
    load().catch((caught) => {
      error =
        caught instanceof Error ? caught.message : "Unable to load menu items";
    });
  });
</script>

<main class="mx-auto max-w-4xl space-y-4 px-4 py-6">
  <h2 class="text-2xl font-semibold">Menu items</h2>
  {#if error}<p class="text-sm text-red-700">{error}</p>{/if}
  <form
    class="grid gap-2 rounded-2xl bg-white p-4 ring-1 ring-slate-200 md:grid-cols-2"
    onsubmit={(event) => {
      event.preventDefault();
      void createItem();
    }}
  >
    <input
      class="rounded-xl border border-slate-300 px-3 py-2"
      bind:value={name}
      placeholder="Name"
      required
    />
    <select
      class="rounded-xl border border-slate-300 px-3 py-2"
      bind:value={categoryId}
    >
      {#each categories as category}
        <option value={category.id}>{category.name}</option>
      {/each}
    </select>
    <label
      class="flex flex-col gap-2 rounded-xl border border-slate-300 p-3 text-sm text-slate-700"
    >
      <span>Price (Birr)</span>
      <input
        class="rounded-xl border border-slate-300 px-3 py-2"
        bind:value={price}
        type="number"
        min="0.01"
        step="0.01"
        required
      />
    </label>
    <label
      class="flex flex-col gap-2 rounded-xl border border-slate-300 p-3 text-sm text-slate-700"
    >
      <span>Preparation time (minutes)</span>
      <input
        class="rounded-xl border border-slate-300 px-3 py-2"
        bind:value={preparationTime}
        type="number"
        min="1"
        required
      />
    </label>
    <label
      class="flex flex-col gap-2 rounded-xl border border-slate-300 p-3 text-sm text-slate-700"
    >
      <span>Item image</span>
      <CldUploadWidget
        uploadPreset="res_pic"
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
        let:open
        let:isLoading
      >
        <button
          type="button"
          class="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700"
          onclick={() => open()}
          disabled={isLoading}
        >
          {#if isLoading}
            Loading widget...
          {:else}
            Upload image
          {/if}
        </button>
      </CldUploadWidget>
      {#if uploadError}
        <span class="text-xs text-red-700">{uploadError}</span>
      {/if}
      {#if image}
        <CldImage src={image} alt="Menu item image" width={300} height={300} />
      {/if}
    </label>
    <button
      class="rounded-xl bg-teal-700 px-4 py-2 text-white md:col-span-2 hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 cursor-pointer"
      type="submit"
      // disabled={isUploading}
    >
      Add item
    </button>
  </form>
  <ul class="space-y-2">
    {#each items as item}
      <li
        class="flex items-center justify-between rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200"
      >
        <div>
          <a
            class="font-medium hover:underline"
            href={`/admin/menu-items/${item.id}`}
            // sveltekit:prefetch
          >
            {item.name}
          </a>
          <p class="text-sm text-slate-600">{item.price}Birr</p>
        </div>
        <button
          class="text-sm text-red-700 hover:underline cursor-pointer"
          onclick={() => removeItem(item.id)}>Delete</button
        >
      </li>
    {/each}
  </ul>
</main>
