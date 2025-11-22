"use client";

import { Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { motion } from "framer-motion";

export function TravellerBookings() {
  const { data: travellerBookingsData, isLoading: travellerBookingsLoading } =
    trpc.booking.getTravellerBookings.useQuery({}, { enabled: true });

  return (
    <Card className="p-6 sm:p-8 lg:p-10 shadow-lg border-0">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          My Bookings
        </h2>
        <p className="text-gray-600">
          View and manage all your property reservations
        </p>
      </div>

      {travellerBookingsLoading ? (
        <div className="py-16 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-sky-600" />
          <p className="mt-4 text-gray-600 font-medium">Loading bookings...</p>
        </div>
      ) : travellerBookingsData &&
        travellerBookingsData.items &&
        travellerBookingsData.items.length > 0 ? (
        <div className="space-y-4">
          {travellerBookingsData.items.map((booking: any, index: number) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group overflow-hidden rounded-xl border-2 border-gray-100 bg-white hover:border-sky-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row gap-4 p-5">
                {/* Booking Image */}
                <div className="relative h-40 w-full sm:w-56 flex-shrink-0 rounded-lg overflow-hidden">
                  {booking.propertyCoverFileUrl ? (
                    <Image
                      src={booking.propertyCoverFileUrl}
                      alt={booking.propertyName}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <Calendar className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={booking.bookingStatus} />
                  </div>
                </div>

                {/* Booking Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
                          {booking.propertyName || "Property"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {format(new Date(booking.startDate), "PPP")} —{" "}
                          {format(new Date(booking.endDate), "PPP")}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Booking Status
                        </p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {booking.bookingStatus}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Payment Status
                        </p>
                        <p className="font-semibold text-gray-900 capitalize">
                          {booking.paymentStatus || "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Price</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                        ₹{booking.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {booking.ownerApprovalStatus === "approved" &&
                        booking.paymentStatus === "awaiting" && (
                          <Link
                            href={`/booking/payment?id=${booking.bookingId}`}
                            className="flex-1 sm:flex-none"
                          >
                            <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg h-10">
                              Pay ₹
                              {booking.serviceCharge?.toFixed
                                ? booking.serviceCharge.toFixed(2)
                                : booking.serviceCharge}
                            </Button>
                          </Link>
                        )}

                      <Link
                        href={`/properties/${booking.propertyId}`}
                        className="flex-1 sm:flex-none"
                      >
                        <Button
                          variant="outline"
                          className="w-full h-10 border-2 hover:bg-sky-50 hover:border-sky-300"
                        >
                          View Property
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-gray-900">
            No bookings yet
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Start exploring amazing properties to book your first stay
          </p>
          <Link href="/properties">
            <Button className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg h-12">
              Explore Properties
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    pending: {
      bg: "bg-yellow-500",
      text: "text-white",
      label: "Pending",
    },
    confirmed: {
      bg: "bg-green-500",
      text: "text-white",
      label: "Confirmed",
    },
    cancelled: {
      bg: "bg-red-500",
      text: "text-white",
      label: "Cancelled",
    },
    completed: {
      bg: "bg-blue-500",
      text: "text-white",
      label: "Completed",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
