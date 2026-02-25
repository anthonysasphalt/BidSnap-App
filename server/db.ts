import { eq, desc, sql, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { InsertUser, users, demoLinks, linkViews, adminSessions, InsertDemoLink, InsertLinkView, InsertAdminSession } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = mysql.createPool({
        uri: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: true,
        },
        waitForConnections: true,
        connectionLimit: 5,
      });
      _db = drizzle(pool as any);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== Demo Links ====================

export async function createDemoLink(link: InsertDemoLink) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(demoLinks).values(link);
  return link;
}

export async function getDemoLinkByToken(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.select().from(demoLinks).where(eq(demoLinks.token, token)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAllDemoLinks() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(demoLinks).orderBy(desc(demoLinks.createdAt));
}

export async function updateDemoLinkStatus(token: string, status: "active" | "expired" | "revoked" | "viewed") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(demoLinks).set({ status }).where(eq(demoLinks.token, token));
}

export async function incrementDemoLinkViews(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(demoLinks)
    .set({ viewsUsed: sql`${demoLinks.viewsUsed} + 1` })
    .where(eq(demoLinks.token, token));
}

// ==================== Link Views ====================

export async function recordLinkView(view: InsertLinkView) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(linkViews).values(view);
}

export async function getViewsForLink(linkId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(linkViews).where(eq(linkViews.linkId, linkId)).orderBy(desc(linkViews.viewedAt));
}

// ==================== Admin Sessions ====================

export async function createAdminSession(sessionId: string, username: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const now = Date.now();
  const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours
  await db.insert(adminSessions).values({ sessionId, username, createdAt: now, expiresAt });
}

export async function getAdminSessionFromDb(sessionId: string): Promise<{ username: string } | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(adminSessions)
    .where(eq(adminSessions.sessionId, sessionId))
    .limit(1);

  if (result.length === 0) return null;
  const session = result[0];

  // Check expiry
  if (Date.now() > session.expiresAt) {
    await db.delete(adminSessions).where(eq(adminSessions.sessionId, sessionId));
    return null;
  }

  return { username: session.username };
}

export async function deleteAdminSession(sessionId: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(adminSessions).where(eq(adminSessions.sessionId, sessionId));
}

export async function cleanExpiredAdminSessions(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(adminSessions).where(lt(adminSessions.expiresAt, Date.now()));
}
