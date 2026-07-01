import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

test('auth controller exposes documented auth endpoints', async () => {
  const source = await readFile(new URL('../src/modules/auth/auth.controller.ts', import.meta.url), 'utf8');

  for (const pattern of [
    /@Post\('login'\)/,
    /@Post\('refresh'\)/,
    /@Post\('logout'\)/,
    /@Get\('me'\)/
  ]) {
    assert.match(source, pattern);
  }
});

test('auth service hashes refresh tokens before persistence', async () => {
  const source = await readFile(new URL('../src/modules/auth/auth.service.ts', import.meta.url), 'utf8');

  assert.match(source, /createHash\('sha256'\)/);
  assert.match(source, /refreshTokensRepository\.create/);
  assert.match(source, /refreshTokensRepository\.revokeByTokenId/);
});

test('auth guards implement JWT and role checks', async () => {
  const jwtGuard = await readFile(new URL('../src/modules/auth/guards/jwt-auth.guard.ts', import.meta.url), 'utf8');
  const rolesGuard = await readFile(new URL('../src/modules/auth/guards/roles.guard.ts', import.meta.url), 'utf8');

  assert.match(jwtGuard, /Bearer/);
  assert.match(jwtGuard, /verifyAccessToken/);
  assert.match(rolesGuard, /getAllAndOverride/);
  assert.match(rolesGuard, /requiredRoles\.includes/);
});
