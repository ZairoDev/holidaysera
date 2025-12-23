"use client";

import { Suspense, useEffect } from "react";
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

  // Fetch user data after OAuth login
  const { data: userData, isLoading } = trpc.auth.me.useQuery(undefined, {
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (!token) {
      router.push("/login?error=no_token");
      return;
    }

    // Store the token
    localStorage.setItem("token", token);

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
  }, [token, userData, isLoading, router, redirect, setUser]);

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


