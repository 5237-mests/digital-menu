import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const migration = await readFile(new URL('../migrations/001_initial_schema.sql', import.meta.url), 'utf8');
const seed = await readFile(new URL('../seeds/001_initial_data.sql', import.meta.url), 'utf8');

test('initial migration creates documented tables', () => {
  for (const table of ['users', '`tables`', 'categories', 'menu_items', 'orders', 'order_items']) {
    assert.match(migration, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}`));
  }
});

test('initial migration includes required foreign keys and indexes', () => {
  for (const pattern of [
    /KEY idx_users_email/,
    /KEY idx_tables_table_number/,
    /KEY idx_orders_order_number/,
    /KEY idx_orders_status/,
    /KEY idx_orders_created_at/,
    /KEY idx_menu_items_category_id/,
    /FOREIGN KEY \(category_id\)/,
    /FOREIGN KEY \(table_id\)/,
    /FOREIGN KEY \(order_id\)/,
    /FOREIGN KEY \(menu_item_id\)/
  ]) {
    assert.match(migration, pattern);
  }
});

test('auth migration stores revocable refresh token hashes', async () => {
  const authMigration = await readFile(
    new URL('../migrations/002_auth_refresh_tokens.sql', import.meta.url),
    'utf8'
  );

  for (const pattern of [
    /CREATE TABLE IF NOT EXISTS auth_refresh_tokens/,
    /token_hash CHAR\(64\)/,
    /revoked_at TIMESTAMP NULL/,
    /FOREIGN KEY \(user_id\)/,
    /KEY idx_auth_refresh_tokens_token_hash/
  ]) {
    assert.match(authMigration, pattern);
  }
});

test('seed data is idempotent', () => {
  assert.match(seed, /ON DUPLICATE KEY UPDATE/);
});

test('seed users contain bcrypt hashes', () => {
  assert.match(seed, /\$2b\$12\$/);
  assert.doesNotMatch(seed, /replace_with_real_hash/);
});
