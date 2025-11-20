'use client';

export const dynamicParams = false;
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Download,
  Mail,
  MapPin,
  Calendar,
  Users,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
// import { supabase, Property } from '@/lib/supabase';
import { format } from 'date-fns';
import Link from 'next/link';
import { Property } from '@/lib/type';

import { Suspense } from 'react';

function BookingConfirmContent() {
  return (
    <BookingConfirmPageContent />
  );
}

function BookingConfirmPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmationCode, setConfirmationCode] = useState('');

  const propertyId = searchParams?.get('propertyId');
  const checkIn = searchParams?.get('checkIn');
  const checkOut = searchParams?.get('checkOut');
  const guests = searchParams?.get('guests');
  const total = searchParams?.get('total');

  useEffect(() => {
    async function fetchProperty() {
      if (!propertyId) {
        router.push('/');
        return;
      }

      // const { data, error } = await supabase
      //   .from('properties')
      //   .select('*')
      //   .eq('id', propertyId)
      //   .maybeSingle();

      // if (!error && data) {
      //   setProperty(data);

      //   const code = `SH${Date.now().toString(36).toUpperCase()}`;
      //   setConfirmationCode(code);
      // }
      setLoading(false);
    }

    fetchProperty();
  }, [propertyId, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />
      </div>
    );
  }

  if (!property || !checkIn || !checkOut) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Invalid booking</h2>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-3xl"
        >
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
            >
              <CheckCircle className="h-12 w-12 text-green-600" />
            </motion.div>
            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Your reservation has been successfully processed
            </p>
          </div>

          <Card className="mb-6 p-8">
            <div className="mb-6">
              <h2 className="mb-2 text-sm font-medium text-gray-600">
                Confirmation Number
              </h2>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-center text-2xl font-bold tracking-wider text-gray-900">
                  {confirmationCode}
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Booking Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Home className="mt-1 h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{property.placeName}</p>
                    <p className="text-sm text-gray-600">{property.area}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-600">{property.area}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="mt-1 h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Dates</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(checkIn), 'MMMM dd, yyyy')} -{' '}
                      {format(new Date(checkOut), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="mt-1 h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Guests</p>
                    <p className="text-sm text-gray-600">{guests} guests</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Payment Summary
              </h2>
              <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="text-2xl font-bold text-sky-600">${total}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Payment processed successfully
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Email Receipt
              </Button>
            </div>
          </Card>

          <Card className="mb-6 bg-sky-50 p-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              What's Next?
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>✓ You'll receive a confirmation email shortly</p>
              <p>✓ The host will contact you within 24 hours</p>
              <p>✓ Check-in details will be sent 3 days before arrival</p>
              <p>✓ Don't forget to review the house rules</p>
            </div>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
            <Link href="/profile" className="flex-1">
              <Button className="w-full bg-sky-600 hover:bg-sky-700">
                View My Bookings
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Need help? Contact us at support@stayhaven.com</p>
            <p className="mt-1">or call +1 (555) 123-4567</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function BookingConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingConfirmContent />
    </Suspense>
  );
}
