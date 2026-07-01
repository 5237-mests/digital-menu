import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('users repository uses parameterized mysql2 queries', async () => {
  const source = await readFile(new URL('../src/modules/users/repositories/users.repository.ts', import.meta.url), 'utf8');

  assert.match(source, /pool\.execute/);
  assert.match(source, /WHERE email = \?/);
  assert.match(source, /WHERE id = \?/);
  assert.doesNotMatch(source, /\bPrisma\b|\bTypeORM\b|\bSequelize\b/);
});
