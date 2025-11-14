import mongoose from "mongoose";

export interface PropertyDocument {
  _id: mongoose.Types.ObjectId; // MongoDB ObjectId
  VSID: string;
  commonId?: string;
  email: string;
  userId: string;

  rentalType: string;
  isInstantBooking?: boolean;
  propertyType?: string;
  rentalForm?: string;
  propertyName?: string;
  placeName?: string;
  newPlaceName?: string;

  street?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
  center?: {
    lat: number;
    lng: number;
  };

  size?: number;
  guests?: number;
  bedrooms?: number;
  beds?: number;
  bathroom?: number;
  kitchen?: number;
  childrenAge?: number;

  basePrice?: number;
  weekendPrice?: number;
  weeklyDiscount?: number;
  pricePerDay?: number[][];
  basePriceLongTerm?: number;
  monthlyDiscount?: number;
  currency?: string;

  icalLinks?: Record<string, string>;

  generalAmenities?: Record<string, boolean>;
  otherAmenities?: Record<string, boolean>;
  safeAmenities?: Record<string, boolean>;

  smoking?: string;
  pet?: string;
  party?: string;
  cooking?: string;
  additionalRules?: string[];

  reviews?: string;
  newReviews?: string;

  propertyImages?: string[];
  propertyCoverFileUrl?: string;
  propertyPictureUrls?: string[];

  night?: number[];
  time?: number[];
  datesPerPortion?: string[];

  area?: string;
  subarea?: string;
  neighbourhood?: string;
  floor?: string;
  isTopFloor: boolean;
  orientation?: string;
  levels?: number;
  zones?: string;
  propertyStyle?: string;
  constructionYear?: number;
  isSuitableForStudents: boolean;

  monthlyExpenses?: number;
  heatingType?: string;
  heatingMedium?: string;
  energyClass?: string;

  nearbyLocations?: Record<string, unknown>;

  hostedFrom?: string;
  hostedBy?: string;

  listedOn: string[];
  lastUpdatedBy: string[];
  lastUpdates: string[][];
  isLive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

// Frontend interface (with string _id for Client Components)
export interface Property {
  _id: string; // 🔥 String instead of ObjectId for Client Components
  VSID: string;
  commonId?: string;
  email?: string;
  userId?: string;

  rentalType?: string;
  isInstantBooking?: boolean;
  propertyType?: string;
  rentalForm?: string;
  propertyName?: string;
  placeName?: string;
  newPlaceName?: string;

  street?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
  center?: {
    lat: number;
    lng: number;
  };

  size?: number;
  guests?: number;
  bedrooms?: number;
  beds?: number;
  bathroom?: number;
  kitchen?: number;
  childrenAge?: number;

  basePrice?: number;
  weekendPrice?: number;
  weeklyDiscount?: number;
  pricePerDay?: number[][];
  basePriceLongTerm?: number;
  monthlyDiscount?: number;
  currency?: string;

  icalLinks?: Record<string, string>;

  generalAmenities?: Record<string, boolean>;
  otherAmenities?: Record<string, boolean>;
  safeAmenities?: Record<string, boolean>;

  smoking?: string;
  pet?: string;
  party?: string;
  cooking?: string;
  additionalRules?: string[];

  reviews?: string | null;
  newReviews?: string;

  propertyImages?: string[];
  propertyCoverFileUrl?: string;
  propertyPictureUrls?: string[];

  night?: number[];
  time?: number[];
  datesPerPortion?: string[];

  area?: string;
  subarea?: string;
  neighbourhood?: string;
  floor?: string;
  isTopFloor?: boolean;
  orientation?: string;
  levels?: number;
  zones?: string;
  propertyStyle?: string;
  constructionYear?: number;
  isSuitableForStudents?: boolean;

  monthlyExpenses?: number;
  heatingType?: string;
  heatingMedium?: string;
  energyClass?: string;

  nearbyLocations?: Record<string, unknown>;

  hostedFrom?: string;
  hostedBy?: string;

  listedOn?: string[];
  lastUpdatedBy?: string[];
  lastUpdates?: string[][];
  isLive?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}


export interface IUser extends Document {
  name: string;
  email: string;
  profilePic: string;
  nationality: string;
  gender: "Male" | "Female" | "Other";
  spokenLanguage: string;
  bankDetails: Record<string, any> | string; // since default is ""
  phone: string;
  myRequests: string[];
  myUpcommingRequests: string[];
  declinedRequests: Record<string, any>[]; // array of objects
  address: string;
  password: string;
  isVerified: boolean;
  role: "Owner" | "Traveller";
  favouriteProperties: string[];
  Payment?: Record<string, any>;
  forgotPasswordToken?: string;
  forgotPasswordTokenExpiry?: Date;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}


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
