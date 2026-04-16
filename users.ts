import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { CreateUserBody, CreateUserResponse, UpsertCurrentUserBody, UpsertCurrentUserResponse } from "@workspace/api-zod";
import { db, usersTable } from "@workspace/db";
import { requireAuth, type AuthenticatedRequest } from "../middlewares/auth";

const router: IRouter = Router();

function slugifyUsername(value: string): string {
  const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 28);
  return slug || `member-${Math.random().toString(36).slice(2, 8)}`;
}

async function uniqueUsername(seed: string): Promise<string> {
  const base = slugifyUsername(seed);
  let candidate = base;
  let index = 1;

  while (true) {
    const existing = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.username, candidate)).limit(1);
    if (!existing[0]) return candidate;
    index += 1;
    candidate = `${base}-${index}`;
  }
}

router.post("/me", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpsertCurrentUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const authReq = req as AuthenticatedRequest;
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.clerkUserId, authReq.clerkUserId)).limit(1);
  if (existing) {
    const [updated] = await db
      .update(usersTable)
      .set({
        displayName: parsed.data.displayName,
        avatarUrl: parsed.data.avatarUrl ?? existing.avatarUrl,
        email: parsed.data.email ?? existing.email,
      })
      .where(eq(usersTable.id, existing.id))
      .returning();
    res.json(UpsertCurrentUserResponse.parse(updated));
    return;
  }

  const username = await uniqueUsername(parsed.data.username || parsed.data.displayName || authReq.clerkUserId);
  const [user] = await db.insert(usersTable).values({
    clerkUserId: authReq.clerkUserId,
    username,
    email: parsed.data.email,
    displayName: parsed.data.displayName,
    avatarUrl: parsed.data.avatarUrl,
  }).returning();

  res.json(UpsertCurrentUserResponse.parse(user));
});

router.post("/users", async (req, res): Promise<void> => {
  const parsed = CreateUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db.select().from(usersTable).where(eq(usersTable.username, parsed.data.username)).limit(1);
  if (existing[0]) {
    res.json(CreateUserResponse.parse(existing[0]));
    return;
  }

  const [user] = await db.insert(usersTable).values(parsed.data).returning();
  res.json(CreateUserResponse.parse(user));
});

export default router;
