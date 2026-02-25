/**
 * Vercel Serverless Function Handler
 * 
 * Uses lazy-loading to avoid module-level crashes.
 * Health check has zero dependencies — always works even if DB is down.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";

let app: any = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Health check — zero dependencies, always works
  if (req.url === "/api/health" || req.url === "/api/health/") {
    return res.status(200).json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV || "not set",
      }
    });
  }

  try {
    if (!app) {
      // Lazy-load everything inside try/catch so we see the actual error
      const express = (await import("express")).default;
      const { createExpressMiddleware } = await import("@trpc/server/adapters/express");
      const { appRouter } = await import("../server/routers");
      const { createContext } = await import("../server/_core/context");

      app = express();
      app.use(express.json({ limit: "50mb" }));
      app.use(express.urlencoded({ limit: "50mb", extended: true }));
      
      app.use(
        "/api/trpc",
        createExpressMiddleware({
          router: appRouter,
          createContext,
        })
      );
    }

    // Forward request to Express
    return new Promise<void>((resolve) => {
      app(req, res, () => {
        // If Express doesn't handle it, return 404
        if (!res.writableEnded) {
          res.status(404).json({ error: "Not found" });
        }
        resolve();
      });
    });
  } catch (error: any) {
    console.error("[Serverless] Fatal error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message || String(error),
      stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
    });
  }
}
