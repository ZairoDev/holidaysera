import { NextRequest, NextResponse } from "next/server";

/**
 * Google OAuth Initiation Route
 * 
 * Redirects the user to Google's OAuth consent screen.
 * After authorization, Google redirects back to /api/auth/google/callback
 */

// ============================================
// REQUIRED ENVIRONMENT VARIABLES:
// - GOOGLE_CLIENT_ID: Your Google OAuth Client ID
// - GOOGLE_CLIENT_SECRET: Your Google OAuth Client Secret  
// - GOOGLE_REDIRECT_URI: e.g., http://localhost:3001/api/auth/google/callback
// ============================================

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;

export async function GET(request: NextRequest) {
  // Validate environment variables
  if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
    console.error("Missing Google OAuth environment variables");
    return NextResponse.redirect(
      new URL("/login?error=oauth_config_error", APP_URL)
    );
  }

  // Get the redirect URL from query params (where to go after login)
  const searchParams = request.nextUrl.searchParams;
  const redirectAfterLogin = searchParams.get("redirect") || "/";
  const intendedRole = searchParams.get("role") || ""; // Optional: pre-select role

  // Create state parameter to prevent CSRF and pass data through OAuth flow
  const state = Buffer.from(
    JSON.stringify({
      redirect: redirectAfterLogin,
      role: intendedRole,
      timestamp: Date.now(),
    })
  ).toString("base64");

  // Build Google OAuth URL
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  googleAuthUrl.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("access_type", "offline");
  googleAuthUrl.searchParams.set("prompt", "consent");
  googleAuthUrl.searchParams.set("state", state);

  return NextResponse.redirect(googleAuthUrl.toString());
}

