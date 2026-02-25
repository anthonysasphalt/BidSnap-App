/**
 * Vercel Serverless Function Handler
 * 
 * Static imports so Vercel's bundler (nft) traces and includes all server files.
 * Health check is dependency-free. Express app creation is wrapped in try/catch.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

let app: express.Application | null = null;

function getApp(): express.Application {
  if (!app) {
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
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Health check — no Express needed
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
    const expressApp = getApp();
    
    return new Promise<void>((resolve) => {
      expressApp(req as any, res as any, () => {
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
    });
  }
}
