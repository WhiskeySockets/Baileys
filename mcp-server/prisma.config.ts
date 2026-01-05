// Prisma Configuration for Prisma 7+
// See: https://pris.ly/d/config-datasource
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Use DIRECT_URL for migrations (bypasses PgBouncer/Supavisor)
    // Falls back to DATABASE_URL if DIRECT_URL not set
    url: env('DIRECT_URL') ?? env('DATABASE_URL'),
  },
});
