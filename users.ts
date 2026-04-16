import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id"),
  username: text("username").notNull().unique(),
  email: text("email"),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  reputation: integer("reputation").notNull().default(0),
  questionsCount: integer("questions_count").notNull().default(0),
  answersCount: integer("answers_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, reputation: true, questionsCount: true, answersCount: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
