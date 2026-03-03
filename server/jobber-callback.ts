/**
 * Jobber OAuth Callback Handler
 *
 * Handles the OAuth callback from Jobber's authorization flow.
 * Exchanges the authorization code for access and refresh tokens,
 * then stores them in the database.
 */
import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { exchangeCodeForTokens } from "./jobber";
import { saveJobberTokens } from "./db";

const APP_URL = "https://bidsnap-app.vercel.app";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Only accept GET requests (Jobber redirects with query params)
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { code, state, error, error_description } = req.query;

    // Check for OAuth errors from Jobber
    if (error) {
      console.error("[Jobber OAuth] Error from Jobber:", error, error_description);
      return res.redirect(302, `${APP_URL}/admin?jobber=error&message=${encodeURIComponent(String(error_description || error))}`);
    }

    // Validate required parameters
    if (!code) {
      console.error("[Jobber OAuth] Missing authorization code");
      return res.redirect(302, `${APP_URL}/admin?jobber=error&message=Missing+authorization+code`);
    }

    const JOBBER_CLIENT_ID = process.env.JOBBER_CLIENT_ID;
    const JOBBER_CLIENT_SECRET = process.env.JOBBER_CLIENT_SECRET;

    if (!JOBBER_CLIENT_ID || !JOBBER_CLIENT_SECRET) {
      console.error("[Jobber OAuth] Missing environment variables");
      return res.redirect(302, `${APP_URL}/admin?jobber=error&message=Server+configuration+error`);
    }

    // Exchange authorization code for tokens
    const redirectUri = `${APP_URL}/api/jobber/callback`;
    const tokens = await exchangeCodeForTokens(String(code), redirectUri);

    // Store tokens in the database
    await saveJobberTokens(tokens.accessToken, tokens.refreshToken, tokens.expiresIn);

    console.log("[Jobber OAuth] Successfully connected and tokens stored");

    // Redirect back to admin panel with success message
    return res.redirect(302, `${APP_URL}/admin?jobber=connected`);
  } catch (error: any) {
    console.error("[Jobber OAuth] Unexpected error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return res.redirect(302, `${APP_URL}/admin?jobber=error&message=${encodeURIComponent(message)}`);
  }
}
