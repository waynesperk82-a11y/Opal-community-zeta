import type { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export type AuthenticatedRequest = Request & {
  clerkUserId: string;
  currentUserId?: number;
};

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = getAuth(req);
  const clerkUserId = auth?.sessionClaims?.userId || auth?.userId;

  if (!clerkUserId) {
    res.status(401).json({ error: "Please sign in to continue." });
    return;
  }

  (req as AuthenticatedRequest).clerkUserId = clerkUserId;
  next();
}

export async function requireDbUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  requireAuth(req, res, async () => {
    const authReq = req as AuthenticatedRequest;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.clerkUserId, authReq.clerkUserId)).limit(1);

    if (!user) {
      res.status(403).json({ error: "Your account profile is not ready yet. Refresh and try again." });
      return;
    }

    authReq.currentUserId = user.id;
    next();
  });
}