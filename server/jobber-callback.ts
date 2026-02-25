/**
 * Jobber OAuth Callback Handler
 * 
 * Handles the OAuth callback from Jobber's authorization flow.
 * Exchanges the authorization code for access and refresh tokens.
 */
import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const JOBBER_CLIENT_ID = process.env.JOBBER_CLIENT_ID;
const JOBBER_CLIENT_SECRET = process.env.JOBBER_CLIENT_SECRET;
const JOBBER_TOKEN_ENDPOINT = "https://api.getjobber.com/api/oauth/token";

interface JobberTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

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
      return res.status(400).json({
        error: String(error),
        description: String(error_description),
      });
    }

    // Validate required parameters
    if (!code) {
      console.error("[Jobber OAuth] Missing authorization code");
      return res.status(400).json({ error: "Missing authorization code" });
    }

    if (!JOBBER_CLIENT_ID || !JOBBER_CLIENT_SECRET) {
      console.error("[Jobber OAuth] Missing environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Exchange authorization code for tokens
    console.log("[Jobber OAuth] Exchanging code for tokens...");
    const tokenResponse = await fetch(JOBBER_TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: String(code),
        client_id: JOBBER_CLIENT_ID,
        client_secret: JOBBER_CLIENT_SECRET,
        redirect_uri: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/jobber/callback`,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("[Jobber OAuth] Token exchange failed:", tokenResponse.status, errorData);
      return res.status(tokenResponse.status).json({
        error: "Token exchange failed",
        details: errorData,
      });
    }

    const tokens: JobberTokenResponse = await tokenResponse.json();

    console.log("[Jobber OAuth] Token exchange successful");
    console.log("[Jobber OAuth] Access token received (expires in", tokens.expires_in, "seconds)");

    // TODO: Store tokens securely in database
    // For now, we'll just log them and return success
    // In production, you would:
    // 1. Store tokens in a secure database with encryption
    // 2. Associate with admin user session
    // 3. Set up token refresh mechanism

    // Redirect back to admin panel with success message
    const adminUrl = `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/admin?jobber=connected`;
    
    return res.redirect(302, adminUrl);
  } catch (error) {
    console.error("[Jobber OAuth] Unexpected error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
