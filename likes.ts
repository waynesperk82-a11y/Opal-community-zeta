import { integer, pgTable, serial, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { answersTable } from "./answers";
import { questionsTable } from "./questions";
import { usersTable } from "./users";

export const questionLikesTable = pgTable("question_likes", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull().references(() => questionsTable.id),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("question_likes_question_user_idx").on(table.questionId, table.userId),
]);

export const answerLikesTable = pgTable("answer_likes", {
  id: serial("id").primaryKey(),
  answerId: integer("answer_id").notNull().references(() => answersTable.id),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("answer_likes_answer_user_idx").on(table.answerId, table.userId),
]);