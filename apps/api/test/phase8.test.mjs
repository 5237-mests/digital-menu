import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('users and settings controllers match API spec', async () => {
  const users = await readFile(new URL('../src/modules/users/users.controller.ts', import.meta.url), 'utf8');
  const settings = await readFile(new URL('../src/modules/settings/settings.controller.ts', import.meta.url), 'utf8');
  const dashboard = await readFile(new URL('../src/modules/dashboard/dashboard.controller.ts', import.meta.url), 'utf8');

  for (const pattern of [/@Get\(\)/, /@Post\(\)/, /@Put\(':id'\)/, /@Delete\(':id'\)/]) {
    assert.match(users, pattern);
  }

  assert.match(settings, /@Get\(\)/);
  assert.match(settings, /@Put\(\)/);
  assert.match(dashboard, /@Get\('stats'\)/);
  assert.match(dashboard, /@Get\('sales'\)/);
});
