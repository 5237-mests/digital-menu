import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('web app exposes customer, kitchen, and admin routes', async () => {
  const homepage = await readFile(new URL('../src/routes/+page.svelte', import.meta.url), 'utf8');
  const menu = await readFile(new URL('../src/routes/menu/[qrCode]/+page.svelte', import.meta.url), 'utf8');
  const kitchen = await readFile(new URL('../src/routes/kitchen/+page.svelte', import.meta.url), 'utf8');
  const admin = await readFile(new URL('../src/routes/admin/+page.svelte', import.meta.url), 'utf8');

  assert.match(homepage, /\/menu\/table-1/);
  assert.match(menu, /placeOrder/);
  assert.match(kitchen, /updateStatus/);
  assert.match(admin, /getDashboardStats/);
});

test('web client includes socket.io integration', async () => {
  const source = await readFile(new URL('../src/lib/socket.ts', import.meta.url), 'utf8');
  assert.match(source, /socket\.io-client/);
  assert.match(source, /REALTIME_EVENTS/);
});
