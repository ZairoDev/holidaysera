"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

export default function ProfilePage() {
  const { user } = useUserStore();
  const [profile, setProfile] = useState({
    full_name: "",
    bio: "",
    phone: "",
    avatar_url: "",
  });
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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
      refetchProperties();
    },
  });

  useEffect(() => {
    if (user) {
      // fetchProfile();
      // fetchBookings();
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      // Update profile logic here
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      await deletePropertyMutation.mutateAsync({ propertyId });
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Please log in</h2>
          <p className="text-gray-600">
            You need to be logged in to view your profile
          </p>
        </div>
      </div>
    );
  }

  const isOwner = user.role === "owner";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl"
        >
          <Card className="mb-8 p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback className="bg-sky-100 text-2xl text-sky-600">
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
                <button className="absolute bottom-0 right-0 rounded-full bg-sky-600 p-2 text-white shadow-lg hover:bg-sky-700">
                  <Upload className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  {profile.full_name || user.fullName || "User"}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
                  {isOwner ? (
                    <Building2 className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  {isOwner ? "Property Owner" : "Traveller"}
                </div>
              </div>
            </div>
          </Card>

          <Tabs
            defaultValue={isOwner ? "properties" : "profile"}
            className="space-y-6"
          >
            <TabsList
              className={`grid w-full ${
                isOwner ? "grid-cols-4" : "grid-cols-3"
              }`}
            >
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              {isOwner ? (
                <TabsTrigger value="properties">
                  <Building2 className="mr-2 h-4 w-4" />
                  My Properties
                </TabsTrigger>
              ) : (
                <TabsTrigger value="bookings">
                  <Calendar className="mr-2 h-4 w-4" />
                  My Bookings
                </TabsTrigger>
              )}
              {isOwner && (
                <TabsTrigger value="bookings">
                  <Calendar className="mr-2 h-4 w-4" />
                  Reservations
                </TabsTrigger>
              )}
              <TabsTrigger value="settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="p-6">
                <h2 className="mb-6 text-2xl font-semibold">
                  Profile Information
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <Input
                      value={profile.full_name || user.fullName}
                      onChange={(e) =>
                        setProfile({ ...profile, full_name: e.target.value })
                      }
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <Input
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
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
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-sky-600 hover:bg-sky-700"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Card>
            </TabsContent>

            {/* Owner Properties Tab */}
            {isOwner && (
              <TabsContent value="properties">
                <Card className="p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">My Properties</h2>
                    <Link href="/add-listing/1">
                      <Button className="bg-sky-600 hover:bg-sky-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Property
                      </Button>
                    </Link>
                  </div>

                  {propertiesLoading ? (
                    <div className="py-12 text-center">
                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-sky-600"></div>
                      <p className="mt-4 text-gray-600">
                        Loading properties...
                      </p>
                    </div>
                  ) : ownerProperties && ownerProperties.length > 0 ? (
                    <div className="space-y-4">
                      {ownerProperties.map((property: any) => (
                        <motion.div
                          key={property._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-4 rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-lg">
                            {property.propertyCoverFileUrl ? (
                              <Image
                                src={property.propertyCoverFileUrl}
                                alt={property.propertyName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                                <Building2 className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                            {!property.isLive && (
                              <div className="absolute top-2 left-2 rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
                                Unlisted
                              </div>
                            )}
                          </div>

                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="mb-1 flex items-start justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {property.propertyName || "Untitled Property"}
                                </h3>
                                <span className="rounded bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700">
                                  {property.VSID}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>
                                  {property.city}, {property.country}
                                </span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                                <span>{property.guests} guests</span>
                                <span>•</span>
                                <span>{property.bedrooms} bedrooms</span>
                                <span>•</span>
                                <span>{property.beds} beds</span>
                                <span>•</span>
                                <span>{property.bathroom} baths</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-2xl font-bold text-sky-600">
                                  {property.currency} {property.basePrice}
                                  <span className="text-sm font-normal text-gray-600">
                                    /night
                                  </span>
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Link
                                  href={`/listing-stay-detail/${property._id}`}
                                >
                                  <Button variant="outline" size="sm">
                                    <Eye className="mr-1 h-4 w-4" />
                                    View
                                  </Button>
                                </Link>
                                <Link
                                  href={`/add-listing/1?edit=${property._id}`}
                                >
                                  <Button variant="outline" size="sm">
                                    <Edit className="mr-1 h-4 w-4" />
                                    Edit
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteProperty(property._id)
                                  }
                                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <Building2 className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">
                        No properties yet
                      </h3>
                      <p className="mb-6 text-gray-600">
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
              <Card className="p-6">
                <h2 className="mb-6 text-2xl font-semibold">
                  {isOwner ? "Reservations" : "My Bookings"}
                </h2>
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex gap-4 rounded-lg border p-4"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {booking.properties.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {format(new Date(booking.check_in), "MMM dd")} -{" "}
                            {format(
                              new Date(booking.check_out),
                              "MMM dd, yyyy"
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.guests} guests
                          </p>
                          <div className="mt-2">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-sky-600">
                            ${booking.total_price}
                          </p>
                          <p className="text-xs text-gray-600">
                            {booking.confirmation_code}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      {isOwner ? "No reservations yet" : "No bookings yet"}
                    </h3>
                    <p className="text-gray-600">
                      {isOwner
                        ? "Your property reservations will appear here"
                        : "Start exploring amazing properties to book your first stay"}
                    </p>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="p-6">
                <h2 className="mb-6 text-2xl font-semibold">
                  Account Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">{user.email}</p>
                  </div>

                  <div>
                    <h3 className="mb-3 font-medium text-gray-900">
                      Account Type
                    </h3>
                    <p className="text-gray-600">
                      {isOwner ? "Property Owner Account" : "Traveller Account"}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-3 font-medium text-gray-900">Password</h3>
                    <Button variant="outline">Change Password</Button>
                  </div>

                  <div>
                    <h3 className="mb-3 font-medium text-gray-900">
                      Notifications
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded"
                          defaultChecked
                        />
                        <span className="text-sm text-gray-700">
                          {isOwner
                            ? "Email notifications for new reservations"
                            : "Email notifications for bookings"}
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded"
                          defaultChecked
                        />
                        <span className="text-sm text-gray-700">
                          Promotional emails
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="mb-3 font-medium text-red-600">
                      Danger Zone
                    </h3>
                    <Button variant="destructive">Delete Account</Button>
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
