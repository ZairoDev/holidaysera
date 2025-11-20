"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Calendar,
  Heart,
  Settings,
  Upload,
  Building2,
  Plus,
  Edit,
  Eye,
  Trash2,
  MapPin,
  LogOut,
  Bell,
  Lock,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/lib/store";
import { format } from "date-fns";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import OwnerDashboard from "./owner-dashboard";

export default function ProfilePage() {
  const { user } = useUserStore();
  const [profile, setProfile] = useState({
    full_name: "",
    bio: "",
    phone: "",
    avatar_url: "",
  });
  const [bookings, setBookings] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

  // Fetch owner properties if user is an owner
  const {
    data: ownerProperties,
    isLoading: propertiesLoading,
    refetch: refetchProperties,
  } = trpc.property.getOwnerProperties.useQuery(undefined, {
    enabled: user?.role === "owner",
  });

  const deletePropertyMutation = trpc.property.deleteProperty.useMutation({
    onSuccess: () => {
      toast.success("Property deleted successfully");
      refetchProperties();
    },
    onError: (error) => {
      toast.error("Failed to delete property");
      console.error(error);
    },
  });

  const fetchProfile = trpc.user.getuserDetails.useQuery();

  useEffect(() => {
    if (fetchProfile.data) {
      setProfile({
        full_name: fetchProfile.data.name || "",
        bio: fetchProfile.data.email || "",
        phone: fetchProfile.data.phone || "",
        avatar_url: "",
      });
    }
  }, [fetchProfile.data]);

  // Set initial tab based on user role
  useEffect(() => {
    if (user) {
      setActiveTab(user.role === "owner" ? "properties" : "profile");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      // Simulate save - replace with actual mutation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this property? This action cannot be undone."
      )
    )
      return;

    try {
      await deletePropertyMutation.mutateAsync({ propertyId });
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-sky-100">
            <User className="h-10 w-10 text-sky-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Please log in
          </h2>
          <p className="mb-6 text-gray-600">
            You need to be logged in to view your profile
          </p>
          <Link href="/login">
            <Button className="bg-sky-600 hover:bg-sky-700">Go to Login</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const isOwner = user.role === "owner";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-6xl"
        >
          {/* Profile Header Card */}
          <Card className="mb-6 sm:mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 h-24 sm:h-32" />
            <div className="px-4 sm:px-8 pb-6 sm:pb-8">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:gap-6 -mt-12 sm:-mt-16">
                <div className="relative">
                  <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-xl">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="bg-gradient-to-br from-sky-400 to-blue-500 text-2xl sm:text-4xl text-white font-semibold">
                      {profile.full_name
                        ? profile.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : user.fullName
                        ? user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 rounded-full bg-sky-600 p-2 text-white shadow-lg hover:bg-sky-700 transition-colors">
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
                <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0">
                  <h1 className="mb-1 sm:mb-2 text-2xl sm:text-3xl font-bold text-gray-900">
                    {profile.full_name || user.fullName || "User"}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">
                    {user.email}
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-100 to-blue-100 px-3 py-1.5 text-xs sm:text-sm font-medium text-sky-700">
                    {isOwner ? (
                      <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <User className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                    {isOwner ? "Property Owner" : "Traveller"}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs Section */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <div className="overflow-x-auto pb-2">
              <TabsList
                className={`inline-flex w-full min-w-max sm:min-w-0 ${
                  isOwner ? "grid-cols-4" : "grid-cols-3"
                } bg-white shadow-sm`}
              >
                <TabsTrigger
                  value="profile"
                  className="flex items-center gap-2 text-xs sm:text-sm"
                >
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Profile</span>
                  <span className="sm:hidden">Profile</span>
                </TabsTrigger>
                {isOwner ? (
                  <TabsTrigger
                    value="properties"
                    className="flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">My Properties</span>
                    <span className="sm:hidden">Properties</span>
                  </TabsTrigger>
                ) : (
                  <TabsTrigger
                    value="bookings"
                    className="flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">My Bookings</span>
                    <span className="sm:hidden">Bookings</span>
                  </TabsTrigger>
                )}
                {isOwner && (
                  <TabsTrigger
                    value="bookings"
                    className="flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Reservations</span>
                    <span className="sm:hidden">Bookings</span>
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-2 text-xs sm:text-sm"
                >
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Settings</span>
                  <span className="sm:hidden">Settings</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="p-4 sm:p-6 lg:p-8">
                <h2 className="mb-6 text-xl sm:text-2xl font-semibold">
                  Profile Information
                </h2>
                <form
                  onSubmit={handleUpdateProfile}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <Input
                        value={profile.full_name || user.fullName || ""}
                        onChange={(e) =>
                          setProfile({ ...profile, full_name: e.target.value })
                        }
                        placeholder="Your full name"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        <Mail className="inline h-4 w-4 mr-1" />
                        Email Address
                      </label>
                      <Input
                        value={user.email}
                        disabled
                        className="w-full bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        <Phone className="inline h-4 w-4 mr-1" />
                        Phone Number
                      </label>
                      <Input
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                        placeholder="+1 (555) 000-0000"
                        className="w-full"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <Textarea
                        value={profile.bio}
                        onChange={(e) =>
                          setProfile({ ...profile, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="w-full resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-sky-600 hover:bg-sky-700 w-full sm:w-auto"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        if (fetchProfile.data) {
                          setProfile({
                            full_name: fetchProfile.data.name || "",
                            bio: fetchProfile.data.email || "",
                            phone: fetchProfile.data.phone || "",
                            avatar_url: "",
                          });
                        }
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </Card>
            </TabsContent>

            {/* Owner Properties Tab */}
            {isOwner && (
              <TabsContent value="properties">
                <Card className="p-4 sm:p-6 lg:p-8">
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl sm:text-2xl font-semibold">
                      My Properties
                    </h2>
                    <Link href="/add-listing/1" className="w-full sm:w-auto">
                      <Button className="bg-sky-600 hover:bg-sky-700 w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Property
                      </Button>
                    </Link>
                  </div>

                  {propertiesLoading ? (
                    <div className="py-12 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-sky-600" />
                      <p className="mt-4 text-gray-600">
                        Loading properties...
                      </p>
                    </div>
                  ) : ownerProperties && ownerProperties.length > 0 ? (
                    <div className="space-y-4">
                      {ownerProperties.map((property: any) => (
                        <motion.div
                          key={property._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col sm:flex-row gap-4 rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {/* Property Image */}
                          <div className="relative h-48 sm:h-32 w-full sm:w-48 flex-shrink-0 overflow-hidden rounded-lg">
                            {property.propertyCoverFileUrl ? (
                              <Image
                                src={property.propertyCoverFileUrl}
                                alt={property.propertyName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <Building2 className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                            {!property.isLive && (
                              <div className="absolute top-2 left-2 rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white shadow-lg">
                                Unlisted
                              </div>
                            )}
                          </div>

                          {/* Property Details */}
                          <div className="flex flex-1 flex-col justify-between gap-3">
                            <div>
                              <div className="mb-2 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                  {property.propertyName || "Untitled Property"}
                                </h3>
                                <span className="inline-flex items-center rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700 w-fit">
                                  {property.VSID}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                <span className="line-clamp-1">
                                  {property.city}, {property.country}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600">
                                <span className="inline-flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {property.guests} guests
                                </span>
                                <span className="text-gray-300">•</span>
                                <span>{property.bedrooms} bedrooms</span>
                                <span className="text-gray-300">•</span>
                                <span>{property.beds} beds</span>
                                <span className="text-gray-300">•</span>
                                <span>{property.bathroom} baths</span>
                              </div>
                            </div>

                            {/* Price and Actions */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t">
                              <div>
                                <p className="text-xl sm:text-2xl font-bold text-sky-600">
                                  {property.currency} {property.basePrice}
                                  <span className="text-sm font-normal text-gray-600">
                                    /night
                                  </span>
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                <Link
                                  href={`/properties/${property._id}`}
                                  className="flex-1 sm:flex-none"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                  >
                                    <Eye className="mr-1 h-4 w-4" />
                                    <span className="hidden sm:inline">
                                      View
                                    </span>
                                  </Button>
                                </Link>
                                <Link
                                  href={`/add-listing/1?edit=${property._id}`}
                                  className="flex-1 sm:flex-none"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                  >
                                    <Edit className="mr-1 h-4 w-4" />
                                    <span className="hidden sm:inline">
                                      Edit
                                    </span>
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteProperty(property._id)
                                  }
                                  className="text-red-600 hover:bg-red-50 hover:text-red-700 flex-1 sm:flex-none"
                                >
                                  {deletePropertyMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                        <Building2 className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">
                        No properties yet
                      </h3>
                      <p className="mb-6 text-gray-600 max-w-md mx-auto">
                        Start listing your properties to reach travelers
                        worldwide
                      </p>
                      <Link href="/add-listing/1">
                        <Button className="bg-sky-600 hover:bg-sky-700">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Property
                        </Button>
                      </Link>
                    </div>
                  )}
                </Card>
              </TabsContent>
            )}

            {/* Bookings/Reservations Tab */}
            <TabsContent value="bookings">
              {isOwner ? (
                <OwnerDashboard />
              ) : (
                <Card className="p-4 sm:p-6 lg:p-8">
                  <h2 className="mb-6 text-xl sm:text-2xl font-semibold">My Bookings</h2>
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                      <Calendar className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">No bookings yet</h3>
                    <p className="text-gray-600 max-w-md mx-auto">Start exploring amazing properties to book your first stay</p>
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card className="p-4 sm:p-6 lg:p-8">
                <h2 className="mb-6 text-xl sm:text-2xl font-semibold">
                  Account Settings
                </h2>
                <div className="space-y-6 sm:space-y-8">
                  {/* Account Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account Information
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-900">{user.email}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Account Type
                        </label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          {isOwner ? (
                            <Building2 className="h-4 w-4 text-gray-400" />
                          ) : (
                            <User className="h-4 w-4 text-gray-400" />
                          )}
                          <p className="text-sm text-gray-900">
                            {isOwner ? "Property Owner" : "Traveller"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      Security
                    </h3>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Password
                      </label>
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="space-y-4 pt-6 border-t">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Notifications
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="mt-1 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                          defaultChecked
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                            {isOwner
                              ? "Email notifications for new reservations"
                              : "Email notifications for bookings"}
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Receive updates about your{" "}
                            {isOwner ? "property bookings" : "reservations"}
                          </p>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="mt-1 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                          defaultChecked
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                            Promotional emails
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Stay updated with special offers and new features
                          </p>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="mt-1 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                            SMS notifications
                          </span>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Get important updates via text message
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="space-y-4 pt-6 border-t border-red-200">
                    <h3 className="text-lg font-medium text-red-600 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Danger Zone
                    </h3>
                    <div className="rounded-lg bg-red-50 p-4">
                      <p className="text-sm text-red-800 mb-3">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                      <Button
                        variant="destructive"
                        className="w-full sm:w-auto"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you absolutely sure you want to delete your account? This action cannot be undone."
                            )
                          ) {
                            // Handle account deletion
                            toast.error("Account deletion requested");
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
