import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('User', {
  id: text()
    .primaryKey()
    .$default(() => createId()),
  name: text(),
  created_at: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const passkeys = sqliteTable('Passkey', {
  id: text()
    .primaryKey()
    .$default(() => createId()),
  public_key: blob().notNull(),
  user_id: text().notNull(),
  webauthn_user_id: text().notNull().unique(),
  counter: integer().notNull(),
  device_type: text().notNull(),
  backed_up: integer({ mode: 'boolean' }).notNull(),
  transports: text(),
  created_at: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const comments = sqliteTable('Comment', {
  id: text()
    .primaryKey()
    .$default(() => createId()),
  user_id: text().notNull(),
  content: text().notNull(),
  created_at: text('created_at')
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const usersRelations = relations(users, ({ many }) => ({
  passkeys: many(passkeys),
  comments: many(comments),
}));

export const passkeyssRelations = relations(passkeys, ({ one }) => ({
  owner: one(users, {
    fields: [passkeys.user_id],
    references: [users.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  owner: one(users, {
    fields: [comments.user_id],
    references: [users.id],
  }),
}));
