import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { test } from 'node:test';

const root = process.cwd();

async function readJson(path) {
  const content = await readFile(join(root, path), 'utf8');
  return JSON.parse(content);
}

test('root package is configured for pnpm and Turborepo', async () => {
  const packageJson = await readJson('package.json');
  const turboJson = await readJson('turbo.json');

  assert.equal(packageJson.private, true);
  assert.match(packageJson.packageManager, /^pnpm@/);
  assert.ok(turboJson.tasks.build);
  assert.ok(turboJson.tasks.dev);
});

test('workspace includes apps and shared packages', async () => {
  const workspace = await readFile(join(root, 'pnpm-workspace.yaml'), 'utf8');

  assert.match(workspace, /apps\/\*/);
  assert.match(workspace, /packages\/\*/);

  for (const path of [
    'apps/api/package.json',
    'apps/web/package.json',
    'packages/shared-types/package.json',
    'packages/shared-constants/package.json',
    'packages/shared-utils/package.json'
  ]) {
    await access(join(root, path));
  }
});

test('Docker compose defines MySQL and API services', async () => {
  const compose = await readFile(join(root, 'docker-compose.yml'), 'utf8');

  assert.match(compose, /mysql:8\.4/);
  assert.match(compose, /restaurant-system-api/);
});

test('shared packages expose source entries for workspace dev servers', async () => {
  for (const packagePath of [
    'packages/shared-types/package.json',
    'packages/shared-constants/package.json',
    'packages/shared-utils/package.json'
  ]) {
    const packageJson = await readJson(packagePath);

    assert.equal(packageJson.main, 'src/index.ts');
    assert.equal(packageJson.types, 'src/index.ts');
    assert.equal(packageJson.exports['.'].default, './src/index.ts');
  }
});

test('ORM packages are not used', async () => {
  const paths = [
    'package.json',
    'apps/api/package.json',
    'apps/web/package.json',
    'packages/shared-types/package.json',
    'packages/shared-constants/package.json',
    'packages/shared-utils/package.json'
  ];

  const forbidden = /\b(prisma|typeorm|sequelize)\b/i;

  for (const path of paths) {
    const content = await readFile(join(root, path), 'utf8');
    assert.doesNotMatch(content, forbidden, `${path} must not include an ORM dependency`);
  }
});
