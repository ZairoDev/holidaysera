"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { useUserStore } from "@/lib/store";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BookingData {
  _id: string;
  propertyId: string;
  ownerId: string;
  travellerId: string;
  startDate: string;
  endDate: string;
  guests: number;
  price: number;
  serviceCharge: number;
  bookingStatus: string;
  ownerApprovalStatus: string;
  paymentStatus: string;
}

function BookingPaymentContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams?.get("id");

  const { user: authUser } = useUserStore();
  const userId = authUser?.id;
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [approvalReceived, setApprovalReceived] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
  });

  // Socket connection
  const { socket } = useSocket(userId || undefined, "traveller");

  // Fetch booking data
  const { data: booking } = trpc.booking.getBookingById.useQuery(
    { bookingId: bookingId || "" },
    { enabled: !!bookingId }
  );

  useEffect(() => {
    if (booking) {
      setBookingData(booking as any);
      if (booking.ownerApprovalStatus === "approved") {
        setApprovalReceived(true);
      }
    }
  }, [booking]);

  // Listen for approval notification
  useEffect(() => {
    if (!socket) return;

    const handleApprovalNotification = (data: any) => {
      if (data.bookingId === bookingId) {
        setApprovalReceived(true);
        setBookingData((prev) =>
          prev ? { ...prev, ownerApprovalStatus: "approved" } : null
        );

        // Show approval toast
        toast.success("Booking Approved! 🎉", {
          description: "Your booking request has been approved. Please proceed with payment.",
          duration: 5000,
        });
      }
    };

    socket.on("booking-approved-notification", handleApprovalNotification);

    return () => {
      socket.off("booking-approved-notification", handleApprovalNotification);
    };
  }, [socket, bookingId]);

  // Listen for rejection notification
  useEffect(() => {
    if (!socket) return;

    const handleRejectionNotification = (data: any) => {
      if (data.bookingId === bookingId) {
        setBookingData((prev) =>
          prev ? { ...prev, bookingStatus: "rejected" } : null
        );

        // Show rejection toast
        toast.error("Booking Rejected", {
          description: "Unfortunately, the owner has declined your booking request.",
          duration: 5000,
        });
      }
    };

    socket.on("booking-rejected-notification", handleRejectionNotification);

    return () => {
      socket.off("booking-rejected-notification", handleRejectionNotification);
    };
  }, [socket, bookingId]);

  const completePaymentMutation = trpc.booking.completePayment.useMutation();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingId || !bookingData) return;

    setIsProcessing(true);

    try {
      // Validate card details
      if (
        !cardDetails.cardNumber ||
        !cardDetails.expiryDate ||
        !cardDetails.cvv ||
        !cardDetails.name
      ) {
        alert("Please fill in all payment details");
        setIsProcessing(false);
        return;
      }

      // In a real application, this would integrate with Stripe or another payment processor
      // For now, we'll simulate a successful payment
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await completePaymentMutation.mutateAsync({
        bookingId,
        transactionId,
        paymentIntentId: `intent_${Date.now()}`,
      });

      alert("Payment completed successfully!");
      // Redirect to booking confirmation page
      window.location.href = `/booking/confirm?id=${bookingId}`;
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="p-8">
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (bookingData.bookingStatus === "rejected") {
    return (
      <div className="p-8">
        <Card className="p-8 text-center bg-red-50 border border-red-200">
          <p className="text-lg font-semibold text-red-700">Booking Rejected</p>
          <p className="text-gray-600 mt-2">
            Unfortunately, the property owner has rejected your booking request.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

      {!approvalReceived ? (
        <Card className="p-8 bg-yellow-50 border border-yellow-200 mb-8">
          <p className="text-lg font-semibold text-yellow-900">
            ⏳ Waiting for Owner Approval
          </p>
          <p className="text-yellow-700 mt-2">
            Your booking request has been sent to the property owner. Once they approve
            it, you'll be able to complete your payment.
          </p>
        </Card>
      ) : (
        <Card className="p-8 bg-green-50 border border-green-200 mb-8">
          <p className="text-lg font-semibold text-green-900">
            ✅ Booking Approved!
          </p>
          <p className="text-green-700 mt-2">
            The property owner has approved your booking. Please complete the payment to
            confirm your reservation.
          </p>
        </Card>
      )}

      {/* Booking Summary */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6">Booking Summary</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Check-in</p>
            <p className="font-semibold">
              {new Date(bookingData.startDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Check-out</p>
            <p className="font-semibold">
              {new Date(bookingData.endDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Guests</p>
            <p className="font-semibold">{bookingData.guests}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Price</p>
            <p className="font-semibold">₹{bookingData.price}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-600">Total Price</p>
            <p className="font-semibold">₹{bookingData.price}</p>
          </div>
          <div className="flex justify-between items-center text-blue-600">
            <p className="font-semibold">Service Charge (12%)</p>
            <p className="font-bold text-lg">₹{bookingData.serviceCharge.toFixed(2)}</p>
          </div>
          <div className="mt-4 bg-blue-50 p-4 rounded">
            <p className="text-sm text-blue-700">
              💡 Only the service charge (12% of total price) will be deducted. This goes
              to Holidaysera to maintain the platform.
            </p>
          </div>
        </div>
      </Card>

      {/* Payment Form */}
      {approvalReceived && bookingData.paymentStatus === "awaiting" && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Payment Details</h2>
          <form onSubmit={handlePayment}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Cardholder Name
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, name: e.target.value })
                  }
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Card Number
                </label>
                <Input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                  }
                  disabled={isProcessing}
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expiry Date
                  </label>
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, expiryDate: e.target.value })
                    }
                    disabled={isProcessing}
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <Input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvv: e.target.value })
                    }
                    disabled={isProcessing}
                    maxLength={4}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={!approvalReceived || isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
              >
                {isProcessing
                  ? "Processing Payment..."
                  : `Pay ₹${bookingData.serviceCharge.toFixed(2)}`}
              </Button>
            </div>
          </form>

          <p className="text-xs text-gray-600 mt-6 text-center">
            ⚠️ Demo Mode: Use any card details. In production, this would integrate with
            Stripe or Razorpay for secure payments.
          </p>
        </Card>
      )}
    </div>
  );
}

export default function BookingPaymentPage() {
  return (
    <Suspense fallback={<div>Loading payment page...</div>}>
      <BookingPaymentContent />
    </Suspense>
  );
}
