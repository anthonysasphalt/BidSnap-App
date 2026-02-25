import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, bigint } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Demo links — each row is a unique prospect-specific demo link
 */
export const demoLinks = mysqlTable("demo_links", {
  id: int("id").autoincrement().primaryKey(),
  /** Unique token used in the URL: /view/:token */
  token: varchar("token", { length: 32 }).notNull().unique(),
  /** Prospect's name */
  prospectName: varchar("prospectName", { length: 255 }).notNull(),
  /** Prospect's email — must match for verification */
  prospectEmail: varchar("prospectEmail", { length: 320 }).notNull(),
  /** Optional company name */
  companyName: varchar("companyName", { length: 255 }),
  /** Maximum number of views allowed */
  maxViews: int("maxViews").notNull().default(3),
  /** Number of views used so far */
  viewsUsed: int("viewsUsed").notNull().default(0),
  /** Expiration hours from creation */
  expiryHours: int("expiryHours").notNull().default(48),
  /** Link status */
  status: mysqlEnum("status", ["active", "expired", "revoked", "viewed"]).default("active").notNull(),
  /** Timestamps stored as bigint (ms since epoch) for UTC safety */
  createdAt: bigint("createdAt", { mode: "number" }).notNull(),
  /** When the link expires (ms since epoch) */
  expiresAt: bigint("expiresAt", { mode: "number" }).notNull(),
});

export type DemoLink = typeof demoLinks.$inferSelect;
export type InsertDemoLink = typeof demoLinks.$inferInsert;

/**
 * Link views — tracks each time a prospect opens their link
 */
export const linkViews = mysqlTable("link_views", {
  id: int("id").autoincrement().primaryKey(),
  /** Foreign key to demo_links */
  linkId: int("linkId").notNull(),
  /** When the view occurred (ms since epoch) */
  viewedAt: bigint("viewedAt", { mode: "number" }).notNull(),
  /** Viewer's IP address */
  ipAddress: varchar("ipAddress", { length: 45 }),
  /** User agent string */
  userAgent: text("userAgent"),
});

export type LinkView = typeof linkViews.$inferSelect;
export type InsertLinkView = typeof linkViews.$inferInsert;

/**
 * Admin sessions — persistent sessions for the BidSnap admin panel
 */
export const adminSessions = mysqlTable("admin_sessions", {
  id: int("id").autoincrement().primaryKey(),
  /** Session token stored in cookie */
  sessionId: varchar("sessionId", { length: 64 }).notNull().unique(),
  /** Username of the admin */
  username: varchar("username", { length: 64 }).notNull(),
  /** When the session was created (ms since epoch) */
  createdAt: bigint("createdAt", { mode: "number" }).notNull(),
  /** When the session expires (ms since epoch) */
  expiresAt: bigint("expiresAt", { mode: "number" }).notNull(),
});

export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertAdminSession = typeof adminSessions.$inferInsert;
