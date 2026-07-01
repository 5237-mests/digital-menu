import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('production bootstrap serves static web build when available', async () => {
  const source = await readFile(new URL('../src/main.ts', import.meta.url), 'utf8');
  assert.match(source, /useStaticAssets/);
  assert.match(source, /index\.html/);
});

test('dockerfile builds api and web for single deployment', async () => {
  const source = await readFile(new URL('../Dockerfile', import.meta.url), 'utf8');
  assert.match(source, /@restaurant\/web build/);
});
