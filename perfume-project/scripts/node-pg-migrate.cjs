const { spawnSync } = require('child_process');
const path = require('path');

require('dotenv').config();

function buildDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

  if (!DB_USER || !DB_PASSWORD || !DB_HOST || !DB_NAME) {
    return '';
  }

  const user = encodeURIComponent(DB_USER);
  const password = encodeURIComponent(DB_PASSWORD);
  const database = encodeURIComponent(DB_NAME);
  const port = DB_PORT || '5432';

  return `postgresql://${user}:${password}@${DB_HOST}:${port}/${database}`;
}

const databaseUrl = buildDatabaseUrl();

if (!databaseUrl) {
  console.error(
    'DATABASE_URL is not set and DB_USER, DB_PASSWORD, DB_HOST, DB_NAME are incomplete.'
  );
  process.exit(1);
}

const bin = path.join(__dirname, '..', 'node_modules', 'node-pg-migrate', 'bin', 'node-pg-migrate.js');
const result = spawnSync(
  process.execPath,
  [
    bin,
    ...process.argv.slice(2),
    '--migrations-dir',
    'migrations/*.js',
    '--use-glob',
    'true',
    '--schema',
    'public',
    '--migrations-table',
    'pgmigrations',
    '--check-order',
    'true',
  ],
  {
    cwd: path.join(__dirname, '..'),
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
      PGSSLMODE: process.env.PGSSLMODE || 'no-verify',
    },
    stdio: 'inherit',
  }
);

process.exit(result.status ?? 1);
