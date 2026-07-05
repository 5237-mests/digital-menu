<script lang="ts">
  import { APP_NAME } from "@restaurant/shared-constants";
</script>

<main class="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10">
  <header class="space-y-3">
    <p class="text-sm font-medium uppercase tracking-[0.2em] text-teal-700">
      Digital ordering
    </p>
    <h1 class="text-4xl font-semibold text-slate-900">{APP_NAME}</h1>
    <p class="max-w-2xl text-slate-600">
      Scan a table QR code to browse the menu, place orders, and track
      preparation in real time.
    </p>
  </header>

  <section class="grid gap-4 md:grid-cols-4">
    <a
      class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
      href="/menu/table-1"
    >
      <h2 class="text-lg font-semibold">Customer menu</h2>
      <p class="mt-2 text-sm text-slate-600">Demo table QR: table-1</p>
    </a>
    <a
      class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
      href="/orders/track"
    >
      <h2 class="text-lg font-semibold">Track order</h2>
      <p class="mt-2 text-sm text-slate-600">
        Enter your order ID to view status
      </p>
    </a>
    <a
      class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
      href="/kitchen"
    >
      <h2 class="text-lg font-semibold">Kitchen dashboard</h2>
      <p class="mt-2 text-sm text-slate-600">Live order queue for chefs</p>
    </a>
    <a
      class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
      href="/admin"
    >
      <h2 class="text-lg font-semibold">Admin dashboard</h2>
      <p class="mt-2 text-sm text-slate-600">
        Manage menu, tables, users, and reports
      </p>
    </a>
  </section>
</main>
