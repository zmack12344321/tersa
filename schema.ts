import {
  integer,
  json,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const projects = pgTable('project', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp(),
  content: json(),
  userId: varchar().notNull(),
  organizationId: varchar(),
});
