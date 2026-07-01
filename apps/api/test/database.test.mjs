import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('database module uses mysql2 promise pool', async () => {
  const source = await readFile(new URL('../src/modules/database/database.module.ts', import.meta.url), 'utf8');

  assert.match(source, /mysql2\/promise/);
  assert.match(source, /createPool/);
  assert.doesNotMatch(source, /\bPrisma\b|\bTypeORM\b|\bSequelize\b/);
});

test('database service exposes a parameterized query-capable pool', async () => {
  const source = await readFile(new URL('../src/modules/database/database.service.ts', import.meta.url), 'utf8');

  assert.match(source, /getPool\(\)/);
  assert.match(source, /pool\.execute/);
});
