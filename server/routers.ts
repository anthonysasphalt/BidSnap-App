import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";

import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import {
  createDemoLink,
  getDemoLinkByToken,
  getAllDemoLinks,
  updateDemoLinkStatus,
  incrementDemoLinkViews,
  recordLinkView,
  getViewsForLink,
  createAdminSession,
  getAdminSessionFromDb,
  deleteAdminSession,
} from "./db";

// Admin credentials — simple password-based auth for the BidSnap admin
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "bidsnap2025";
const ADMIN_SESSION_KEY = "bidsnap_admin_session";

// Helper to extract session ID from cookie header
function getSessionIdFromCookie(req: any): string | null {
  const cookies = req.headers?.cookie || "";
  const match = cookies.match(new RegExp(`${ADMIN_SESSION_KEY}=([^;\\s]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Helper to check admin session from DB (async)
async function getAdminSession(req: any): Promise<{ username: string } | null> {
  const sessionId = getSessionIdFromCookie(req);
  if (!sessionId) return null;
  return getAdminSessionFromDb(sessionId);
}

// Admin-only middleware (async-aware)
const adminMiddleware = publicProcedure.use(async ({ ctx, next }) => {
  const session = await getAdminSession(ctx.req);
  if (!session) {
    throw new Error("Admin authentication required");
  }
  return next({ ctx: { ...ctx, adminUser: session } });
});

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      (ctx.res as any).clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ==================== Admin Auth ====================
  admin: router({
    login: publicProcedure
      .input(z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
      }))
      .mutation(async ({ input, ctx }) => {
        // Trim whitespace to avoid invisible character issues
        const username = input.username.trim();
        const password = input.password.trim();

        if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
          throw new Error("Invalid credentials");
        }

        const sessionId = nanoid(32);
        await createAdminSession(sessionId, username);

        // Set persistent cookie
        const req = ctx.req as any;
        const res = ctx.res as any;
        res.cookie(ADMIN_SESSION_KEY, sessionId, {
          httpOnly: true,
          secure: req.protocol === "https",
          sameSite: req.protocol === "https" ? "none" : "lax",
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
          path: "/",
        });

        return { success: true, username };
      }),

    me: publicProcedure.query(async ({ ctx }) => {
      const session = await getAdminSession(ctx.req);
      return session
        ? { authenticated: true, username: session.username }
        : { authenticated: false, username: null };
    }),

    logout: publicProcedure.mutation(async ({ ctx }) => {
      const sessionId = getSessionIdFromCookie(ctx.req);
      if (sessionId) {
        await deleteAdminSession(sessionId);
      }
      const req = ctx.req as any;
      const res = ctx.res as any;
      res.clearCookie(ADMIN_SESSION_KEY, {
        httpOnly: true,
        secure: req.protocol === "https",
        sameSite: req.protocol === "https" ? "none" : "lax",
        path: "/",
      });
      return { success: true };
    }),
  }),

  // ==================== Demo Links (Admin) ====================
  demoLinks: router({
    create: adminMiddleware
      .input(z.object({
        prospectName: z.string().min(1),
        prospectEmail: z.string().email(),
        companyName: z.string().optional(),
        maxViews: z.number().min(1).max(100).default(3),
        expiryHours: z.number().min(1).max(720).default(48),
      }))
      .mutation(async ({ input }) => {
        const token = nanoid(12);
        const now = Date.now();
        const expiresAt = now + input.expiryHours * 60 * 60 * 1000;

        await createDemoLink({
          token,
          prospectName: input.prospectName,
          prospectEmail: input.prospectEmail.toLowerCase(),
          companyName: input.companyName || null,
          maxViews: input.maxViews,
          viewsUsed: 0,
          expiryHours: input.expiryHours,
          status: "active",
          createdAt: now,
          expiresAt,
        });

        return { token, expiresAt };
      }),

    list: adminMiddleware.query(async () => {
      const links = await getAllDemoLinks();

      // Auto-expire links that have passed their expiration time
      const now = Date.now();
      for (const link of links) {
        if (link.status === "active" && now > link.expiresAt) {
          await updateDemoLinkStatus(link.token, "expired");
          link.status = "expired";
        }
        if (link.status === "active" && link.viewsUsed >= link.maxViews) {
          await updateDemoLinkStatus(link.token, "viewed");
          link.status = "viewed";
        }
      }

      return links;
    }),

    getViews: adminMiddleware
      .input(z.object({ linkId: z.number() }))
      .query(async ({ input }) => {
        return getViewsForLink(input.linkId);
      }),

    revoke: adminMiddleware
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        await updateDemoLinkStatus(input.token, "revoked");
        return { success: true };
      }),
  }),

  // ==================== Prospect Access (Public) ====================
  prospect: router({
    verify: publicProcedure
      .input(z.object({
        token: z.string(),
        email: z.string().email(),
      }))
      .mutation(async ({ input, ctx }) => {
        const link = await getDemoLinkByToken(input.token);

        if (!link) {
          return { success: false, error: "Link not found" };
        }

        if (link.status === "revoked") {
          return { success: false, error: "This demo link has been revoked." };
        }

        const now = Date.now();
        if (now > link.expiresAt) {
          await updateDemoLinkStatus(input.token, "expired");
          return { success: false, error: "This demo link has expired." };
        }

        if (link.viewsUsed >= link.maxViews) {
          await updateDemoLinkStatus(input.token, "viewed");
          return { success: false, error: "Maximum views reached for this link." };
        }

        if (input.email.toLowerCase() !== link.prospectEmail.toLowerCase()) {
          return { success: false, error: "Email does not match. Please use the email address provided by Anthony." };
        }

        // Record the view
        const req = ctx.req as any;
        await incrementDemoLinkViews(input.token);
        await recordLinkView({
          linkId: link.id,
          viewedAt: now,
          ipAddress: (req.headers?.["x-forwarded-for"] as string)?.split(",")[0] || req.socket?.remoteAddress || null,
          userAgent: req.headers?.["user-agent"] || null,
        });

        // Check if this was the last view
        if (link.viewsUsed + 1 >= link.maxViews) {
          await updateDemoLinkStatus(input.token, "viewed");
        }

        return {
          success: true,
          prospectName: link.prospectName,
          prospectEmail: link.prospectEmail,
          viewsUsed: link.viewsUsed + 1,
          maxViews: link.maxViews,
          expiresAt: link.expiresAt,
        };
      }),

    checkLink: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const link = await getDemoLinkByToken(input.token);

        if (!link) {
          return { valid: false, error: "Link not found" };
        }

        if (link.status === "revoked") {
          return { valid: false, error: "This demo link has been revoked." };
        }

        const now = Date.now();
        if (now > link.expiresAt) {
          await updateDemoLinkStatus(input.token, "expired");
          return { valid: false, error: "This demo link has expired." };
        }

        if (link.viewsUsed >= link.maxViews) {
          await updateDemoLinkStatus(input.token, "viewed");
          return { valid: false, error: "Maximum views reached." };
        }

        return {
          valid: true,
          prospectName: link.prospectName,
          companyName: link.companyName,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
