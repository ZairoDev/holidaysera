export type Property = {
  id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  price_per_night: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  property_type: string;
  images: string[];
  amenities: string[];
  rating: number;
  review_count: number;
  host_id: string | null;
  featured: boolean;
  available: boolean;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  property_id: string;
  user_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  confirmation_code: string;
  created_at: string;
};

export type Review = {
  id: string;
  property_id: string;
  user_id: string;
  rating: number;
  comment: string;
  cleanliness: number;
  communication: number;
  checkin: number;
  accuracy: number;
  location: number;
  value: number;
  created_at: string;
};

export type Favorite = {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
};

export type UserProfile = {
  id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  phone: string;
  created_at: string;
  updated_at: string;
};
