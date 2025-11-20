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
import { useState as useDialogState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { user: authUser } = useUserStore();
  const userId = authUser?.id;
  const [pendingBookings, setPendingBookings] = useState<PendingBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<PendingBooking | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Socket connection
  const { socket, isConnected } = useSocket(userId || undefined, "owner");

  // Debug room join
  useEffect(() => {
    if (userId && socket?.id) {
      console.log(`OwnerDashboard: userId=${userId}, socket.id=${socket.id}, room=owner-${userId}`);
    }
  }, [userId, socket?.id]);

  // Fetch pending bookings on mount
  const { data: bookings, refetch } = trpc.booking.getOwnerPendingBookings.useQuery(
    undefined,
    { enabled: !!userId }
  );

  useEffect(() => {
    if (bookings) {
      setPendingBookings(bookings);
    }
  }, [bookings]);

  // Listen for new booking requests via socket
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

      // Show toast notification
      toast.success("New Booking Request!", {
        description: `New request for ${data.propertyName} from ${data.travelerName}. Service charge: ₹${data.serviceCharge.toFixed(2)}`,
        duration: 5000,
      });
    };

    socket.on("booking-request-received", handleNewBooking);

    return () => {
      socket.off("booking-request-received", handleNewBooking);
    };
  }, [socket]);

  // Approve or reject booking
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

      // Show success toast
      toast.success("Booking Approved!", {
        description: `You approved a booking for ${selectedBooking.propertyName}. Traveller will be notified.`,
        duration: 4000,
      });
    } catch (error) {
      console.error("Error approving booking:", error);
      toast.error("Failed to approve booking", {
        description: "Please try again",
      });
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

      // Show rejection toast
      toast.error("Booking Rejected", {
        description: `You rejected a booking request for ${selectedBooking.propertyName}.`,
        duration: 4000,
      });
    } catch (error) {
      console.error("Error rejecting booking:", error);
      toast.error("Failed to reject booking", {
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openApproveDialog = (booking: PendingBooking) => {
    setSelectedBooking(booking);
    setActionType("approve");
    setDialogOpen(true);
  };

  const openRejectDialog = (booking: PendingBooking) => {
    setSelectedBooking(booking);
    setActionType("reject");
    setDialogOpen(true);
  };

  if (!userId) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-600">Loading reservations...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Booking Requests</h1>
        <p className="text-gray-600 mt-2">
          {isConnected ? (
            <span className="text-green-600">🟢 Connected to real-time updates</span>
          ) : (
            <span className="text-red-600">🔴 Connecting...</span>
          )}
        </p>
        {socket && (
          <>
            <p className="text-xs text-gray-400 mt-1">Socket ID: {socket.id}</p>
            <p className="text-xs text-gray-400">Owner Room: owner-{userId}</p>
          </>
        )}
      </div>

      {pendingBookings.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No pending booking requests</p>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pendingBookings.map((booking) => (
            <Card key={booking._id} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Property</p>
                  <p className="text-lg font-semibold">{booking.propertyName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Guest</p>
                  <p className="text-lg font-semibold">{booking.travelerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-in</p>
                  <p className="text-lg font-semibold">
                    {new Date(booking.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Check-out</p>
                  <p className="text-lg font-semibold">
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Guests</p>
                  <p className="text-lg font-semibold">{booking.guests}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-lg font-semibold">₹{booking.price}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
                <p className="text-sm font-semibold text-blue-900">
                  Your Service Charge (12%): ₹{booking.serviceCharge.toFixed(2)}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  You'll receive this amount once the guest completes payment after approval.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => openApproveDialog(booking)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => openRejectDialog(booking)}
                  variant="outline"
                  className="flex-1"
                >
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog for approve/reject actions */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve"
                ? "Approve Booking Request?"
                : "Reject Booking Request?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "approve" ? (
                <div>
                  <p>
                    You're about to approve a booking request. Once approved, the guest
                    will be notified and can proceed with payment.
                  </p>
                  <p className="mt-4 font-semibold">
                    Your earnings: ₹{selectedBooking?.serviceCharge.toFixed(2)}
                  </p>
                </div>
              ) : (
                <div>
                  <p>You're about to reject this booking request.</p>
                  <textarea
                    className="w-full mt-4 p-2 border rounded text-black"
                    placeholder="Optional: Reason for rejection"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                  />
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={actionType === "approve" ? handleApprove : handleReject}
              disabled={isLoading}
              className={
                actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {isLoading
                ? "Processing..."
                : actionType === "approve"
                  ? "Approve"
                  : "Reject"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
