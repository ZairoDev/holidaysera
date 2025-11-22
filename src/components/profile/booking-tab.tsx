"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

import { TravellerBookings } from "./traveller-booking";
import OwnerDashboard from "./owner-dashboard";


interface BookingsTabProps {
  isOwner: boolean;
}

export function BookingsTab({ isOwner }: BookingsTabProps) {
  return (
    <TabsContent value="bookings">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOwner ? (
          <Card className="overflow-hidden shadow-lg border-0">
            <OwnerDashboard />
          </Card>
        ) : (
          <TravellerBookings />
        )}
      </motion.div>
    </TabsContent>
  );
}
