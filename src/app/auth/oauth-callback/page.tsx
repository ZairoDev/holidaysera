"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/lib/store";
import { trpc } from "@/trpc/client";

/**
 * OAuth Callback Handler
 * 
 * This page receives the JWT token from OAuth callback,
 * stores it, fetches user data, and redirects to the intended destination.
 */

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUserStore();

  const token = searchParams?.get("token");
  const redirect = searchParams?.get("redirect") || "/";

  const [tokenStored, setTokenStored] = useState(false);

  useEffect(() => {
    if (!token) return;
    localStorage.setItem("token", token);
    setTokenStored(true);
  }, [token]);

  // Fetch user data after OAuth login
  const { data: userData, isLoading, isError } = trpc.auth.me.useQuery(undefined, {
    enabled: !!token && tokenStored,
    retry: false,
  });

  useEffect(() => {
    if (!token) {
      router.push("/login?error=no_token");
      return;
    }
    if (isError) {
      // Token exists but we couldn't fetch the session user.
      localStorage.removeItem("token");
      router.push("/login?error=no_token");
      return;
    }

    // Once we have user data, store it and redirect
    if (userData && !isLoading) {
      setUser({
        id: userData._id?.toString() || "",
        fullName: userData.firstName && userData.lastName 
          ? `${userData.firstName} ${userData.lastName}`
          : userData.name || "",
        email: userData.email,
        role: userData.role,
        createdAt: userData.createdAt,
      });

      router.push(redirect);
    }
  }, [token, userData, isLoading, isError, router, redirect, setUser]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing login...</p>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}


