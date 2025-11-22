# StayHaven - Holiday Home Rental Platform

A stunning, fully responsive holiday home rental website built with Next.js, TypeScript, and Supabase. This MVP features exceptional UI/UX design with smooth animations, comprehensive functionality, and a premium travel-oriented aesthetic.

## Features

### Core Functionality
- **Property Browsing**: Browse and filter through properties with advanced search capabilities
- **Property Details**: Detailed property pages with image galleries, amenities, and booking widgets
- **User Authentication**: Complete signup/login flow with Supabase Auth
- **Favorites System**: Save and manage favorite properties with localStorage persistence
- **Booking System**: Full booking flow with date selection and price calculation
- **User Profiles**: Manage profile information, view bookings, and account settings

### Design & UX
- **Premium Design**: Clean, modern interface with sea-blue color scheme
- **Smooth Animations**: Framer Motion animations throughout
- **Fully Responsive**: Mobile-first design that works on all devices
- **Interactive Elements**: Hover effects, transitions, and micro-interactions
- **Loading States**: Skeleton screens and loading indicators

### Technical Highlights
- **Next.js 13 App Router**: Modern React framework with latest features
- **TypeScript**: Full type safety throughout the application
- **Supabase**: Backend database and authentication
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Production-ready animation library

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3001](http://localhost:3001)

### Building for Production

```bash
npm run build
```

The static site will be exported to the `out` directory.

## Project Structure

```
project/
├── app/                        # Next.js app directory
│   ├── booking/               # Booking confirmation page
│   ├── favorites/             # Favorites page
│   ├── login/                 # Login page
│   ├── profile/               # User profile page
│   ├── properties/            # Properties listing and details
│   ├── signup/                # Signup page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/                 # Reusable components
│   ├── ui/                    # shadcn/ui components
│   ├── footer.tsx             # Site footer
│   ├── navbar.tsx             # Site navigation
│   ├── property-card.tsx      # Property card component
│   └── search-bar.tsx         # Search component
├── lib/                       # Utilities and configuration
│   ├── store.ts               # Zustand store
│   ├── supabase.ts            # Supabase client
│   └── utils.ts               # Utility functions
└── public/                    # Static assets
```

## Database Schema

The application uses Supabase with the following tables:

### Properties
- Property listings with images, amenities, pricing, and location data
- Support for featured properties and availability status

### Bookings
- Booking records with check-in/out dates, guest count, and pricing
- Confirmation codes and booking status tracking

### Favorites
- User favorite properties with relationship to properties table

### User Profiles
- Extended user information including name, bio, and avatar

### Reviews
- Property reviews with ratings for various categories

## Key Pages

### Landing Page (/)
- Hero section with search functionality
- Featured properties carousel
- Popular destinations grid
- Trust indicators and testimonials
- Call-to-action sections

### Properties Listing (/properties)
- Advanced filtering sidebar (price, type, amenities, ratings)
- Sortable property grid
- Mobile-responsive filter drawer
- Empty states and loading skeletons

### Property Details (/properties/[id])
- Image carousel with navigation
- Comprehensive property information
- Interactive booking widget with date picker
- Similar properties recommendations

### Authentication (/login, /signup)
- Modern form design with validation
- Social login UI (Google, Facebook)
- Password visibility toggle
- Error handling and feedback

### User Profile (/profile)
- Tabbed interface (Profile, Bookings, Settings)
- Editable profile information
- Booking history
- Account settings

### Favorites (/favorites)
- Grid of saved properties
- Empty state with call-to-action
- Integration with localStorage

### Booking Confirmation (/booking/confirm)
- Confirmation details display
- Downloadable/emailable receipt UI
- Next steps information
- Support contact details

## Technologies Used

- **Next.js 13**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Supabase**: Backend and authentication
- **Zustand**: State management
- **React Hook Form**: Form handling
- **date-fns**: Date utility library
- **Lucide React**: Icon library
- **shadcn/ui**: Component library

## Design System

### Color Palette
- **Primary**: Sky Blue (#0EA5E9, #0284C7)
- **Secondary**: White (#FFFFFF)
- **Accent**: Amber (#F59E0B) for ratings
- **Neutrals**: Gray scale for text and backgrounds

### Typography
- **Font**: Inter (via Google Fonts)
- **Hierarchy**: Clear size and weight distinctions
- **Line Height**: 150% for body, 120% for headings

### Spacing
- **System**: 8px base unit
- **Consistent**: Applied throughout the application

## Features in Detail

### Search Functionality
- Location-based search with autocomplete capability
- Date range picker for check-in/out
- Guest selector
- Results filtering and sorting

### Property Filtering
- Price range slider
- Property type checkboxes
- Room count filters
- Minimum rating selector
- Amenities multi-select
- Real-time filter updates

### Booking Widget
- Interactive date selection
- Guest count validation
- Real-time price calculation
- Booking total breakdown
- Clear call-to-action

### Favorites System
- Heart icon toggle on property cards
- localStorage persistence
- Favorites page with grid layout
- Empty state design

## Performance Optimizations

- **Image Optimization**: Next.js Image component with proper sizing
- **Lazy Loading**: Components and images load on demand
- **Code Splitting**: Automatic route-based splitting
- **Skeleton Screens**: Loading states for better perceived performance

## SEO Optimization

- Proper meta tags and descriptions
- Semantic HTML structure
- Image alt texts
- Structured page titles

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This is an MVP project. For production use, consider adding:
- Server-side rendering for improved SEO
- Payment integration (Stripe)
- Email notifications
- Advanced search with map integration
- Host dashboard
- Review system implementation
- Multi-language support
- Progressive Web App features

## License

This project is created as an MVP demonstration.

## Support

For questions or issues, please contact: support@stayhaven.com

---

Built with by StayHaven Team
