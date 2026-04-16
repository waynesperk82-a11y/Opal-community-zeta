import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { questionsTable } from "./questions";
import { usersTable } from "./users";

export const answersTable = pgTable("answers", {
  id: serial("id").primaryKey(),
  body: text("body").notNull(),
  questionId: integer("question_id").notNull().references(() => questionsTable.id),
  authorId: integer("author_id").references(() => usersTable.id),
  isAiGenerated: boolean("is_ai_generated").notNull().default(false),
  isVerified: boolean("is_verified").notNull().default(false),
  verificationNote: text("verification_note"),
  isAccepted: boolean("is_accepted").notNull().default(false),
  voteCount: integer("vote_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAnswerSchema = createInsertSchema(answersTable).omit({ id: true, createdAt: true, voteCount: true, isAccepted: true });
export type InsertAnswer = z.infer<typeof insertAnswerSchema>;
export type Answer = typeof answersTable.$inferSelect;
