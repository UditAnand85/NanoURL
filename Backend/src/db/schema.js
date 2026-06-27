import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Users Table ──────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  _id: uuid("_id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

// ─── URLs Table ───────────────────────────────────────────────────────────────
export const urls = pgTable("urls", {
  _id: uuid("_id").primaryKey().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => users._id, { onDelete: "cascade" }),
  originalUrl: text("originalUrl").notNull(),
  shortcode: text("shortcode").notNull().unique(),
  isActive: boolean("isActive").notNull().default(true),
  clicks: integer("clicks").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

// ─── Relations (One User → Many URLs) ─────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  urls: many(urls),
}));

export const urlsRelations = relations(urls, ({ one }) => ({
  user: one(users, {
    fields: [urls.userId],
    references: [users._id],
  }),
}));
