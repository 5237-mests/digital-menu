<script lang="ts">
  import { goto } from "$app/navigation";
  import { getAuthState, requireRole } from "$lib/auth";
  import { onMount } from "svelte";

  let { children } = $props();

  onMount(() => {
    const auth = getAuthState();
    if (!auth.accessToken || !requireRole(["ADMIN", "CHEF"])) {
      void goto("/login?redirect=/kitchen");
    }
  });

  async function handleLogout() {
    const { logout } = await import("$lib/auth");
    await logout();
    void goto("/login");
  }
</script>

<div class="min-h-screen bg-slate-950 text-white">
  <header class="border-b border-white/10 px-4 py-4">
    <div class="mx-auto flex max-w-6xl items-center justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-teal-300">Kitchen</p>
        <h1 class="text-xl font-semibold">Order queue</h1>
      </div>
      <div>
        <a class="text-sm text-teal-300" href="/">Home </a>
        <button class="text-teal-300" onclick={handleLogout} type="button"
          >Logout</button
        >
      </div>
    </div>
  </header>
  {@render children()}
</div>
