"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/trpc/client";
import { useSocket } from "@/hooks/useSocket";
import { useUserStore } from "@/lib/store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PendingBooking {
  _id: string;
  propertyId: string;
  propertyName: string;
  travellerId: string;
  travelerEmail: string;
  startDate: string;
  endDate: string;
  guests: number;
  price: number;
  serviceCharge: number;
  bookingStatus: string;
}

interface BookingRequestEvent {
  bookingId: string;
  propertyId: string;
  propertyName: string;
  travellerId: string;
  travelerName: string;
  startDate: string;
  endDate: string;
  guests: number;
  price: number;
  serviceCharge: number;
  timestamp: Date;
}

export default function OwnerDashboard() {
  const { user: authUser } = useUserStore();
  const userId = authUser?.id;
  const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<PendingBooking | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [rejectReason, setRejectReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { socket, isConnected } = useSocket(userId || undefined, "owner");

  const { data: bookings, refetch } =
    trpc.booking.getOwnerPendingBookings.useQuery(undefined, {
      enabled: !!userId,
    });

  useEffect(() => {
    if (bookings) {
      setPendingBookings(bookings);
    }
  }, [bookings]);

  useEffect(() => {
    if (!socket) return;

    const handleNewBooking = (data: BookingRequestEvent) => {
      setPendingBookings((prev) => [
        {
          _id: data.bookingId,
          propertyId: data.propertyId,
          propertyName: data.propertyName,
          travellerId: data.travellerId,
          travelerEmail: data.travelerName,
          startDate: data.startDate,
          endDate: data.endDate,
          guests: data.guests,
          price: data.price,
          serviceCharge: data.serviceCharge,
          bookingStatus: "pending",
        },
        ...prev,
      ]);

      toast.success("New Booking Request!", {
        description: `${data.propertyName} from ${data.travelerName}`,
        duration: 5000,
      });
    };

    socket.on("booking-request-received", handleNewBooking);
    return () => {
      socket.off("booking-request-received", handleNewBooking);
    };
  }, [socket]);

  const approveMutation = trpc.booking.approveBookingRequest.useMutation();
  const rejectMutation = trpc.booking.rejectBookingRequest.useMutation();

  const handleApprove = async () => {
    if (!selectedBooking) return;
    setIsLoading(true);

    try {
      await approveMutation.mutateAsync({ bookingId: selectedBooking._id });
      setPendingBookings((prev) =>
        prev.filter((b) => b._id !== selectedBooking._id)
      );
      setDialogOpen(false);
      setSelectedBooking(null);
      toast.success("Booking Approved!", {
        description: `${selectedBooking.propertyName} booking approved`,
      });
    } catch (error) {
      console.error("Error approving booking:", error);
      toast.error("Failed to approve booking");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedBooking) return;
    setIsLoading(true);

    try {
      await rejectMutation.mutateAsync({
        bookingId: selectedBooking._id,
        reason: rejectReason,
      });
      setPendingBookings((prev) =>
        prev.filter((b) => b._id !== selectedBooking._id)
      );
      setDialogOpen(false);
      setSelectedBooking(null);
      setRejectReason("");
      toast.error("Booking Rejected", {
        description: `${selectedBooking.propertyName} booking rejected`,
      });
    } catch (error) {
      console.error("Error rejecting booking:", error);
      toast.error("Failed to reject booking");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-sky-600" />
        <p className="mt-4 text-gray-600">Loading reservations...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Booking Requests
            </h1>
            <p className="text-gray-600 mt-1">
              Manage incoming reservation requests
            </p>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              isConnected
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              } animate-pulse`}
            />
            <span className="text-sm font-medium">
              {isConnected ? "Live" : "Connecting..."}
            </span>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {pendingBookings.length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
            <Calendar className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No pending requests
          </h3>
          <p className="text-gray-600">New booking requests will appear here</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {pendingBookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden border-2 border-gray-100 hover:border-sky-200 hover:shadow-lg transition-all">
                  <div className="p-6">
                    {/* Property Name Header */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {booking.propertyName}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Booking Request
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                      <DetailItem
                        icon={Users}
                        label="Guest"
                        value={booking.travelerEmail}
                      />
                      <DetailItem
                        icon={Calendar}
                        label="Check-in"
                        value={new Date(booking.startDate).toLocaleDateString()}
                      />
                      <DetailItem
                        icon={Calendar}
                        label="Check-out"
                        value={new Date(booking.endDate).toLocaleDateString()}
                      />
                      <DetailItem
                        icon={Users}
                        label="Guests"
                        value={booking.guests.toString()}
                      />
                      <DetailItem
                        icon={DollarSign}
                        label="Total Price"
                        value={`₹${booking.price}`}
                      />
                    </div>

                    {/* Service Charge Info */}
                    <div className="bg-gradient-to-r from-blue-50 to-sky-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-blue-900">
                            Your Service Charge (12%)
                          </p>
                          <p className="text-xs text-blue-700 mt-1">
                            Earned after guest payment
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">
                          ₹{booking.serviceCharge.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setActionType("approve");
                          setDialogOpen(true);
                        }}
                        className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
                      >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Approve Request
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setActionType("reject");
                          setDialogOpen(true);
                        }}
                        variant="outline"
                        className="flex-1 h-12 border-2 text-red-600 hover:bg-red-50 hover:border-red-300"
                      >
                        <XCircle className="mr-2 h-5 w-5" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Approval/Rejection Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve"
                ? "Approve Booking Request?"
                : "Reject Booking Request?"}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                {actionType === "approve" ? (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      The guest will be notified and can proceed with payment.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="font-semibold text-green-900">
                        Your earnings: ₹
                        {selectedBooking?.serviceCharge.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      The guest will be notified about the rejection.
                    </p>
                    <textarea
                      className="w-full p-3 border-2 rounded-lg text-gray-900 focus:border-sky-500 focus:ring-sky-500"
                      placeholder="Optional: Reason for rejection"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={actionType === "approve" ? handleApprove : handleReject}
              disabled={isLoading}
              className={`flex-1 ${
                actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : actionType === "approve" ? (
                "Approve"
              ) : (
                "Reject"
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900 truncate">{value}</p>
    </div>
  );
}
