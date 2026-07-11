import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createConnection } from 'mysql2/promise';
import { formatDatabaseConnectionString, getDatabaseConfig } from './database-config.mjs';

const directoryArgument = process.argv.find((argument) => argument.startsWith('--dir='));
const seedsDirectory = join(process.cwd(), directoryArgument?.slice('--dir='.length) ?? join('database', 'seeds'));

async function run() {
  const config = getDatabaseConfig();
  console.log(`Database connection: ${formatDatabaseConnectionString(config)}`);

  const connection = await createConnection(config);

  try {
    const entries = await readdir(seedsDirectory);
    const seedFiles = entries.filter((entry) => entry.endsWith('.sql')).sort();

    for (const filename of seedFiles) {
      const sql = await readFile(join(seedsDirectory, filename), 'utf8');
      await connection.query(sql);
      console.log(`Applied seed: ${filename}`);
    }
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
