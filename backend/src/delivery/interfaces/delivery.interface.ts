export enum DeliveryType {
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

export interface Delivery {
  id: string;
  order_id: string;
  type: DeliveryType;
  status: DeliveryStatus;
  vehicle_id?: string;
  rider_id?: string;
  pickup_location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  delivery_location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  estimated_pickup_time?: string;
  actual_pickup_time?: string;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  distance_km: number;
  delivery_fee: number;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

// New interfaces for delivery intelligence
export interface DeliveryAssignmentResult {
  success: boolean;
  assignment?: {
    vehicleId: string;
    type: DeliveryType;
    estimatedPickupTime: Date;
    estimatedDeliveryTime: Date;
    estimatedCost: number;
    distanceToPickup?: number;
    totalDistance: number;
  };
  estimatedDeliveryTime?: Date;
  estimatedCost?: number;
  message?: string;
  estimatedAvailableTime?: Date;
  alternativeOptions?: any[];
  error?: any;
}

export interface WeatherCondition {
  condition:
    | 'clear'
    | 'cloudy'
    | 'light_rain'
    | 'heavy_rain'
    | 'thunderstorm'
    | 'snow'
    | 'heavy_snow'
    | 'fog'
    | 'extreme_weather';
  temperature?: number; // Added temperature property
  windSpeed: number; // km/h
  precipitation: number; // mm/h
  visibility: number; // km
  isDroneOperational: boolean;
  isRiderOperational: boolean;
}

export interface VehicleCapability {
  id: string;
  type: 'rider' | 'drone';
  maxWeight: number;
  maxDistance: number;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  batteryLevel?: number;
  isAvailable: boolean;
  estimatedAvailableTime?: Date;
  distanceToPickup?: number; // Added missing property
  score?: number; // Added for scoring
}

export interface ProductInfo {
  category: string;
  tags: string[];
}

export interface DeliveryConstraints {
  drone: {
    maxWeight: number;
    maxDistance: number;
    maxWindSpeed: number;
    minBatteryLevel: number;
    maxPackageSize: {
      length: number;
      width: number;
      height: number;
    };
    operatingHours: {
      start: number;
      end: number;
    };
    weatherRestrictions: string[];
  };
  rider: {
    maxWeight: number;
    maxDistance: number;
    maxPackageSize: {
      length: number;
      width: number;
      height: number;
    };
    operatingHours: {
      start: number;
      end: number;
    };
    weatherRestrictions: string[];
  };
}
