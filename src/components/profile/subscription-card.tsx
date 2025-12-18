"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Crown,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface SubscriptionData {
  planId?: string;
  planName?: string;
  status: "active" | "expired" | "cancelled" | "none";
  startDate?: string | Date;
  endDate?: string | Date;
  subscriptionId?: string;
}

interface SubscriptionCardProps {
  subscription: SubscriptionData;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const { remainingDays, isExpiringSoon, formattedStartDate, formattedEndDate } =
    useMemo(() => {
      if (!subscription.endDate || subscription.status !== "active") {
        return {
          remainingDays: 0,
          isExpiringSoon: false,
          formattedStartDate: "-",
          formattedEndDate: "-",
        };
      }

      const endDate = new Date(subscription.endDate);
      const startDate = subscription.startDate
        ? new Date(subscription.startDate)
        : null;
      const now = new Date();
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        remainingDays: Math.max(0, diffDays),
        isExpiringSoon: diffDays <= 5 && diffDays > 0,
        formattedStartDate: startDate
          ? startDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-",
        formattedEndDate: endDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      };
    }, [subscription]);

  const getStatusBadge = () => {
    switch (subscription.status) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Active
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white gap-1">
            <XCircle className="h-3 w-3" />
            Expired
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600 text-white gap-1">
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            No Subscription
          </Badge>
        );
    }
  };

  // No subscription state
  if (subscription.status === "none" || !subscription.planName) {
    return (
      <Card className="mb-6 sm:mb-8 overflow-hidden shadow-lg border-0">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100">
                <Crown className="h-6 w-6 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Subscription
              </h2>
            </div>
            {getStatusBadge()}
          </div>

          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex p-4 rounded-full bg-gray-100 mb-4"
            >
              <Sparkles className="h-8 w-8 text-gray-400" />
            </motion.div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Active Subscription
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Subscribe to a plan to list your properties and reach millions of
              travelers.
            </p>
            <Link href="/subscriptions">
              <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white">
                <Crown className="h-4 w-4 mr-2" />
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mb-6 sm:mb-8 overflow-hidden shadow-lg border-0">
      {/* Expiry Warning Banner */}
      {isExpiringSoon && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-white"
        >
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
            <span className="font-medium">
              Your subscription expires in {remainingDays} day
              {remainingDays !== 1 ? "s" : ""}!
            </span>
            <Link
              href="/subscriptions"
              className="ml-2 underline hover:no-underline font-semibold"
            >
              Renew Now
            </Link>
          </div>
        </motion.div>
      )}

      {/* Expired Banner */}
      {subscription.status === "expired" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 text-white"
        >
          <div className="flex items-center justify-center gap-2">
            <XCircle className="h-5 w-5" />
            <span className="font-medium">
              Your subscription has expired. Renew to continue listing properties.
            </span>
            <Link
              href="/subscriptions"
              className="ml-2 underline hover:no-underline font-semibold"
            >
              Renew Now
            </Link>
          </div>
        </motion.div>
      )}

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100">
              <Crown className="h-6 w-6 text-sky-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Subscription</h2>
          </div>
          {getStatusBadge()}
        </div>

        {/* Plan Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan Name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-4 border border-sky-100"
          >
            <div className="flex items-center gap-2 text-sky-600 mb-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Current Plan</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {subscription.planName}
            </p>
          </motion.div>

          {/* Remaining Days */}
          {subscription.status === "active" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`rounded-xl p-4 border ${
                isExpiringSoon
                  ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
                  : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-100"
              }`}
            >
              <div
                className={`flex items-center gap-2 mb-2 ${
                  isExpiringSoon ? "text-amber-600" : "text-green-600"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Remaining</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {remainingDays} Day{remainingDays !== 1 ? "s" : ""}
              </p>
            </motion.div>
          )}

          {/* Dates */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-100"
          >
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Validity</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Start:</span> {formattedStartDate}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">End:</span> {formattedEndDate}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
          <Link href="/subscriptions">
            <Button
              variant="outline"
              className="border-sky-200 text-sky-700 hover:bg-sky-50"
            >
              <Crown className="h-4 w-4 mr-2" />
              {subscription.status === "active" ? "Upgrade Plan" : "View Plans"}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
