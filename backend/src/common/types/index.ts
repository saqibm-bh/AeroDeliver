// Core enums for the delivery system
export enum UserRole {
  CUSTOMER = 'customer',
  RESTAURANT = 'restaurant',
  RIDER = 'rider',
  DRONE_OPERATOR = 'drone_operator',
  ADMIN = 'admin',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum DeliveryMethod {
  DRONE = 'drone',
  RIDER = 'rider',
}

export enum DeliveryStatus {
  ASSIGNED = 'assigned',
  EN_ROUTE_PICKUP = 'en_route_pickup',
  AT_RESTAURANT = 'at_restaurant',
  PICKED_UP = 'picked_up',
  EN_ROUTE_DELIVERY = 'en_route_delivery',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

export enum VehicleType {
  DRONE = 'drone',
  BIKE = 'bike',
  SCOOTER = 'scooter',
  CAR = 'car',
}

export enum RestaurantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

export enum CuisineType {
  ITALIAN = 'italian',
  CHINESE = 'chinese',
  INDIAN = 'indian',
  MEXICAN = 'mexican',
  AMERICAN = 'american',
  JAPANESE = 'japanese',
  THAI = 'thai',
  FRENCH = 'french',
  MEDITERRANEAN = 'mediterranean',
  FAST_FOOD = 'fast_food',
  DESSERTS = 'desserts',
  HEALTHY = 'healthy',
  VEGAN = 'vegan',
  OTHER = 'other',
}

export enum ProductCategory {
  MAIN_COURSE = 'main_course',
  APPETIZER = 'appetizer',
  DESSERT = 'dessert',
  BEVERAGE = 'beverage',
  SIDE_DISH = 'side_dish',
  SALAD = 'salad',
  SOUP = 'soup',
  SNACK = 'snack',
}

// Core interfaces
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  cuisine: CuisineType[];
  address: string;
  coordinates: Coordinates;
  phone: string;
  email: string;
  rating: number;
  totalRatings: number;
  isActive: boolean;
  status: RestaurantStatus;
  deliveryTime: number; // in minutes
  deliveryFee: number;
  minimumOrder: number;
  imageUrl?: string;
  openHours: {
    [key: string]: { open: string; close: string };
  };
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl?: string;
  isAvailable: boolean;
  preparationTime: number; // in minutes
  weight: number; // in grams
  allergens?: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  deliveryAddressId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  specialInstructions?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
  menuItem?: MenuItem;
}

export interface Delivery {
  id: string;
  orderId: string;
  vehicleId?: string;
  riderId?: string;
  method: DeliveryMethod;
  status: DeliveryStatus;
  pickupAddress: string;
  pickupCoordinates: Coordinates;
  deliveryAddress: string;
  deliveryCoordinates: Coordinates;
  distance: number; // in kilometers
  estimatedTime: number; // in minutes
  actualTime?: number;
  currentLocation?: Coordinates;
  trackingCode: string;
  assignedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  model: string;
  registrationNumber: string;
  capacity: {
    weight: number; // in kg
    distance: number; // in km
  };
  batteryLevel?: number; // for electric vehicles/drones
  isAvailable: boolean;
  currentLocation?: Coordinates;
  operatorId?: string;
  lastMaintenanceDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rider {
  id: string;
  userId: string;
  vehicleId?: string;
  isAvailable: boolean;
  currentLocation?: Coordinates;
  rating: number;
  totalDeliveries: number;
  earnings: number;
  status: 'active' | 'inactive' | 'busy';
  licenseNumber?: string;
  licenseExpiryDate?: string;
  backgroundCheckStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  restaurantAnalytics: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    popularItems: Array<{
      itemId: string;
      itemName: string;
      orderCount: number;
    }>;
  };
  deliveryAnalytics: {
    totalDeliveries: number;
    averageDeliveryTime: number;
    droneDeliveries: number;
    riderDeliveries: number;
    successRate: number;
  };
  dateRange: {
    from: string;
    to: string;
  };
}
