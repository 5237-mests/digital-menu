import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('orders repository uses transactions and server-side pricing', async () => {
  const source = await readFile(new URL('../src/modules/orders/repositories/orders.repository.ts', import.meta.url), 'utf8');

  assert.match(source, /beginTransaction/);
  assert.match(source, /resolveMenuItems/);
  assert.match(source, /ALLOWED_TRANSITIONS/);
});

test('create order dto no longer accepts client price', async () => {
  const source = await readFile(new URL('../src/modules/orders/dto/create-order.dto.ts', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /price!/);
  assert.match(source, /menuItemId!/);
});
