"use client";

import { ReactNode } from "react";
import { User, Calendar, Building2, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOwner: boolean;
  children: ReactNode;
}

export function ProfileTabs({
  activeTab,
  setActiveTab,
  isOwner,
  children,
}: ProfileTabsProps) {
  const tabs = [
    {
      value: "profile",
      label: "Profile",
      icon: User,
      show: true,
    },
    {
      value: "properties",
      label: "Properties",
      mobileLabel: "Properties",
      icon: Building2,
      show: isOwner,
    },
    {
      value: "bookings",
      label: isOwner ? "Reservations" : "Bookings",
      mobileLabel: "Bookings",
      icon: Calendar,
      show: true,
    },
    {
      value: "settings",
      label: "Settings",
      icon: Settings,
      show: true,
    },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      {/* Tabs List */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <TabsList className="inline-flex w-full min-w-max sm:min-w-0 h-auto p-1 bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200/50">
          {tabs.map(
            (tab, index) =>
              tab.show && (
                <motion.div
                  key={tab.value}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TabsTrigger
                    value={tab.value}
                    className="flex items-center gap-2 px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">
                      {tab.mobileLabel || tab.label}
                    </span>
                  </TabsTrigger>
                </motion.div>
              )
          )}
        </TabsList>
      </div>

      {/* Tab Content */}
      {children}
    </Tabs>
  );
}
