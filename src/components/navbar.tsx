"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Heart, User, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationDropdown } from "@/components/notification-dropdown";
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

  const { user, setUser } = useUserStore();

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

    }
  }, [meQuery.error]);

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
          <div className="hidden items-center gap-3 md:flex">
            {user && <NotificationDropdown />}
            {authButtons}
          </div>

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

      {/* Mobile Menu - Redesigned Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              id="mobile-menu"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed left-0 top-16 z-50 h-[calc(100vh-64px)] w-72 overflow-y-auto bg-white dark:bg-slate-900 shadow-2xl md:hidden"
            >
              <div className="flex flex-col p-6">
                {/* Header Section */}
                <div className="mb-8">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Navigation
                  </h2>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {NAV_LINKS.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/20"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <Icon className={`h-5 w-5 transition-transform ${isActive ? "scale-110" : ""}`} />
                          <span className="font-medium">{link.label}</span>
                          {isActive && (
                            <motion.div
                              layoutId="mobileSidebarActive"
                              className="ml-auto h-2 w-2 rounded-full bg-white"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Divider */}
                <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700" />

                {/* Account Section */}
                <div className="mb-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Account
                  </h2>
                </div>

                {/* Notifications (Mobile) */}
                {user && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Notifications
                      </span>
                    </div>
                    <div className="mb-4">
                      <NotificationDropdown />
                    </div>
                  </div>
                )}

                {/* Auth Buttons */}
                <div className="space-y-3">
                  {user ? (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-sky-50 to-sky-100 px-4 py-3 font-medium text-sky-700 shadow-sm transition-all hover:shadow-md dark:from-sky-900/30 dark:to-sky-800/30 dark:text-sky-300"
                      >
                        <User className="h-5 w-5" />
                        <span>My Profile</span>
                      </Link>
                    </motion.div>
                  ) : (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          href="/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-center rounded-xl border-2 border-gray-300 px-4 py-3 font-medium text-gray-700 transition-all hover:border-sky-500 hover:bg-sky-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-sky-900/20"
                        >
                          Log in
                        </Link>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          href="/signup"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 px-4 py-3 font-medium text-white shadow-lg shadow-sky-600/30 transition-all hover:shadow-xl hover:shadow-sky-600/40 dark:from-sky-500 dark:to-sky-600"
                        >
                          Create Account
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>

                {/* Info Section */}
                <div className="mt-auto pt-8">
                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      💡 <span className="ml-2">Browse properties and book your next stay with StayHaven</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
