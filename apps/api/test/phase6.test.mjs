import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('realtime gateway emits shared realtime events', async () => {
  const source = await readFile(new URL('../src/modules/realtime/realtime.gateway.ts', import.meta.url), 'utf8');

  assert.match(source, /REALTIME_EVENTS\.orderCreated/);
  assert.match(source, /REALTIME_EVENTS\.orderUpdated/);
  assert.match(source, /REALTIME_EVENTS\.kitchenQueueUpdated/);
});

test('main bootstrap configures socket.io adapter', async () => {
  const source = await readFile(new URL('../src/main.ts', import.meta.url), 'utf8');

  assert.match(source, /IoAdapter/);
});
