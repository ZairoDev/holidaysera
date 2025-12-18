"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store";
import Link from "next/link";
import { trpc } from "@/trpc/client";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileTabs } from "@/components/profile/profile-tab";
import { ProfileInfoTab } from "@/components/profile/profile-info-tab";
import { PropertiesTab } from "@/components/profile/properties-tab";
import { BookingsTab } from "@/components/profile/booking-tab";
import { SettingsTab } from "@/components/profile/settings-tab";
import { SubscriptionCard } from "@/components/profile/subscription-card";

// Import components


export default function ProfilePage() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<string>("");

  // Fetch user profile details
  const { data: profileData } = trpc.user.getuserDetails.useQuery();

  // Set initial tab based on user role
  useEffect(() => {
    if (user) {
      setActiveTab(user.role === "owner" ? "properties" : "profile");
    }
  }, [user]);

  // Handle not logged in state
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-sky-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-blue-100 shadow-lg">
            <User className="h-12 w-12 text-sky-600" />
          </div>
          <h2 className="mb-3 text-3xl font-bold text-gray-900">
            Please log in
          </h2>
          <p className="mb-8 text-gray-600 max-w-md">
            You need to be logged in to view your profile and manage your
            account
          </p>
          <Link href="/login">
            <Button
              size="lg"
              className="bg-sky-600 hover:bg-sky-700 shadow-md hover:shadow-lg transition-all"
            >
              Go to Login
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const isOwner = user.role === "owner";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-sky-50/50 py-6 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-7xl"
        >
          {/* Profile Header */}
          <ProfileHeader user={user} profileData={profileData} />

          {/* Subscription Card - Only show for property owners */}
          {isOwner && (
            <SubscriptionCard 
              subscription={profileData?.subscription || { status: "none" }} 
            />
          )}

          {/* Tabs Section */}
          <ProfileTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOwner={isOwner}
          >
            <ProfileInfoTab user={user} profileData={profileData} />
            <PropertiesTab isOwner={isOwner} />
            <BookingsTab isOwner={isOwner} />
            <SettingsTab user={user} isOwner={isOwner} />
          </ProfileTabs>
        </motion.div>
      </div>
    </div>
  );
}
