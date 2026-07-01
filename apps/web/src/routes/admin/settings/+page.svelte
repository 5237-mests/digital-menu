<script lang="ts">
  import { api } from '$lib/api';
  import { getAuthState } from '$lib/auth';
  import type { Settings } from '@restaurant/shared-types';
  import { onMount } from 'svelte';

  let settings = $state<Settings | null>(null);
  let message = $state('');
  let error = $state('');

  onMount(async () => {
    try {
      settings = await api.getSettings();
    } catch (caught) {
      error = caught instanceof Error ? caught.message : 'Unable to load settings';
    }
  });

  async function save() {
    if (!settings) {
      return;
    }

    const token = getAuthState().accessToken!;
    settings = await api.updateSettings(token, settings);
    message = 'Settings saved';
  }
</script>

<main class="mx-auto max-w-lg space-y-4 px-4 py-6">
  <h2 class="text-2xl font-semibold">Settings</h2>
  {#if error}<p class="text-sm text-red-700">{error}</p>{/if}
  {#if message}<p class="text-sm text-teal-700">{message}</p>{/if}
  {#if settings}
    <form class="space-y-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200" onsubmit={(event) => { event.preventDefault(); void save(); }}>
      <label class="block space-y-1 text-sm">
        <span>Restaurant name</span>
        <input class="w-full rounded-xl border border-slate-300 px-3 py-2" bind:value={settings.restaurantName} />
      </label>
      <label class="block space-y-1 text-sm">
        <span>Currency</span>
        <input class="w-full rounded-xl border border-slate-300 px-3 py-2" bind:value={settings.currency} />
      </label>
      <label class="block space-y-1 text-sm">
        <span>Tax rate</span>
        <input class="w-full rounded-xl border border-slate-300 px-3 py-2" bind:value={settings.taxRate} />
      </label>
      <button class="rounded-xl bg-teal-700 px-4 py-2 text-white" type="submit">Save</button>
    </form>
  {/if}
</main>
