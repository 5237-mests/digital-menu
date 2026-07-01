<script lang="ts">
  import { goto } from '$app/navigation';
  import { getAuthState, requireRole } from '$lib/auth';
  import { onMount } from 'svelte';

  let { children } = $props();

  onMount(() => {
    const auth = getAuthState();
    if (!auth.accessToken || !requireRole(['ADMIN'])) {
      void goto('/login?redirect=/admin');
    }
  });
</script>

<div class="min-h-screen bg-slate-100">
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-4">
      <div class="mr-auto">
        <p class="text-xs uppercase tracking-[0.2em] text-teal-700">Admin</p>
        <h1 class="text-xl font-semibold text-slate-900">Restaurant dashboard</h1>
      </div>
      <nav class="flex flex-wrap gap-3 text-sm">
        <a class="text-teal-700" href="/admin">Overview</a>
        <a class="text-teal-700" href="/admin/categories">Categories</a>
        <a class="text-teal-700" href="/admin/menu-items">Menu items</a>
        <a class="text-teal-700" href="/admin/tables">Tables</a>
        <a class="text-teal-700" href="/admin/users">Users</a>
        <a class="text-teal-700" href="/admin/settings">Settings</a>
      </nav>
    </div>
  </header>
  {@render children()}
</div>
