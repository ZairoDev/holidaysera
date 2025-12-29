import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/server/db";
import { signToken } from "@/server/utils/jwt";
import Users from "@/models/users";

// Force dynamic rendering - this route uses searchParams
export const dynamic = "force-dynamic";

/**
 * Google OAuth Callback Route
 * 
 * Handles the redirect from Google after user authorization.
 * Exchanges the auth code for tokens, creates/finds user, and redirects with JWT.
 */

// ============================================
// REQUIRED ENVIRONMENT VARIABLES:
// - GOOGLE_CLIENT_ID: Your Google OAuth Client ID
// - GOOGLE_CLIENT_SECRET: Your Google OAuth Client Secret
// - GOOGLE_REDIRECT_URI: e.g., http://localhost:3001/api/auth/google/callback
// ============================================

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

interface GoogleUserInfo {
  sub: string; // Google's unique user ID
  email: string;
  email_verified: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export async function GET(request: NextRequest) {
  try {
    // Validate environment variables
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
      console.error("Missing Google OAuth environment variables");
      return NextResponse.redirect(
        new URL("/login?error=oauth_config_error", APP_URL)
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      console.error("Google OAuth error:", error);
      return NextResponse.redirect(
        new URL(`/login?error=${error}`, APP_URL)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/login?error=no_code", APP_URL)
      );
    }

    // Parse state parameter
    let stateData = { redirect: "/", role: "" };
    if (state) {
      try {
        stateData = JSON.parse(Buffer.from(state, "base64").toString());
      } catch (e) {
        console.error("Failed to parse state:", e);
      }
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Token exchange failed:", errorData);
      return NextResponse.redirect(
        new URL("/login?error=token_exchange_failed", APP_URL)
      );
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json();

    // Get user info from Google
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      console.error("Failed to get user info");
      return NextResponse.redirect(
        new URL("/login?error=user_info_failed", APP_URL)
      );
    }

    const googleUser: GoogleUserInfo = await userInfoResponse.json();

    // Connect to database
    await connectDb();

    // Check if user exists by email or providerId
    let user = await Users.findOne({
      $or: [
        { email: googleUser.email },
        { providerId: googleUser.sub, authProvider: "google" },
      ],
    });

    let isNewUser = false;

    if (user) {
      // Existing user - update OAuth info if they signed up with email/password before
      if (user.authProvider === "local" && !user.providerId) {
        // Link Google account to existing local account
        user.authProvider = "google";
        user.providerId = googleUser.sub;
        if (!user.profilePic && googleUser.picture) {
          user.profilePic = googleUser.picture;
        }
        await user.save();
      }
    } else {
      // New user - create account
      isNewUser = true;
      user = await Users.create({
        firstName: googleUser.given_name || googleUser.name.split(" ")[0],
        lastName: googleUser.family_name || googleUser.name.split(" ").slice(1).join(" ") || "",
        name: googleUser.name,
        email: googleUser.email,
        profilePic: googleUser.picture || "",
        authProvider: "google",
        providerId: googleUser.sub,
        isVerified: googleUser.email_verified,
        isProfileComplete: false, // New OAuth users need to select role
        role: null, // Will be set in complete-profile
        password: null,
        phone: "",
        countryCode: "+91",
      });
    }

    // Generate JWT token
    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role || "Traveller", // Default role for token, will be updated after profile completion
    });

    // Determine redirect URL - use APP_URL to ensure correct port
    let redirectUrl: URL;
    
    if (isNewUser || !user.isProfileComplete || !user.role) {
      // New OAuth user needs to complete profile (select role)
      redirectUrl = new URL("/auth/complete-profile", APP_URL);
      redirectUrl.searchParams.set("token", token);
      if (stateData.redirect && stateData.redirect !== "/") {
        redirectUrl.searchParams.set("redirect", stateData.redirect);
      }
    } else {
      // Existing user with complete profile - redirect to intended destination
      redirectUrl = new URL("/auth/oauth-callback", APP_URL);
      redirectUrl.searchParams.set("token", token);
      redirectUrl.searchParams.set("redirect", stateData.redirect || "/");
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/login?error=oauth_callback_failed", APP_URL)
    );
  }
}