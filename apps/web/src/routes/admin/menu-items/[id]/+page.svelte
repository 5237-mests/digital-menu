<script lang="ts">
  import { onMount } from "svelte";
  import { api } from "$lib/api";
  import { getAuthState } from "$lib/auth";
  import { CldUploadWidget, CldImage } from "svelte-cloudinary";
  import type { MenuItem, Category } from "@restaurant/shared-types";

  let item: MenuItem | null = null;
  let categories: Category[] = [];
  let name = "";
  let categoryId = 0;
  let price: number | string = "";
  let preparationTime: number | string = "";
  let image = "";
  let error = "";

  onMount(async () => {
    try {
      const parts = window.location.pathname.split("/").filter(Boolean);
      const id = Number(parts[parts.length - 1]);
      const token = getAuthState().accessToken!;
      [item, categories] = await Promise.all([
        api.getMenuItem(token, id),
        api.getCategories(token),
      ]);
      if (item) {
        name = item.name;
        categoryId = item.categoryId;
        price = item.price.toString(); // Convert price to string for input binding
        preparationTime = item.preparationTime;
        image = item.image ?? "";
      }
    } catch (e) {
      error = e instanceof Error ? e.message : "Unable to load item";
    }
  });

  function handleUploadSuccess(results: { info?: unknown }) {
    const info = results.info;
    if (info && typeof info !== "string") {
      const data = info as { secure_url?: string; url?: string };
      image = data.secure_url ?? data.url ?? "";
    }
  }

  async function save() {
    const token = getAuthState().accessToken!;
    const parts = window.location.pathname.split("/").filter(Boolean);
    const id = Number(parts[parts.length - 1]);
    // convert price to string
    price = price.toString();
    await api.updateMenuItem(token, id, {
      name,
      categoryId,
      price,
      preparationTime,
      image: image || undefined,
    });
    window.location.href = "/admin/menu-items";
  }
</script>

<main class="mx-auto max-w-2xl p-4">
  {#if error}<p class="text-red-700">{error}</p>{/if}
  {#if item}
    <form on:submit|preventDefault={save} class="space-y-4">
      <input bind:value={name} required placeholder="Name" class="w-full" />
      <select bind:value={categoryId} class="w-full">
        {#each categories as c}
          <option value={c.id}>{c.name}</option>
        {/each}
      </select>
      <input type="number" bind:value={price} min="0" step="1" class="w-full" />
      <input
        type="number"
        bind:value={preparationTime}
        min="1"
        class="w-full"
      />
      <div>
        <CldUploadWidget
          uploadPreset="res_pic"
          onSuccess={handleUploadSuccess}
          let:open
          let:isLoading
        >
          <button type="button" on:click={() => open()} disabled={isLoading}
            >Upload image</button
          >
        </CldUploadWidget>
        {#if image}
          <CldImage src={image} alt="item" width={300} height={300} />
        {/if}
      </div>
      <button type="submit" class="bg-teal-600 text-white px-4 py-2"
        >Save</button
      >
    </form>
  {:else}
    <p>Loading…</p>
  {/if}
</main>
