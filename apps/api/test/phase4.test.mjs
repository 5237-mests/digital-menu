import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('categories controller exposes CRUD and RBAC guards', async () => {
  const source = await readFile(new URL('../src/modules/categories/categories.controller.ts', import.meta.url), 'utf8');

  for (const pattern of [/@Get\(\)/, /@Post\(\)/, /@Put\(':id'\)/, /@Delete\(':id'\)/, /@Roles\('OWNER', 'ADMIN'\)/]) {
    assert.match(source, pattern);
  }
});

test('menu items controller exposes CRUD endpoints', async () => {
  const source = await readFile(new URL('../src/modules/menu-items/menu-items.controller.ts', import.meta.url), 'utf8');

  for (const pattern of [/@Get\(\)/, /@Get\(':id'\)/, /@Post\(\)/, /@Put\(':id'\)/, /@Delete\(':id'\)/]) {
    assert.match(source, pattern);
  }
});

test('tables controller exposes QR lookup endpoint', async () => {
  const source = await readFile(new URL('../src/modules/tables/tables.controller.ts', import.meta.url), 'utf8');

  assert.match(source, /@Get\('by-qr\/:qrCode'\)/);
});
