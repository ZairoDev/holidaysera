# StayHaven Setup Guide

## Quick Start

Follow these steps to get your StayHaven application up and running:

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. **Create a Supabase Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Get Your Credentials**
   - Navigate to Project Settings > API
   - Copy your `Project URL` and `anon/public` key

3. **Create Environment File**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the placeholder values with your actual Supabase credentials.

### 3. Database Setup

The database schema has already been created! The migrations include:

- **Properties table**: Stores all property listings
- **Bookings table**: Manages booking records
- **Favorites table**: User favorite properties
- **User Profiles table**: Extended user information
- **Reviews table**: Property reviews and ratings

Sample data for 12 properties across various destinations has been pre-populated.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### 5. Test the Application

Try these features:
- Browse properties on the home page
- Search and filter properties
- View property details
- Sign up for an account
- Add properties to favorites
- Simulate a booking

## Project Structure

```
project/
├── app/                    # Next.js app directory (pages)
├── components/             # Reusable React components
├── lib/                   # Utilities and configuration
├── public/                # Static assets
└── .env.local             # Environment variables (create this)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types

## Key Features Implemented

✅ Landing page with hero section and featured properties
✅ Property listing with advanced filters
✅ Property details with booking widget
✅ User authentication (signup/login)
✅ User profile management
✅ Favorites system with localStorage
✅ Booking flow and confirmation
✅ Fully responsive design
✅ Smooth animations with Framer Motion
✅ Supabase backend integration

## Authentication Setup

The application uses Supabase Auth with email/password authentication.

**Test Users**: Create your own accounts through the signup page.

**Note**: Email confirmation is disabled by default in development.

## Customization

### Color Scheme
The application uses a sea-blue theme. To customize:
- Edit `tailwind.config.ts` for global color changes
- Modify components in `components/` directory

### Images
- Property images use Pexels stock photos
- Update image URLs in the database for custom images
- Ensure images are optimized for web

## Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- Self-hosted

## Troubleshooting

### Build Errors

If you encounter build errors:
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Supabase Connection Issues

Verify your environment variables:
```bash
cat .env.local
```

Ensure the values match your Supabase project settings.

### Image Loading Issues

Check that the image domains are configured in `next.config.js`:
```javascript
images: {
  domains: ['images.pexels.com'],
}
```

## Additional Configuration

### Email Templates (Optional)

Configure email templates in Supabase for:
- Account confirmation
- Password reset
- Booking confirmations

### Row Level Security

RLS policies are already configured for:
- Properties (public read, authenticated write)
- Bookings (user-specific access)
- Favorites (user-specific access)
- User profiles (public read, owner write)

## Support

For issues or questions:
- Check the main README.md
- Review Supabase documentation
- Check Next.js documentation

## Next Steps

Consider adding:
- Payment integration (Stripe)
- Email notifications
- Advanced search with maps
- Host dashboard
- Review submission flow
- Multi-language support

---

Enjoy building with StayHaven!
