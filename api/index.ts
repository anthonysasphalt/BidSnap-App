/**
 * Vercel Serverless Function Handler
 *
 * Exports a default handler compatible with @vercel/node.
 * Creates and configures an Express app with tRPC routes.
 */
import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import express, { type Request, type Response } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

// Create and configure the Express app once
let app: express.Application | null = null;

function createApp(): express.Application {
  const newApp = express();

  // Body parser
  newApp.use(express.json({ limit: "50mb" }));
  newApp.use(express.urlencoded({ limit: "50mb", extended: true }));

  // tRPC API
  newApp.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Health check
  newApp.get("/api/health", (_req: Request, res: any) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return newApp;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!app) {
      app = createApp();
    }
    // Use app.handle() — Express.Application is not directly callable
    return (app as any)(req, res);
  } catch (error) {
    console.error("[Serverless Handler] Error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
