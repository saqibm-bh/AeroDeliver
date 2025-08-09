export enum RiderStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  OFFLINE = 'offline',
  ON_BREAK = 'on_break',
  IN_TRANSIT = 'in_transit',
  MAINTENANCE = 'maintenance',
}

export enum VehicleType {
  MOTORCYCLE = 'motorcycle',
  BICYCLE = 'bicycle',
  SCOOTER = 'scooter',
  CAR = 'car',
  VAN = 'van',
}

export interface Rider {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleType: VehicleType;
  vehicleRegistration: string;
  currentLocation?: [number, number];
  status: RiderStatus;
  maxDeliveryRadius?: number;
  rating?: number;
  totalDeliveries?: number;
  joinedDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RiderAssignment {
  id: string;
  riderId: string;
  orderId: string;
  assignedAt: string;
  estimatedPickupTime?: string;
  estimatedDeliveryTime?: string;
  actualPickupTime?: string;
  actualDeliveryTime?: string;
  status: 'assigned' | 'picked_up' | 'delivered' | 'cancelled';
  route?: [number, number][];
  distance?: number;
  estimatedDuration?: number;
}

export interface RiderPerformanceMetrics {
  riderId: string;
  totalDeliveries: number;
  completedDeliveries: number;
  averageDeliveryTime: number;
  averageRating: number;
  onTimeDeliveryRate: number;
  totalDistance: number;
  activeHours: number;
  earnings: number;
  periodStart: string;
  periodEnd: string;
}
