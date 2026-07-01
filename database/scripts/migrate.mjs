import { readdir, readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { createConnection } from 'mysql2/promise';
import { formatDatabaseConnectionString, getDatabaseConfig } from './database-config.mjs';

const migrationsDirectory = join(process.cwd(), 'database', 'migrations');

async function ensureMigrationTable(connection) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      filename VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_schema_migrations_filename (filename)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

async function hasMigrationRun(connection, filename) {
  const [rows] = await connection.execute(
    'SELECT id FROM schema_migrations WHERE filename = ? LIMIT 1',
    [filename]
  );

  return rows.length > 0;
}

async function applyMigration(connection, filename) {
  const sql = await readFile(join(migrationsDirectory, filename), 'utf8');

  await connection.beginTransaction();
  try {
    await connection.query(sql);
    await connection.execute('INSERT INTO schema_migrations (filename) VALUES (?)', [filename]);
    await connection.commit();
    console.log(`Applied migration: ${filename}`);
  } catch (error) {
    await connection.rollback();
    throw error;
  }
}

async function run() {
  const config = getDatabaseConfig();
  // console.log('Starting database migrations... ', config);
  // console.log(`Database connection: ${formatDatabaseConnectionString(config)}`);

  const connection = await createConnection(config);

  try {
    await ensureMigrationTable(connection);
    const entries = await readdir(migrationsDirectory);
    const migrationFiles = entries.filter((entry) => entry.endsWith('.sql')).sort();

    for (const filename of migrationFiles) {
      if (await hasMigrationRun(connection, filename)) {
        console.log(`Skipped migration: ${filename}`);
        continue;
      }

      await applyMigration(connection, basename(filename));
    }
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
