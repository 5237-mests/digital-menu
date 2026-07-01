import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('health controller exposes a GET /health endpoint', async () => {
  const source = await readFile(new URL('../src/modules/common/health/health.controller.ts', import.meta.url), 'utf8');

  assert.match(source, /@Controller\('health'\)/);
  assert.match(source, /@Get\(\)/);
});
