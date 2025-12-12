"use client";

import {
  User,
  Mail,
  Building2,
  Lock,
  Bell,
  AlertCircle,
  Trash2,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { socket } from "@/lib/socket";

import { useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";


interface SettingsTabProps {
  user: {
    email: string;
    role: string;
  };
  isOwner: boolean;
}


export function SettingsTab({ user, isOwner }: SettingsTabProps) {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser); // reset user
  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you absolutely sure you want to delete your account? This action cannot be undone."
      )
    ) {
      toast.error("Account deletion requested");
    }
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      // 👇 Clear local storage token
      localStorage.removeItem("token");

      // 👇 Clear Zustand user
      setUser(null);

      // 👇 Disconnect socket (recommended)
      try {
        socket.disconnect();
      } catch {}

      toast.success("Logged out successfully");

      // 👇 Redirect after short delay
      setTimeout(() => {
        router.push("/login");
      }, 300);
    }
  };

  return (
    <TabsContent value="settings">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 sm:p-8 lg:p-10 shadow-lg border-0">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Account Settings
            </h2>
            <p className="text-gray-600">
              Manage your account preferences and security
            </p>
          </div>

          <div className="space-y-8">
            {/* Account Information */}
            <Section
              icon={User}
              title="Account Information"
              description="Your basic account details"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={Mail}
                  label="Email"
                  value={user.email}
                  sublabel="Email cannot be changed"
                />
                <InfoCard
                  icon={isOwner ? Building2 : User}
                  label="Account Type"
                  value={isOwner ? "Property Owner" : "Traveller"}
                />
              </div>
            </Section>

            {/* Security */}
            <Section
              icon={Lock}
              title="Security"
              description="Manage your password and security settings"
            >
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Password
                </label>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-11 border-2 hover:bg-gray-50"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
                <p className="mt-2 text-xs text-gray-500">
                  Last changed: Never
                </p>
              </div>
            </Section>

            {/* Notifications */}
            <Section
              icon={Bell}
              title="Notifications"
              description="Configure how you receive updates"
            >
              <div className="space-y-4">
                <NotificationToggle
                  label={
                    isOwner
                      ? "Email notifications for new reservations"
                      : "Email notifications for bookings"
                  }
                  description={`Receive updates about your ${
                    isOwner ? "property bookings" : "reservations"
                  }`}
                  defaultChecked={true}
                />
                <NotificationToggle
                  label="Promotional emails"
                  description="Stay updated with special offers and new features"
                  defaultChecked={true}
                />
                <NotificationToggle
                  label="SMS notifications"
                  description="Get important updates via text message"
                  defaultChecked={false}
                />
                <NotificationToggle
                  label="Push notifications"
                  description="Receive real-time alerts on your device"
                  defaultChecked={true}
                />
              </div>
            </Section>

            {/* Logout Section */}
            <Section
              icon={LogOut}
              title="Session"
              description="Manage your current session"
            >
              <div className="rounded-xl bg-gray-50 border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                      <LogOut className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Log Out
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Sign out of your account on this device. You can always log back in anytime.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto h-11 border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </Button>
                  </div>
                </div>
              </div>
            </Section>

            {/* Danger Zone */}
            <Section
              icon={AlertCircle}
              title="Danger Zone"
              description="Irreversible and destructive actions"
              variant="danger"
            >
              <div className="rounded-xl bg-red-50 border-2 border-red-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-red-900 mb-2">
                      Delete Account
                    </h4>
                    <p className="text-sm text-red-800 mb-4">
                      Once you delete your account, there is no going back.
                      Please be certain. All your data, properties, and bookings
                      will be permanently removed.
                    </p>
                    <Button
                      variant="destructive"
                      className="w-full sm:w-auto h-11 bg-red-600 hover:bg-red-700"
                      onClick={handleDeleteAccount}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete My Account
                    </Button>
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </Card>
      </motion.div>
    </TabsContent>
  );
}

// Section Component
function Section({
  icon: Icon,
  title,
  description,
  children,
  variant = "default",
}: {
  icon: any;
  title: string;
  description: string;
  children: React.ReactNode;
  variant?: "default" | "danger";
}) {
  return (
    <div className="space-y-4 pt-6 first:pt-0 border-t first:border-t-0 border-gray-200">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            variant === "danger"
              ? "bg-red-100"
              : "bg-gradient-to-br from-sky-100 to-blue-100"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${
              variant === "danger" ? "text-red-600" : "text-sky-600"
            }`}
          />
        </div>
        <div className="flex-1">
          <h3
            className={`text-lg font-semibold mb-1 ${
              variant === "danger" ? "text-red-600" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <div className="pl-13">{children}</div>
    </div>
  );
}

// Info Card Component
function InfoCard({
  icon: Icon,
  label,
  value,
  sublabel,
}: {
  icon: any;
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
        <Icon className="h-5 w-5 text-gray-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
          {sublabel && (
            <p className="text-xs text-gray-500 mt-0.5">{sublabel}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Notification Toggle Component
function NotificationToggle({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-lg hover:bg-gray-50 transition-colors">
      <input
        type="checkbox"
        className="mt-1 h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500 focus:ring-offset-2 cursor-pointer"
        defaultChecked={defaultChecked}
      />
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 block">
          {label}
        </span>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
    </label>
  );
}
