/**
 * Common types used across the AeroDeliver application
 */

export type UUID = string;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: Coordinates;
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface TimeWindow {
  start: Date;
  end: Date;
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum UserRole {
  CUSTOMER = 'customer',
  STORE_ADMIN = 'store_admin',
  RIDER = 'rider',
  ADMIN = 'admin',
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface WeightedItem {
  id: string;
  weight: number; // in grams
  dimensions?: {
    length: number; // in cm
    width: number;
    height: number;
  };
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  CRYPTO = 'crypto',
  CASH = 'cash',
}

/**
 * Store-related types (replaces restaurant-specific types)
 */

export enum StoreType {
  RESTAURANT = 'restaurant',
  CLOTHING = 'clothing',
  ELECTRONICS = 'electronics',
  GROCERY = 'grocery',
  PHARMACY = 'pharmacy',
  BOOKS = 'books',
  SPORTS = 'sports',
  HOME_GARDEN = 'home_garden',
  BEAUTY = 'beauty',
  AUTOMOTIVE = 'automotive',
  PETS = 'pets',
  TOYS = 'toys',
  OTHER = 'other',
}

export enum StoreStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CLOSED = 'closed',
  PENDING = 'pending',
  PENDING_APPROVAL = 'pending_approval',
  SUSPENDED = 'suspended',
}

export enum CuisineType {
  ITALIAN = 'italian',
  MEXICAN = 'mexican',
  CHINESE = 'chinese',
  INDIAN = 'indian',
  AMERICAN = 'american',
  JAPANESE = 'japanese',
  THAI = 'thai',
  MEDITERRANEAN = 'mediterranean',
  FAST_FOOD = 'fast_food',
  VEGAN = 'vegan',
  VEGETARIAN = 'vegetarian',
  SEAFOOD = 'seafood',
  STEAKHOUSE = 'steakhouse',
  CAFE = 'cafe',
  DESSERT = 'dessert',
  OTHER = 'other',
}

export interface Store {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  storeType: StoreType;
  cuisineType?: CuisineType[]; // Only for restaurants
  address: Address;
  coordinates: Coordinates;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  openingHours: Record<string, { open: string; close: string }>;
  rating: number;
  ratingCount: number;
  priceRange: number; // 1-4, $ to $$$$
  imageUrl?: string;
  coverImageUrl?: string;
  bannerImages?: string[];
  status: StoreStatus;
  minimumOrderAmount?: number;
  deliveryFee?: number;
  estimatedDeliveryTime?: number; // in minutes
  featured: boolean;
  verified: boolean;
  businessLicense?: string;
  taxId?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  specialOffers?: string[];
  tags?: string[];
  returnPolicy?: string;
  shippingPolicy?: string;
  createdAt: string;
  updatedAt: string;
}

// Keep Restaurant interface for backward compatibility, extending Store
export interface Restaurant extends Store {
  cuisineType: CuisineType[];
}

export interface StoreItem {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string; // e.g., "Starters", "Main Course", "Desserts"
  imageUrl?: string;
  ingredients?: string[];
  nutritionalInfo?: {
    calories?: number;
    carbs?: number;
    protein?: number;
    fat?: number;
    allergens?: string[];
  };
  spicyLevel?: number; // 0-3
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  featured: boolean;
  available: boolean;
  preparationTime?: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

/**
 * Product-related types
 */

export enum ProductCategory {
  FOOD = 'food',
  CLOTHING = 'clothing',
  ELECTRONICS = 'electronics',
  HOME_GOODS = 'home_goods',
  HEALTH_BEAUTY = 'health_beauty',
  TOYS_GAMES = 'toys_games',
  SPORTS_OUTDOORS = 'sports_outdoors',
  BOOKS = 'books',
  GROCERIES = 'groceries',
  PETS = 'pets',
  OTHER = 'other',
}

/**
 * Analytics-related types
 */

export interface Analytics {
  id: string;
  storeId?: string;
  periodStart: string;
  periodEnd: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  deliveryMetrics: {
    totalDeliveries: number;
    droneDeliveries: number;
    riderDeliveries: number;
    averageDeliveryTime: number;
    deliverySuccessRate: number;
  };
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    totalCustomers: number;
  };
  restaurantAnalytics?: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    topMenuItems: Array<{
      itemId: string;
      itemName: string;
      totalSold: number;
      revenue: number;
    }>;
    peakHours: Array<{
      hour: number;
      orderCount: number;
    }>;
  };
  createdAt: string;
}
