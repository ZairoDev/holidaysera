"use client";

import { Upload, Building2, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface ProfileHeaderProps {
  user: {
    email: string;
    fullName?: string;
    role: string;
  };
  profileData?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export function ProfileHeader({ user, profileData }: ProfileHeaderProps) {
  const isOwner = user.role === "Owner";
  const displayName = profileData?.name || user.fullName || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="mb-6 sm:mb-8 overflow-hidden shadow-xl border-0">
      {/* Cover Image with Gradient */}
      <div className="relative h-32 sm:h-40 lg:h-48 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600">
        <div className="absolute inset-0 bg-black/10" />
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundImage:
              "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      <div className="px-4 sm:px-8 pb-6 sm:pb-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6 -mt-16 sm:-mt-20">
          {/* Avatar */}
          <motion.div
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Avatar className="h-28 w-28 sm:h-36 sm:w-36 lg:h-40 lg:w-40 border-4 border-white shadow-2xl ring-4 ring-sky-100">
              <AvatarImage src="" alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-500 text-3xl sm:text-4xl lg:text-5xl text-white font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-1 right-1 rounded-full bg-sky-600 p-2.5 text-white shadow-lg hover:bg-sky-700 transition-colors ring-4 ring-white"
            >
              <Upload className="h-4 w-4" />
            </motion.button>
          </motion.div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0 sm:mb-2">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900"
            >
              {displayName}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-sm sm:text-base text-gray-600 mb-3 flex items-center justify-center sm:justify-start gap-2"
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
              {user.email}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 px-4 py-2 text-sm font-medium text-sky-700 shadow-sm"
            >
              {isOwner ? (
                <>
                  <Building2 className="h-4 w-4" />
                  Property Owner
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  Traveller
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </Card>
  );
}
