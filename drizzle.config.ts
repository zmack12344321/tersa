import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config({
  path: '.env.local',
});

const databaseUrl = process.env.DATABASE_URL as string;

console.log(databaseUrl);

export default defineConfig({
  dialect: 'postgresql',
  schema: './schema.ts',
  dbCredentials: {
    url: databaseUrl,
  },
});
