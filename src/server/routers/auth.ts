import { z } from 'zod';
import { router, publicProcedure, TRPCError, protectedProcedure } from '../trpc';
import { signToken } from '../utils/jwt';
import Users from '@/models/users';
import bcrypt from "bcrypt";
import Travellers from '@/models/traveller';

export const authRouter = router({
  signup: publicProcedure
    .input(
      z
        .object({
          fullName: z
            .string()
            .min(2, "Full name must be at least 2 characters"),
          email: z.string().email("Invalid email address"),
          password: z.string().min(6, "Password must be at least 6 characters"),
          role: z.string().optional(),
          phoneNumber: z
            .string()
            .min(10, "Phone number must be at least 10 characters"),
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
        const user = await Travellers.create({
          name: input.fullName,
          email: input.email,
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
            fullName: user.fullName,
            email: user.email,
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
        role: z.enum(["traveller", "owner"], {
          errorMap: () => ({ message: "Please select a valid role" }),
        }),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Choose the correct model based on role
        const UserModel = input.role === "traveller" ? Travellers : Users;
        
        const user = await UserModel.findOne({ email: input.email });
        
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No ${input.role} account found with this email`,
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
          role: input.role, // Include role in token
        });
        
        return {
          token,
          user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: input.role,
            createdAt: user.createdAt,
          },
        };
      } catch (error: any) {
        console.error("Login error:", error);
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
});
