"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Star, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { useUserStore } from "@/lib/store";
import { LoginContent } from "@/components/auth/login-form";
import Image from "next/image";

interface ReviewsSectionProps {
  propertyId: string;
}

export function ReviewsSection({ propertyId }: ReviewsSectionProps) {
  const { user } = useUserStore();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [location, setLocation] = useState("");

  const { data: reviews = [], refetch } = trpc.review.getByPropertyId.useQuery(
    { propertyId },
    { enabled: !!propertyId }
  );

  const createReviewMutation = trpc.review.create.useMutation({
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setShowReviewDialog(false);
      setComment("");
      setLocation("");
      setRating(5);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit review");
    },
  });

  const handleSubmitReview = () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    if (comment.length < 10) {
      toast.error("Please write at least 10 characters");
      return;
    }

    createReviewMutation.mutate({
      propertyId,
      rating,
      comment,
      location,
    });
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <>
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-semibold">Reviews</h2>
            {reviews.length > 0 ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="text-lg font-semibold">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-600">
                  ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </div>
            ) : (
              <p className="text-gray-600">No reviews yet</p>
            )}
          </div>
          <Button
            onClick={() => {
              if (!user) {
                setShowLoginDialog(true);
              } else {
                setShowReviewDialog(true);
              }
            }}
            className="bg-sky-600 hover:bg-sky-700"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Write a Review
          </Button>
        </div>

        {reviews.length === 0 ? (
          <div className="py-12 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-600">Be the first to review this property!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                      {review.userAvatar ? (
                        <Image
                          src={review.userAvatar}
                          alt={review.userName}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <User className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {review.userName}
                      </p>
                      {review.location && (
                        <p className="text-sm text-gray-600">{review.location}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {format(new Date(review.createdAt), "MMMM yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with this property
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300 hover:text-amber-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="comment">Your Review</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="mt-2 min-h-[120px]"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {comment.length}/10 minimum characters
              </p>
            </div>

            <div>
              <Label htmlFor="location">Location (Optional)</Label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., New York, USA"
                className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowReviewDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={createReviewMutation.isPending || comment.length < 10}
                className="flex-1 bg-sky-600 hover:bg-sky-700"
              >
                {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <LoginContent
            isModal={true}
            onSuccess={() => {
              setShowLoginDialog(false);
              setShowReviewDialog(true);
            }}
            redirectUrl={typeof window !== "undefined" ? window.location.pathname : ""}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

