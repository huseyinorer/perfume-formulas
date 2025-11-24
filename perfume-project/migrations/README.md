# Database Migrations

This directory contains database migration files managed by node-pg-migrate.

## Usage

### Create a new migration
```bash
npm run migrate:create <migration-name>
```

Example:
```bash
npm run migrate:create add-users-table
```

### Run pending migrations
```bash
npm run migrate
```

### Rollback last migration
```bash
npm run migrate:down
```

## Configuration

Migration configuration is stored in `.node-pg-migraterc.json` in the project root.

Make sure to set the `DATABASE_URL` environment variable in your `.env` file:
```
DATABASE_URL=postgresql://user:password@host:port/database
```

## Best Practices

1. Always test migrations in development before running in production
2. Keep migrations small and focused on a single change
3. Never modify existing migration files - create new ones for changes
4. Always include both up and down migrations
5. Use transactions for data migrations to ensure atomicity
