import { pgTable, serial, text, timestamp, vector } from 'drizzle-orm/pg-core';

export const chunks = pgTable('chunks', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  embedding: vector('embedding', { dimensions: 768 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});