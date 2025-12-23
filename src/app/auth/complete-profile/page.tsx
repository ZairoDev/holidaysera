"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Home, User, Building2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useUserStore } from "@/lib/store";
import { trpc } from "@/trpc/client";
import { CountryDropdown, type Country } from "@/components/ui/country-dropdown";
import { countries } from "country-data-list";
import Link from "next/link";

// Get India as the default country
const INDIA_DEFAULT = countries.all.find(
  (country: Country) => country.alpha3 === "IND"
) as Country;

/**
 * Complete Profile Page
 * 
 * New OAuth users are redirected here to select their role
 * and optionally provide their phone number.
 */
function CompleteProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useUserStore();

  const token = searchParams?.get("token");
  const redirect = searchParams?.get("redirect") || "/";

  const [role, setRole] = useState<"Owner" | "Traveller" | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(INDIA_DEFAULT);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Store token immediately when page loads
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  const completeProfileMutation = trpc.auth.completeOAuthProfile.useMutation({
    onSuccess: (data) => {
      // Update user in store
      setUser({
        id: data.user.id,
        fullName: data.user.fullName,
        email: data.user.email,
        role: data.user.role,
        createdAt: data.user.createdAt,
      });

      // Store new token with updated role
      localStorage.setItem("token", data.token);

      // Redirect to intended destination
      router.push(redirect);
    },
    onError: (error) => {
      setError(error.message);
      setLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select whether you are an Owner or Traveller");
      return;
    }

    setLoading(true);

    const countryCode = selectedCountry?.countryCallingCodes[0] || "+91";

    try {
      await completeProfileMutation.mutateAsync({
        role,
        countryCode: phoneNumber ? countryCode : undefined,
        phoneNumber: phoneNumber || undefined,
      });
    } catch (err: any) {
      // Error handled by onError
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 px-4">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Session Expired</h2>
          <p className="text-gray-600 mb-4">Please sign in again to continue.</p>
          <Button onClick={() => router.push("/login")} className="bg-sky-600 hover:bg-sky-700">
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg">
              <Home className="h-7 w-7" />
            </div>
          </Link>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Just one more step to get started with HolidaysEra
          </p>
        </div>

        <Card className="p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                I am a <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("Traveller")}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    role === "Traveller"
                      ? "border-sky-600 bg-sky-50 text-sky-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <User className="h-6 w-6" />
                  <span className="text-sm font-medium">Traveller</span>
                  <span className="text-xs text-gray-500">
                    Looking to book stays
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("Owner")}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    role === "Owner"
                      ? "border-sky-600 bg-sky-50 text-sky-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <Building2 className="h-6 w-6" />
                  <span className="text-sm font-medium">Owner</span>
                  <span className="text-xs text-gray-500">
                    List your properties
                  </span>
                </button>
              </div>
            </div>

            {/* Phone Number (Optional) */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="flex gap-2">
                <div className="w-[100px]">
                  <CountryDropdown
                    onChange={(country) => setSelectedCountry(country)}
                    defaultValue="IND"
                    placeholder="Code"
                    showCallingCode
                    className="h-10"
                  />
                </div>
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="234 567 8901"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Adding your phone helps property owners contact you
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || completeProfileMutation.isPending}
              className="w-full bg-sky-600 hover:bg-sky-700"
              size="lg"
            >
              {loading || completeProfileMutation.isPending
                ? "Completing..."
                : "Complete Profile"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-50 to-blue-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        </div>
      }
    >
      <CompleteProfileContent />
    </Suspense>
  );
}


