import { DeliveryType } from '../../delivery/interfaces/delivery.interface';

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Return distance with 2 decimal places
  return parseFloat(distance.toFixed(2));
}

/**
 * Convert degrees to radians
 * @param value Angle in degrees
 * @returns Angle in radians
 */
function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

/**
 * Calculate the delivery fee based on distance and delivery type
 * @param distanceKm Distance in kilometers
 * @param type Delivery type (drone or rider)
 * @returns Delivery fee in currency units
 */
export function calculateDeliveryFee(
  distanceKm: number,
  type: DeliveryType,
): number {
  // Base fee
  const baseFee = type === DeliveryType.DRONE ? 3.0 : 2.5;

  // Per km fee
  const perKmFee = type === DeliveryType.DRONE ? 1.0 : 0.8;

  // Calculate fee
  const fee = baseFee + distanceKm * perKmFee;

  // Apply minimum fee
  const minimumFee = type === DeliveryType.DRONE ? 5.0 : 4.0;

  // Return the higher of calculated fee or minimum fee, with 2 decimal places
  return parseFloat(Math.max(fee, minimumFee).toFixed(2));
}

/**
 * Calculate estimated delivery time based on distance and delivery type
 * @param distanceKm Distance in kilometers
 * @param type Delivery type (drone or rider)
 * @returns Estimated delivery time in minutes
 */
export function calculateEstimatedDeliveryTime(
  distanceKm: number,
  type: DeliveryType,
): number {
  // Base preparation time in minutes
  const preparationTime = 10;

  // Average speed in km/h
  const avgSpeed = type === DeliveryType.DRONE ? 30 : 20;

  // Convert km/h to minutes per km
  const minutesPerKm = 60 / avgSpeed;

  // Calculate travel time
  const travelTime = distanceKm * minutesPerKm;

  // Add buffer time
  const bufferTime = type === DeliveryType.DRONE ? 5 : 10;

  // Calculate total time
  const totalTime = preparationTime + travelTime + bufferTime;

  // Return rounded time
  return Math.ceil(totalTime);
}

/**
 * Check if an item is eligible for drone delivery based on weight and dimensions
 * @param weightGrams Item weight in grams
 * @param lengthCm Item length in cm
 * @param widthCm Item width in cm
 * @param heightCm Item height in cm
 * @returns Boolean indicating if the item is eligible for drone delivery
 */
export function isDroneDeliveryEligible(
  weightGrams: number,
  lengthCm: number = 0,
  widthCm: number = 0,
  heightCm: number = 0,
): boolean {
  // Maximum weight for drone delivery in grams
  const MAX_WEIGHT = 3000; // 3kg

  // Maximum dimensions for drone delivery in cm
  const MAX_LENGTH = 40;
  const MAX_WIDTH = 30;
  const MAX_HEIGHT = 20;

  // Check weight constraint
  if (weightGrams > MAX_WEIGHT) {
    return false;
  }

  // If dimensions are provided, check them too
  if (lengthCm > 0 && widthCm > 0 && heightCm > 0) {
    if (lengthCm > MAX_LENGTH || widthCm > MAX_WIDTH || heightCm > MAX_HEIGHT) {
      return false;
    }
  }

  return true;
}

/**
 * Format currency value for display
 * @param amount Amount to format
 * @param currency Currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Determine optimal delivery type based on order details
 * @param distanceKm Distance in kilometers
 * @param isTimeConstraint Whether there's a time constraint for delivery
 * @param itemsWeightGrams Total weight of items in grams
 * @returns Recommended delivery type
 */
export function getOptimalDeliveryType(
  distanceKm: number,
  isTimeConstraint: boolean,
  itemsWeightGrams: number,
): DeliveryType {
  if (distanceKm <= 5 && itemsWeightGrams <= 3000) {
    // For short distances and light packages, prefer drone delivery
    return DeliveryType.DRONE;
  } else {
    // For longer distances or heavier packages, use rider delivery
    return DeliveryType.RIDER;
  }
}
