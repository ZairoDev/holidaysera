"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Heart, User, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store";
import { trpc } from "@/trpc/client";

// Move navLinks outside component to prevent recreation on every render
const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/properties", label: "Properties", icon: Search },
  { href: "/favorites", label: "Favorites", icon: Heart },
] as const;

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const { user, setUser, logout } = useUserStore();

  // Initialize client state and check for token
  useEffect(() => {
    setIsClient(true);
    setHasToken(!!localStorage.getItem("token"));
  }, []);

  // Query user data with proper enabled condition
  const meQuery = trpc.auth.me.useQuery(undefined, {
    enabled: isClient && hasToken && !user,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle query results with useEffect instead of deprecated callbacks
  useEffect(() => {
    if (meQuery.data) {
      console.log("my query data",meQuery.data);
      setUser(meQuery.data);
    }
  }, [meQuery.data, setUser]);

  useEffect(() => {
    if (meQuery.error) {
      logout();
    }
  }, [meQuery.error, logout]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Memoize auth buttons to prevent unnecessary re-renders
  const authButtons = useMemo(() => {
    if (user) {
      return (
        <Link href="/profile">
          <Button variant="outline" size="sm">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </Link>
      );
    }

    return (
      <>
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
        </Link>
        <Link href="/signup">
          <Button size="sm" className="bg-sky-600 hover:bg-sky-700">
            Sign up
          </Button>
        </Link>
      </>
    );
  }, [user]);

  const mobileAuthButtons = useMemo(() => {
    if (user) {
      return (
        <Link
          href="/profile"
          onClick={() => setMobileMenuOpen(false)}
          className="block"
        >
          <Button variant="outline" className="w-full">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
        </Link>
      );
    }

    return (
      <div className="space-y-2">
        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
          <Button variant="outline" className="w-full">
            Log in
          </Button>
        </Link>
        <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
          <Button className="w-full bg-sky-600 hover:bg-sky-700">
            Sign up
          </Button>
        </Link>
      </div>
    );
  }, [user]);

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg">
                <Home className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Stay<span className="text-sky-600">Haven</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative"
                  aria-current={isActive ? "page" : undefined}
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-sky-600"
                        : "text-gray-700 hover:text-sky-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-sky-600"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-3 md:flex">{authButtons}</div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t bg-white md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-sky-50 text-sky-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}

              {/* Mobile Auth Buttons */}
              <div className="border-t pt-3">{mobileAuthButtons}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
