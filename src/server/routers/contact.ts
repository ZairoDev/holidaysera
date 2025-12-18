import { z } from "zod";
import { publicProcedure, router, TRPCError } from "../trpc";
import { sendContactEmail } from "@/server/utils/gmailMailer";

export const contactRouter = router({
  // Send contact form email
  sendMessage: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email format"),
        phone: z.string().optional(),
        subject: z.string().min(1, "Subject is required"),
        category: z.string().optional().default("general"),
        message: z.string().min(20, "Message must be at least 20 characters"),
      })
    )
    .mutation(async ({ input }) => {
      const { name, email, phone, subject, category, message } = input;

      try {
        await sendContactEmail({
          name,
          email,
          phone: phone || "",
          subject,
          category: category || "general",
          message,
        });

        return {
          success: true,
          message: "Your message has been sent successfully! We'll get back to you soon.",
        };
      } catch (error) {
        console.error("Contact form error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send message. Please try again later.",
        });
      }
    }),
});
