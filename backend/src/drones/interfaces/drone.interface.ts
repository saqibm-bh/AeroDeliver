export enum DroneType {
  QUADCOPTER = 'quadcopter',
  HEXACOPTER = 'hexacopter',
  OCTOCOPTER = 'octocopter',
  FIXED_WING = 'fixed_wing',
}

export enum DroneStatus {
  AVAILABLE = 'available',
  IN_DELIVERY = 'in_delivery',
  MAINTENANCE = 'maintenance',
  CHARGING = 'charging',
  OFFLINE = 'offline',
}

export interface Drone {
  id: string;
  modelId: string;
  serialNumber: string;
  name: string;
  droneType: DroneType;
  maxPayloadCapacity: number; // in kg
  maxFlightRange: number; // in km
  maxFlightTime: number; // in minutes
  batteryCapacity: number; // percentage
  currentLocation?: [number, number]; // [latitude, longitude]
  status: DroneStatus;
  homeBaseId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceRecord {
  id: string;
  droneId: string;
  maintenanceType: string;
  maintenanceDate: Date;
  description: string;
  technicianId: string;
  nextMaintenanceDate?: Date;
  createdAt: Date;
}

export interface DroneAssignment {
  id: string;
  droneId: string;
  orderId: string;
  assignedAt: Date;
  estimatedPickupTime?: Date;
  estimatedDeliveryTime?: Date;
  actualPickupTime?: Date;
  actualDeliveryTime?: Date;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  route?: [number, number][];
  distance?: number;
  completedAt?: Date;
}

export interface DroneRoute {
  waypoints: [number, number][]; // Array of [latitude, longitude] coordinates
  estimatedDistance: number; // in km
  estimatedDuration: number; // in minutes
  elevationProfile?: number[]; // Elevation at each waypoint (meters)
}

export interface NoFlyZone {
  id: string;
  name: string;
  boundary: [number, number][]; // Array of [latitude, longitude] coordinates defining the polygon
  reason?: string;
  startDate?: Date; // For temporary no-fly zones
  endDate?: Date; // For temporary no-fly zones
  minAltitude?: number; // Minimum altitude restriction in meters
  createdAt: Date;
  updatedAt: Date;
}

export interface WeatherRestriction {
  id: string;
  droneTypeId: string; // Applied to specific drone type
  maxWindSpeed: number; // km/h
  allowPrecipitation: boolean;
  minVisibility: number; // meters
  minTemperature?: number; // Celsius
  maxTemperature?: number; // Celsius
  updatedAt: Date;
}

export interface DroneModel {
  id: string;
  manufacturer: string;
  modelName: string;
  droneType: DroneType;
  defaultMaxPayload: number;
  defaultMaxRange: number;
  defaultMaxFlightTime: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  weightEmpty: number;
  maxTakeoffWeight: number;
  batteryCapacity: number; // in mAh
  createdAt: Date;
  updatedAt: Date;
}
