"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  Mail,
  Lock,
  Facebook,
  Chrome,
  Eye,
  EyeOff,
  User,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/lib/store";
import { trpc } from "@/trpc/client";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"traveller" | "owner">("traveller");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signInMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      // Store token
      localStorage.setItem("token", data.token);

      // Store complete user data including role
      setUser(data.user);

      router.push("/");
    },
    onError: (error) => {
      setError(error.message);
      setLoading(false);
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signInMutation.mutateAsync({ email, password, role });
      localStorage.setItem("token", res.token);
      setUser(res.user);
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

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
            Welcome Back
          </h1>
          <p className="text-gray-600">Log in to your HolidaySera account</p>
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

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("traveller")}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    role === "traveller"
                      ? "border-sky-600 bg-sky-50 text-sky-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <User className="h-6 w-6" />
                  <span className="text-sm font-medium">Traveller</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("owner")}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    role === "owner"
                      ? "border-sky-600 bg-sky-50 text-sky-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <Building2 className="h-6 w-6" />
                  <span className="text-sm font-medium">Owner</span>
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link
                href="/reset-password"
                className="text-sky-600 hover:text-sky-700"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700"
              size="lg"
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <div className="my-6">
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" className="w-full">
              <Chrome className="mr-2 h-5 w-5" />
              Google
            </Button>
            <Button variant="outline" className="w-full">
              <Facebook className="mr-2 h-5 w-5" />
              Facebook
            </Button>
          </div>
        </Card>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-sky-600 hover:text-sky-700"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
