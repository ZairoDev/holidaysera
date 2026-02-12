import { z } from 'zod';
import { router, publicProcedure, TRPCError, protectedProcedure } from '../trpc';
import { signToken } from '../utils/jwt';
import Users from '@/models/users';
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendMail } from '../utils/gmailMailer';

export const authRouter = router({
  signup: publicProcedure
    .input(
      z
        .object({
          firstName: z
            .string()
            .min(1, "First name is required")
            .max(50, "First name must be less than 50 characters"),
          lastName: z
            .string()
            .min(1, "Last name is required")
            .max(50, "Last name must be less than 50 characters"),
          email: z.string().email("Invalid email address"),
          password: z.string().min(6, "Password must be at least 6 characters"),
          role: z.enum(["Owner", "Traveller"], {
            errorMap: () => ({ message: "Please select a role (Owner or Traveller)" }),
          }),
          countryCode: z
            .string()
            .min(1, "Country code is required"),
          phoneNumber: z
            .string()
            .min(6, "Phone number must be at least 6 digits"),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        })
    )
    .mutation(async ({ input }) => {
      try {
        // Check if user already exists
        const existingUser = await Users.findOne({ email: input.email });
        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already registered",
          });
        }
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const fullName = `${input.firstName} ${input.lastName}`;
        const user = await Users.create({
          firstName: input.firstName,
          lastName: input.lastName,
          name: fullName, // Keep for backwards compatibility
          email: input.email,
          countryCode: input.countryCode,
          phone: input.phoneNumber,
          password: hashedPassword,
          role: input.role,
          origin: "holidaysera",
        });
        // Create new user
        const token = signToken({
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        });

        // Return user without password
        return {
          token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: fullName,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          },
        };
      } catch (error: any) {
        console.error("Signup error:", error);

        if (error.code === "CONFLICT") {
          throw error;
        }

        if (error.code === 11000) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already registered",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to create account",
        });
      }
    }),
    login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        role: z.enum(["Traveller", "Owner"], {
          errorMap: () => ({ message: "Please select a valid role" }),
        }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Find user in Users model only
        const user = await Users.findOne({ email: input.email });
        
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "No account found with this email",
          });
        }

        // Verify the user's role matches what they're trying to login as
        if (user.role !== input.role) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: `This account is registered as ${user.role}. Please select the correct role.`,
          });
        }
        
        const isPasswordValid = await bcrypt.compare(
          input.password,
          user.password
        );
        
        if (!isPasswordValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid credentials",
          });
        }
        
        const token = signToken({
          id: user._id.toString(),
          email: user.email,
          role: user.role, // Use the stored role from database
        });
        
        return {
          token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.firstName && user.lastName 
              ? `${user.firstName} ${user.lastName}` 
              : user.name, // Fallback for existing users
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          },
        };
      } catch (error: any) {
        console.error("Login error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to login",
        });
      }
    }),
  me: protectedProcedure
    .input(z.void()) // 👈 THIS IS IMPORTANT
    .query(async ({ ctx }) => {
      // You can return ctx.user from JWT or fetch full user from DB:
      const user = await Users.findById(ctx.user?.id).select("-password");
      return user;
    }),
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    // Since JWT is stateless, logout can be handled on client side by deleting the token.
    // Optionally, you can implement token blacklisting here.
    
    return { message: "Logout successful" };
  }),

  // ============================================
  // OAuth Profile Completion
  // ============================================
  completeOAuthProfile: protectedProcedure
    .input(
      z.object({
        role: z.enum(["Owner", "Traveller"], {
          errorMap: () => ({ message: "Please select a role (Owner or Traveller)" }),
        }),
        countryCode: z.string().optional(),
        phoneNumber: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user?.id;
        if (!userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authenticated",
          });
        }

        const user = await Users.findById(userId);
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Update user profile
        user.role = input.role;
        user.isProfileComplete = true;
        
        if (input.phoneNumber) {
          user.phone = input.phoneNumber;
        }
        if (input.countryCode) {
          user.countryCode = input.countryCode;
        }

        await user.save();

        // Generate new token with updated role
        const token = signToken({
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        });

        const fullName = user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.name || "";

        return {
          token,
          user: {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            fullName,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
          },
        };
      } catch (error: any) {
        console.error("Complete OAuth profile error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to complete profile",
        });
      }
    }),

  // ============================================
  // Forgot Password Flow
  // ============================================
  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const user = await Users.findOne({ email: input.email });

        // Don't reveal if email exists or not for security
        if (!user) {
          // Still return success to prevent email enumeration
          return {
            success: true,
            message: "If an account with that email exists, we've sent a password reset link.",
          };
        }

        // Check if user has a password (OAuth users can't reset password)
        if (!user.password) {
          return {
            success: true,
            message: "If an account with that email exists, we've sent a password reset link.",
          };
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token expires in 1 hour

        // Save token to user
        user.forgotPasswordToken = resetToken;
        user.forgotPasswordTokenExpiry = resetTokenExpiry;
        await user.save();

        // Create reset link
        const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

        // Send email
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
              .header h1 { margin: 0 0 10px 0; font-size: 28px; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
              .button { display: inline-block; background: #0ea5e9; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
              .button:hover { background: #0284c7; }
              .footer { background: #1e293b; color: #94a3b8; padding: 25px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; }
              .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Password Reset Request</h1>
                <p>We received a request to reset your password</p>
              </div>
              <div class="content">
                <p>Hi there,</p>
                
                <p>We received a request to reset your password for your Holidays Era account. Click the button below to reset your password:</p>
                
                <div style="text-align: center;">
                  <a href="${resetLink}" class="button">Reset Password</a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #0ea5e9;">${resetLink}</p>
                
                <div class="warning">
                  <p style="margin: 0;"><strong>⚠️ Important:</strong></p>
                  <ul style="margin: 10px 0 0 20px; padding: 0;">
                    <li>This link will expire in 1 hour</li>
                    <li>If you didn't request this, please ignore this email</li>
                    <li>Your password will remain unchanged if you don't click the link</li>
                  </ul>
                </div>
                
                <p>Best regards,<br><strong>The Holidays Era Team</strong></p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Holidays Era. All rights reserved.</p>
                <p>This is an automated email, please do not reply.</p>
              </div>
            </div>
          </body>
          </html>
        `;

        // Send reset link email
        await sendMail({
          to: user.email,
          subject: "Reset Your Password - Holidays Era",
          html: emailHtml,
        });

        // Send confirmation email
        const confirmationHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
              .header h1 { margin: 0 0 10px 0; font-size: 28px; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
              .footer { background: #1e293b; color: #94a3b8; padding: 25px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; }
              .info-box { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Password Reset Request Confirmed</h1>
                <p>Your request has been received</p>
              </div>
              <div class="content">
                <p>Hi there,</p>
                
                <p>This is a confirmation that we've received your password reset request for your Holidays Era account.</p>
                
                <div class="info-box">
                  <p style="margin: 0;"><strong>📧 Email Sent:</strong> ${new Date().toLocaleString()}</p>
                  <p style="margin: 5px 0 0 0;"><strong>📬 Check Your Inbox:</strong> We've sent you a password reset link</p>
                </div>
                
                <p><strong>What to do next:</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Check your inbox for the password reset email</li>
                  <li>Click the reset link in the email (expires in 1 hour)</li>
                  <li>Create a new secure password</li>
                </ul>
                
                <p><strong>Didn't request this?</strong></p>
                <p>If you didn't request a password reset, you can safely ignore this email. Your account remains secure and no changes have been made.</p>
                
                <p>Best regards,<br><strong>The Holidays Era Team</strong></p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Holidays Era. All rights reserved.</p>
                <p>This is an automated email, please do not reply.</p>
              </div>
            </div>
          </body>
          </html>
        `;

        await sendMail({
          to: user.email,
          subject: "Password Reset Request Confirmed - Holidays Era",
          html: confirmationHtml,
        });

        return {
          success: true,
          message: "If an account with that email exists, we've sent a password reset link.",
        };
      } catch (error: any) {
        console.error("Forgot password error:", error);
        // Still return success to prevent email enumeration
        return {
          success: true,
          message: "If an account with that email exists, we've sent a password reset link.",
        };
      }
    }),

  verifyResetToken: publicProcedure
    .input(
      z.object({
        token: z.string().min(1, "Token is required"),
      })
    )
    .query(async ({ input }) => {
      try {
        const user = await Users.findOne({
          forgotPasswordToken: input.token,
          forgotPasswordTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid or expired reset token",
          });
        }

        return {
          valid: true,
          email: user.email,
        };
      } catch (error: any) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to verify token",
        });
      }
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string().min(1, "Token is required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      })
    )
    .mutation(async ({ input }) => {
      try {
        const user = await Users.findOne({
          forgotPasswordToken: input.token,
          forgotPasswordTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid or expired reset token",
          });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(input.password, 10);

        // Update password and clear reset token
        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();

        // Send confirmation email
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
              .header h1 { margin: 0 0 10px 0; font-size: 28px; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e2e8f0; }
              .footer { background: #1e293b; color: #94a3b8; padding: 25px; border-radius: 0 0 12px 12px; text-align: center; font-size: 12px; }
              .info-box { background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px; margin: 20px 0; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Password Reset Successful</h1>
                <p>Your password has been changed</p>
              </div>
              <div class="content">
                <p>Hi there,</p>
                
                <p>Your password has been successfully reset for your Holidays Era account.</p>
                
                <div class="info-box">
                  <p style="margin: 0;"><strong>📅 Changed on:</strong> ${new Date().toLocaleString()}</p>
                </div>
                
                <p>If you didn't make this change, please contact our support team immediately.</p>
                
                <p>Best regards,<br><strong>The Holidays Era Team</strong></p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Holidays Era. All rights reserved.</p>
                <p>This is an automated email, please do not reply.</p>
              </div>
            </div>
          </body>
          </html>
        `;

        await sendMail({
          to: user.email,
          subject: "Password Reset Successful - Holidays Era",
          html: emailHtml,
        });

        return {
          success: true,
          message: "Password has been reset successfully",
        };
      } catch (error: any) {
        console.error("Reset password error:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to reset password",
        });
      }
    }),
});
