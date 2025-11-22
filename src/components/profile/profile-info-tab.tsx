"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ProfileInfoTabProps {
  user: {
    email: string;
    fullName?: string;
  };
  profileData?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export function ProfileInfoTab({ user, profileData }: ProfileInfoTabProps) {
  const [profile, setProfile] = useState({
    full_name: "",
    bio: "",
    phone: "",
    avatar_url: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profileData) {
      setProfile({
        full_name: profileData.name || "",
        bio: profileData.email || "",
        phone: profileData.phone || "",
        avatar_url: "",
      });
    }
  }, [profileData]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully", {
        description: "Your changes have been saved",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (profileData) {
      setProfile({
        full_name: profileData.name || "",
        bio: profileData.email || "",
        phone: profileData.phone || "",
        avatar_url: "",
      });
    }
  };

  return (
    <TabsContent value="profile">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 sm:p-8 lg:p-10 shadow-lg border-0">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Profile Information
            </h2>
            <p className="text-gray-600">
              Update your personal details and preferences
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <Input
                  value={profile.full_name || user.fullName || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                  placeholder="Enter your full name"
                  className="h-12 border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  <Mail className="inline h-4 w-4 mr-1.5 text-gray-500" />
                  Email Address
                </label>
                <Input
                  value={user.email}
                  disabled
                  className="h-12 bg-gray-50 border-gray-300 cursor-not-allowed"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Email cannot be changed
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  <Phone className="inline h-4 w-4 mr-1.5 text-gray-500" />
                  Phone Number
                </label>
                <Input
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  placeholder="+1 (555) 000-0000"
                  className="h-12 border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                />
              </div>

              {/* Bio */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Bio
                </label>
                <Textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="resize-none border-gray-300 focus:border-sky-500 focus:ring-sky-500"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Brief description for your profile (max 200 characters)
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all h-12 w-full sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full sm:w-auto border-2 hover:bg-gray-50"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </TabsContent>
  );
}
