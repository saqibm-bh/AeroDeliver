export enum VehicleType {
  DRONE = 'drone',
  BIKE = 'bike',
  SCOOTER = 'scooter',
  CAR = 'car',
}

export enum VehicleStatus {
  AVAILABLE = 'available',
  IN_USE = 'in_use',
  MAINTENANCE = 'maintenance',
  OFFLINE = 'offline',
}

export enum RiderStatus {
  AVAILABLE = 'available',
  ON_DELIVERY = 'on_delivery',
  OFFLINE = 'offline',
  BREAK = 'break',
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  model: string;
  brand: string;
  plateNumber?: string;
  status: VehicleStatus;
  batteryLevel?: number; // For electric vehicles/drones
  maxCapacity: number; // Weight in grams
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  assignedRiderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rider {
  id: string;
  userId: string; // Reference to user account
  status: RiderStatus;
  vehicleId?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  totalDeliveries: number;
  onlineHours: number;
  earnings: number;
  joinedAt: string;
  lastActiveAt: string;
}
