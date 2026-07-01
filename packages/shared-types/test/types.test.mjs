import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('shared types define the documented order statuses', async () => {
  const source = await readFile(new URL('../src/index.ts', import.meta.url), 'utf8');

  for (const status of ['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']) {
    assert.match(source, new RegExp(status));
  }
});
