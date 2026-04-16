import { Router, type IRouter } from "express";
import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import {
  AcceptAnswerParams,
  AcceptAnswerResponse,
  CreateAnswerBody,
  CreateAnswerParams,
  CreateQuestionBody,
  GetCategoryStatsResponse,
  GetDashboardStatsResponse,
  GetQuestionParams,
  GetQuestionResponse,
  GetTrendingQuestionsResponseItem,
  GetRecentActivityResponse,
  GetTrendingQuestionsResponse,
  LikeAnswerParams,
  LikeQuestionParams,
  LikeAnswerResponse,
  LikeQuestionResponse,
  ListQuestionsQueryParams,
  ListQuestionsResponse,
  TriggerAiAnswerCheckResponse,
  VoteAnswerBody,
  VoteAnswerParams,
  VoteAnswerResponse,
  VoteQuestionBody,
  VoteQuestionParams,
  VoteQuestionResponse,
} from "@workspace/api-zod";
import { answerLikesTable, answersTable, db, questionLikesTable, questionsTable, usersTable } from "@workspace/db";
import { generateAiAnswer, verifyCommunityAnswer } from "../lib/ai";
import { requireDbUser, type AuthenticatedRequest } from "../middlewares/auth";

const router: IRouter = Router();

type QuestionRow = typeof questionsTable.$inferSelect & {
  authorUsername: string;
  authorDisplayName: string;
  authorAvatarUrl: string | null;
};

type AnswerRow = typeof answersTable.$inferSelect & {
  authorUsername: string | null;
  authorDisplayName: string | null;
  authorAvatarUrl: string | null;
};

function formatQuestion(row: QuestionRow) {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    category: row.category,
    tags: row.tags,
    status: row.status,
    voteCount: row.voteCount,
    answerCount: row.answerCount,
    viewCount: row.viewCount,
    authorId: row.authorId,
    authorUsername: row.authorUsername,
    authorDisplayName: row.authorDisplayName,
    authorAvatarUrl: row.authorAvatarUrl,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function formatAnswer(row: AnswerRow) {
  return {
    id: row.id,
    body: row.body,
    questionId: row.questionId,
    authorId: row.authorId,
    authorUsername: row.isAiGenerated ? "opal-ai" : row.authorUsername ?? "unknown",
    authorDisplayName: row.isAiGenerated ? "Opal Zeta AI" : row.authorDisplayName ?? "Community Member",
    authorAvatarUrl: row.authorAvatarUrl,
    isAiGenerated: row.isAiGenerated,
    isVerified: row.isVerified,
    verificationNote: row.verificationNote,
    isAccepted: row.isAccepted,
    voteCount: row.voteCount,
    createdAt: row.createdAt,
  };
}

async function getQuestionById(id: number) {
  const [question] = await db
    .select({
      id: questionsTable.id,
      title: questionsTable.title,
      body: questionsTable.body,
      category: questionsTable.category,
      tags: questionsTable.tags,
      status: questionsTable.status,
      voteCount: questionsTable.voteCount,
      answerCount: questionsTable.answerCount,
      viewCount: questionsTable.viewCount,
      authorId: questionsTable.authorId,
      createdAt: questionsTable.createdAt,
      updatedAt: questionsTable.updatedAt,
      authorUsername: usersTable.username,
      authorDisplayName: usersTable.displayName,
      authorAvatarUrl: usersTable.avatarUrl,
    })
    .from(questionsTable)
    .innerJoin(usersTable, eq(questionsTable.authorId, usersTable.id))
    .where(eq(questionsTable.id, id))
    .limit(1);

  return question;
}

router.get("/questions", async (req, res): Promise<void> => {
  const parsed = ListQuestionsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const page = parsed.data.page ?? 1;
  const limit = parsed.data.limit ?? 20;
  const offset = (page - 1) * limit;
  const filters = [];

  if (parsed.data.category) {
    filters.push(eq(questionsTable.category, parsed.data.category));
  }
  if (parsed.data.status) {
    filters.push(eq(questionsTable.status, parsed.data.status));
  }
  if (parsed.data.search) {
    filters.push(or(ilike(questionsTable.title, `%${parsed.data.search}%`), ilike(questionsTable.body, `%${parsed.data.search}%`)));
  }

  const whereClause = filters.length > 0 ? and(...filters) : undefined;
  const sort = parsed.data.sort ?? "recent";
  const orderBy = sort === "popular" ? desc(questionsTable.voteCount) : sort === "unanswered" ? desc(questionsTable.createdAt) : desc(questionsTable.createdAt);
  if (sort === "unanswered") {
    filters.push(eq(questionsTable.status, "open"));
  }

  const rows = await db
    .select({
      id: questionsTable.id,
      title: questionsTable.title,
      body: questionsTable.body,
      category: questionsTable.category,
      tags: questionsTable.tags,
      status: questionsTable.status,
      voteCount: questionsTable.voteCount,
      answerCount: questionsTable.answerCount,
      viewCount: questionsTable.viewCount,
      authorId: questionsTable.authorId,
      createdAt: questionsTable.createdAt,
      updatedAt: questionsTable.updatedAt,
      authorUsername: usersTable.username,
      authorDisplayName: usersTable.displayName,
      authorAvatarUrl: usersTable.avatarUrl,
    })
    .from(questionsTable)
    .innerJoin(usersTable, eq(questionsTable.authorId, usersTable.id))
    .where(filters.length > 0 ? and(...filters) : whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const [{ value: total }] = await db.select({ value: count() }).from(questionsTable).where(filters.length > 0 ? and(...filters) : whereClause);

  res.json(ListQuestionsResponse.parse({
    questions: rows.map(formatQuestion),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  }));
});

router.post("/questions", requireDbUser, async (req, res): Promise<void> => {
  const parsed = CreateQuestionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const authorId = (req as AuthenticatedRequest).currentUserId!;
  const [question] = await db.insert(questionsTable).values({ ...parsed.data, authorId, tags: parsed.data.tags ?? [] }).returning();
  await db.update(usersTable).set({ questionsCount: sql`${usersTable.questionsCount} + 1`, reputation: sql`${usersTable.reputation} + 2` }).where(eq(usersTable.id, authorId));

  const joined = await getQuestionById(question.id);
  if (!joined) {
    res.status(500).json({ error: "Question could not be loaded" });
    return;
  }

  res.status(201).json(GetTrendingQuestionsResponseItem.parse(formatQuestion(joined)));
});

router.get("/questions/:id", async (req, res): Promise<void> => {
  const params = GetQuestionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.update(questionsTable).set({ viewCount: sql`${questionsTable.viewCount} + 1` }).where(eq(questionsTable.id, params.data.id));
  const question = await getQuestionById(params.data.id);
  if (!question) {
    res.status(404).json({ error: "Question not found" });
    return;
  }

  const answers = await db
    .select({
      id: answersTable.id,
      body: answersTable.body,
      questionId: answersTable.questionId,
      authorId: answersTable.authorId,
      isAiGenerated: answersTable.isAiGenerated,
      isVerified: answersTable.isVerified,
      verificationNote: answersTable.verificationNote,
      isAccepted: answersTable.isAccepted,
      voteCount: answersTable.voteCount,
      createdAt: answersTable.createdAt,
      authorUsername: usersTable.username,
      authorDisplayName: usersTable.displayName,
      authorAvatarUrl: usersTable.avatarUrl,
    })
    .from(answersTable)
    .leftJoin(usersTable, eq(answersTable.authorId, usersTable.id))
    .where(eq(answersTable.questionId, params.data.id))
    .orderBy(desc(answersTable.isAccepted), desc(answersTable.voteCount), desc(answersTable.createdAt));

  res.json(GetQuestionResponse.parse({ question: formatQuestion(question), answers: answers.map(formatAnswer) }));
});

router.post("/questions/:id/vote", requireDbUser, async (req, res): Promise<void> => {
  const params = VoteQuestionParams.safeParse(req.params);
  const body = VoteQuestionBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid vote request" });
    return;
  }

  const amount = body.data.direction === "up" ? 1 : -1;
  const [question] = await db.update(questionsTable).set({ voteCount: sql`${questionsTable.voteCount} + ${amount}` }).where(eq(questionsTable.id, params.data.id)).returning();
  if (!question) {
    res.status(404).json({ error: "Question not found" });
    return;
  }

  res.json(VoteQuestionResponse.parse({ voteCount: question.voteCount }));
});

router.post("/questions/:id/like", requireDbUser, async (req, res): Promise<void> => {
  const params = LikeQuestionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const userId = (req as AuthenticatedRequest).currentUserId!;
  const [existing] = await db
    .select()
    .from(questionLikesTable)
    .where(and(eq(questionLikesTable.questionId, params.data.id), eq(questionLikesTable.userId, userId)))
    .limit(1);

  if (existing) {
    await db.delete(questionLikesTable).where(eq(questionLikesTable.id, existing.id));
    const [question] = await db
      .update(questionsTable)
      .set({ voteCount: sql`GREATEST(${questionsTable.voteCount} - 1, 0)` })
      .where(eq(questionsTable.id, params.data.id))
      .returning();
    res.json(LikeQuestionResponse.parse({ liked: false, likeCount: question?.voteCount ?? 0 }));
    return;
  }

  const [question] = await db.select({ id: questionsTable.id }).from(questionsTable).where(eq(questionsTable.id, params.data.id)).limit(1);
  if (!question) {
    res.status(404).json({ error: "Question not found" });
    return;
  }

  await db.insert(questionLikesTable).values({ questionId: params.data.id, userId });
  const [updated] = await db
    .update(questionsTable)
    .set({ voteCount: sql`${questionsTable.voteCount} + 1` })
    .where(eq(questionsTable.id, params.data.id))
    .returning();
  res.json(LikeQuestionResponse.parse({ liked: true, likeCount: updated.voteCount }));
});

router.post("/questions/:questionId/answers", requireDbUser, async (req, res): Promise<void> => {
  const params = CreateAnswerParams.safeParse(req.params);
  const body = CreateAnswerBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid answer request" });
    return;
  }

  const question = await getQuestionById(params.data.questionId);
  if (!question) {
    res.status(404).json({ error: "Question not found" });
    return;
  }

  let verification: { verified: boolean; note: string };
  try {
    verification = await verifyCommunityAnswer(question.title, question.body, body.data.body);
  } catch (err) {
    req.log.error({ err }, "AI answer verification failed");
    res.status(503).json({ error: "AI verification is temporarily unavailable. Please try again." });
    return;
  }

  const [answer] = await db.insert(answersTable).values({
    body: body.data.body,
    questionId: params.data.questionId,
    authorId: (req as AuthenticatedRequest).currentUserId!,
    isAiGenerated: false,
    isVerified: verification.verified,
    verificationNote: verification.note,
  }).returning();

  if (verification.verified) {
    await db.update(questionsTable).set({ answerCount: sql`${questionsTable.answerCount} + 1`, status: "answered" }).where(eq(questionsTable.id, params.data.questionId));
    await db.update(usersTable).set({ answersCount: sql`${usersTable.answersCount} + 1`, reputation: sql`${usersTable.reputation} + 8` }).where(eq(usersTable.id, (req as AuthenticatedRequest).currentUserId!));
  }

  const [joined] = await db
    .select({
      id: answersTable.id,
      body: answersTable.body,
      questionId: answersTable.questionId,
      authorId: answersTable.authorId,
      isAiGenerated: answersTable.isAiGenerated,
      isVerified: answersTable.isVerified,
      verificationNote: answersTable.verificationNote,
      isAccepted: answersTable.isAccepted,
      voteCount: answersTable.voteCount,
      createdAt: answersTable.createdAt,
      authorUsername: usersTable.username,
      authorDisplayName: usersTable.displayName,
      authorAvatarUrl: usersTable.avatarUrl,
    })
    .from(answersTable)
    .leftJoin(usersTable, eq(answersTable.authorId, usersTable.id))
    .where(eq(answersTable.id, answer.id));

  res.status(201).json(AcceptAnswerResponse.parse(formatAnswer(joined)));
});

router.post("/answers/:id/vote", requireDbUser, async (req, res): Promise<void> => {
  const params = VoteAnswerParams.safeParse(req.params);
  const body = VoteAnswerBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid vote request" });
    return;
  }

  const amount = body.data.direction === "up" ? 1 : -1;
  const [answer] = await db.update(answersTable).set({ voteCount: sql`${answersTable.voteCount} + ${amount}` }).where(eq(answersTable.id, params.data.id)).returning();
  if (!answer) {
    res.status(404).json({ error: "Answer not found" });
    return;
  }

  res.json(VoteAnswerResponse.parse({ voteCount: answer.voteCount }));
});

router.post("/answers/:id/like", requireDbUser, async (req, res): Promise<void> => {
  const params = LikeAnswerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const userId = (req as AuthenticatedRequest).currentUserId!;
  const [existing] = await db
    .select()
    .from(answerLikesTable)
    .where(and(eq(answerLikesTable.answerId, params.data.id), eq(answerLikesTable.userId, userId)))
    .limit(1);

  if (existing) {
    await db.delete(answerLikesTable).where(eq(answerLikesTable.id, existing.id));
    const [answer] = await db
      .update(answersTable)
      .set({ voteCount: sql`GREATEST(${answersTable.voteCount} - 1, 0)` })
      .where(eq(answersTable.id, params.data.id))
      .returning();
    res.json(LikeAnswerResponse.parse({ liked: false, likeCount: answer?.voteCount ?? 0 }));
    return;
  }

  const [answer] = await db.select({ id: answersTable.id }).from(answersTable).where(eq(answersTable.id, params.data.id)).limit(1);
  if (!answer) {
    res.status(404).json({ error: "Answer not found" });
    return;
  }

  await db.insert(answerLikesTable).values({ answerId: params.data.id, userId });
  const [updated] = await db
    .update(answersTable)
    .set({ voteCount: sql`${answersTable.voteCount} + 1` })
    .where(eq(answersTable.id, params.data.id))
    .returning();
  res.json(LikeAnswerResponse.parse({ liked: true, likeCount: updated.voteCount }));
});

router.post("/answers/:id/accept", requireDbUser, async (req, res): Promise<void> => {
  const params = AcceptAnswerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [target] = await db.select().from(answersTable).where(eq(answersTable.id, params.data.id)).limit(1);
  if (!target) {
    res.status(404).json({ error: "Answer not found" });
    return;
  }

  await db.update(answersTable).set({ isAccepted: false }).where(eq(answersTable.questionId, target.questionId));
  const [answer] = await db.update(answersTable).set({ isAccepted: true }).where(eq(answersTable.id, params.data.id)).returning();
  await db.update(questionsTable).set({ status: answer.isAiGenerated ? "ai_answered" : "answered" }).where(eq(questionsTable.id, answer.questionId));

  const [joined] = await db
    .select({
      id: answersTable.id,
      body: answersTable.body,
      questionId: answersTable.questionId,
      authorId: answersTable.authorId,
      isAiGenerated: answersTable.isAiGenerated,
      isVerified: answersTable.isVerified,
      verificationNote: answersTable.verificationNote,
      isAccepted: answersTable.isAccepted,
      voteCount: answersTable.voteCount,
      createdAt: answersTable.createdAt,
      authorUsername: usersTable.username,
      authorDisplayName: usersTable.displayName,
      authorAvatarUrl: usersTable.avatarUrl,
    })
    .from(answersTable)
    .leftJoin(usersTable, eq(answersTable.authorId, usersTable.id))
    .where(eq(answersTable.id, answer.id));

  res.json(AcceptAnswerResponse.parse(formatAnswer(joined)));
});

router.get("/stats/dashboard", async (_req, res): Promise<void> => {
  const [{ value: totalQuestions }] = await db.select({ value: count() }).from(questionsTable);
  const [{ value: totalAnswers }] = await db.select({ value: count() }).from(answersTable).where(eq(answersTable.isVerified, true));
  const [{ value: totalUsers }] = await db.select({ value: count() }).from(usersTable);
  const [{ value: unansweredCount }] = await db.select({ value: count() }).from(questionsTable).where(eq(questionsTable.status, "open"));
  const [{ value: aiAnsweredCount }] = await db.select({ value: count() }).from(questionsTable).where(eq(questionsTable.status, "ai_answered"));

  res.json(GetDashboardStatsResponse.parse({ totalQuestions, totalAnswers, totalUsers, unansweredCount, aiAnsweredCount, avgResponseTimeHours: 6.4 }));
});

router.get("/stats/trending", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      id: questionsTable.id,
      title: questionsTable.title,
      body: questionsTable.body,
      category: questionsTable.category,
      tags: questionsTable.tags,
      status: questionsTable.status,
      voteCount: questionsTable.voteCount,
      answerCount: questionsTable.answerCount,
      viewCount: questionsTable.viewCount,
      authorId: questionsTable.authorId,
      createdAt: questionsTable.createdAt,
      updatedAt: questionsTable.updatedAt,
      authorUsername: usersTable.username,
      authorDisplayName: usersTable.displayName,
      authorAvatarUrl: usersTable.avatarUrl,
    })
    .from(questionsTable)
    .innerJoin(usersTable, eq(questionsTable.authorId, usersTable.id))
    .orderBy(desc(sql`${questionsTable.voteCount} + ${questionsTable.viewCount}`))
    .limit(6);

  res.json(GetTrendingQuestionsResponse.parse(rows.map(formatQuestion)));
});

router.get("/stats/categories", async (_req, res): Promise<void> => {
  const rows = await db.select({ category: questionsTable.category, count: count() }).from(questionsTable).groupBy(questionsTable.category).orderBy(desc(count())).limit(8);
  res.json(GetCategoryStatsResponse.parse(rows));
});

router.get("/stats/recent-activity", async (_req, res): Promise<void> => {
  const questionRows = await db
    .select({ id: questionsTable.id, title: questionsTable.title, username: usersTable.username, createdAt: questionsTable.createdAt })
    .from(questionsTable)
    .innerJoin(usersTable, eq(questionsTable.authorId, usersTable.id))
    .orderBy(desc(questionsTable.createdAt))
    .limit(5);

  const answerRows = await db
    .select({ id: answersTable.id, title: questionsTable.title, username: usersTable.username, createdAt: answersTable.createdAt, isAiGenerated: answersTable.isAiGenerated })
    .from(answersTable)
    .innerJoin(questionsTable, eq(answersTable.questionId, questionsTable.id))
    .leftJoin(usersTable, eq(answersTable.authorId, usersTable.id))
    .where(eq(answersTable.isVerified, true))
    .orderBy(desc(answersTable.createdAt))
    .limit(5);

  const feed = [
    ...questionRows.map((item) => ({ id: item.id, type: "question" as const, title: item.title, username: item.username, createdAt: item.createdAt })),
    ...answerRows.map((item) => ({ id: item.id, type: item.isAiGenerated ? "ai_answer" as const : "answer" as const, title: item.title, username: item.isAiGenerated ? "opal-ai" : item.username ?? "member", createdAt: item.createdAt })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 8);

  res.json(GetRecentActivityResponse.parse(feed));
});

router.post("/ai/check-unanswered", async (req, res): Promise<void> => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const staleQuestions = await db.select().from(questionsTable).where(and(eq(questionsTable.status, "open"), sql`${questionsTable.createdAt} <= ${cutoff}`)).limit(3);
  let answered = 0;

  for (const question of staleQuestions) {
    try {
      const body = await generateAiAnswer(question.title, question.body, question.category);
      await db.insert(answersTable).values({
        body,
        questionId: question.id,
        authorId: null,
        isAiGenerated: true,
        isVerified: true,
        verificationNote: "Generated by Opal Zeta AI because the question had no community answer within 24 hours.",
      });
      await db.update(questionsTable).set({ status: "ai_answered", answerCount: sql`${questionsTable.answerCount} + 1` }).where(eq(questionsTable.id, question.id));
      answered += 1;
    } catch (err) {
      req.log.error({ err, questionId: question.id }, "AI unanswered question generation failed");
    }
  }

  res.json(TriggerAiAnswerCheckResponse.parse({ processed: staleQuestions.length, answered }));
});

export default router;
