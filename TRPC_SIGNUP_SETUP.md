# tRPC-Based Signup Implementation Guide

## Summary
Your signup page has been successfully converted to use tRPC for authentication. Here's what was implemented:

## Files Created/Modified

### 1. **User Model** (`src/models/user.ts`) - NEW
- Mongoose schema with fields: `fullName`, `email`, `password`
- Automatic password hashing using `bcryptjs`
- `comparePassword()` method for login validation
- Email uniqueness constraint with validation

### 2. **Auth Router** (`src/server/routers/auth.ts`) - NEW
- **`signup` mutation** with:
  - Input validation using Zod
  - Password confirmation check
  - Duplicate email detection
  - Error handling with proper tRPC error codes
  - Returns user data (without password) on success

### 3. **App Router** (`src/server/routers/_app.ts`) - UPDATED
- Added `auth: authRouter` to main router
- Now exposes both `property` and `auth` routes

### 4. **Signup Page** (`src/app/signup/page.tsx`) - UPDATED
- Replaced commented Supabase code with tRPC mutation
- Uses `trpc.auth.signup.useMutation()` hook
- Integrated error handling and loading states
- Added success redirect to `/login?signup=success`
- Form validation before submission

### 5. **tRPC Server Setup** (`src/server/trpc.ts`) - UPDATED
- Exported `TRPCError` for use in routers
- Context function properly exported

### 6. **API Route** (`src/app/api/trpc/[trpc]/route.ts`) - UPDATED
- Added `onError` handler for logging tRPC errors

### 7. **Property Router** (`src/server/routers/property.ts`) - UPDATED
- Added error handling and try-catch

## How It Works

### Frontend Flow:
1. User fills signup form
2. Form validates passwords match and are >= 6 characters
3. Clicking "Sign Up" triggers `signupMutation.mutateAsync()`
4. tRPC sends request to `/api/trpc/auth.signup`
5. On success → redirects to `/login?signup=success`
6. On error → displays error message

### Backend Flow:
1. Route handler calls `auth.signup` mutation
2. Zod validates input schema
3. Checks if email already exists
4. Hashes password using bcryptjs
5. Creates user in MongoDB
6. Returns user data (no password)

## Key Features

✅ **Password Hashing** - Bcryptjs with salt rounds (10)
✅ **Email Validation** - Zod regex pattern + MongoDB unique index
✅ **Error Handling** - Type-safe tRPC errors
✅ **Input Validation** - Comprehensive Zod schemas
✅ **Type Safety** - Full TypeScript support
✅ **Database Integration** - MongoDB with Mongoose

## Environment Setup

Make sure your `.env.local` has:
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net
```

## Next Steps

### Implement Login:
```typescript
// Create auth router's login mutation
export const authRouter = router({
  signup: // ... existing code
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const user = await User.findOne({ email: input.email }).select('+password');
      if (!user || !(await user.comparePassword(input.password))) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }
      // Generate JWT or session here
      return { id: user._id, email: user.email };
    }),
});
```

### Add JWT/Sessions:
- Install `jsonwebtoken` for JWT tokens
- Or use NextAuth.js for session management

### Protect Routes:
- Create middleware to check authentication
- Add protected procedures in tRPC router

## Testing

Try the signup with:
- Full Name: `John Doe`
- Email: `john@example.com`
- Password: `password123`
- Confirm: `password123`

The user should be created and redirected to the login page.
