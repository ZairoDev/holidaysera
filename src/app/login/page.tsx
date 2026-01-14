"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";

// Map OAuth error codes to user-friendly messages
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  oauth_config_error: "OAuth is not configured. Please contact support.",
  no_code: "Authentication failed. Please try again.",
  token_exchange_failed: "Failed to authenticate with Google. Please try again.",
  user_info_failed: "Could not retrieve your profile. Please try again.",
  oauth_callback_failed: "Something went wrong. Please try again.",
  access_denied: "You cancelled the sign-in process.",
  no_token: "Session expired. Please sign in again.",
};

function LoginPageContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect") || "/";
  const oauthError = searchParams?.get("error");
  const roleParam = searchParams?.get("role") as "Traveller" | "Owner" | null;
  const initialError = oauthError ? OAUTH_ERROR_MESSAGES[oauthError] || "Authentication failed" : "";
  
  return <LoginForm redirectUrl={redirectUrl} initialError={initialError} initialRole={roleParam || undefined} />;
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
