import { z } from 'zod';
import { router, publicProcedure, TRPCError, protectedProcedure } from '../trpc';
import { signToken } from '../utils/jwt';
import Users from '@/models/users';
import bcrypt from "bcrypt";

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
});
