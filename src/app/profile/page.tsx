'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Heart, Settings, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { supabase, Booking } from '@/lib/supabase';
import { useUserStore } from '@/lib/store';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user } = useUserStore();
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    phone: '',
    avatar_url: '',
  });
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      // fetchProfile();
      // fetchBookings();
    }
  }, [user]);

  // const fetchProfile = async () => {
  //   if (!user) return;

  //   const { data } = await supabase
  //     .from('user_profiles')
  //     .select('*')
  //     .eq('id', user.id)
  //     .maybeSingle();

  //   if (data) {
  //     setProfile(data);
  //   }
  // };

  // const fetchBookings = async () => {
  //   if (!user) return;

  //   const { data } = await supabase
  //     .from('bookings')
  //     .select('*, properties(*)')
  //     .eq('user_id', user.id)
  //     .order('created_at', { ascending: false });

  //   if (data) {
  //     setBookings(data);
  //   }
  // };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      // const { error } = await supabase
      //   .from('user_profiles')
      //   .upsert({
      //     id: user.id,
      //     ...profile,
      //     updated_at: new Date().toISOString(),
      //   });

      // if (!error) {
      //   alert('Profile updated successfully!');
      // }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Please log in</h2>
          <p className="text-gray-600">You need to be logged in to view your profile</p>
        </div>
      </div>
    );
  }

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
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                      : 'U'}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 rounded-full bg-sky-600 p-2 text-white shadow-lg hover:bg-sky-700">
                  <Upload className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  {profile.full_name || 'User'}
                </h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
          </Card>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="bookings">
                <Calendar className="mr-2 h-4 w-4" />
                My Bookings
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="p-6">
                <h2 className="mb-6 text-2xl font-semibold">Profile Information</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <Input
                      value={profile.full_name}
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
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card className="p-6">
                <h2 className="mb-6 text-2xl font-semibold">My Bookings</h2>
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
                            {format(new Date(booking.check_in), 'MMM dd')} -{' '}
                            {format(new Date(booking.check_out), 'MMM dd, yyyy')}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.guests} guests
                          </p>
                          <div className="mt-2">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                booking.status === 'confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : booking.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
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
                      No bookings yet
                    </h3>
                    <p className="text-gray-600">
                      Start exploring amazing properties to book your first stay
                    </p>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="p-6">
                <h2 className="mb-6 text-2xl font-semibold">Account Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-3 font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600">{user.email}</p>
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
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm text-gray-700">
                          Email notifications for bookings
                        </span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm text-gray-700">
                          Promotional emails
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="mb-3 font-medium text-red-600">Danger Zone</h3>
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
