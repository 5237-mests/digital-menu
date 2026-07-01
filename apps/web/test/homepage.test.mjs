import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('homepage renders the shared application name and entry points', async () => {
  const source = await readFile(new URL('../src/routes/+page.svelte', import.meta.url), 'utf8');

  assert.match(source, /APP_NAME/);
  assert.match(source, /\/menu\/table-1/);
  assert.match(source, /\/kitchen/);
  assert.match(source, /\/admin/);
});
