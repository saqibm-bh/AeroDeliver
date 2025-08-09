import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { FleetService } from '../../fleet/fleet.service';
import { ConfigService } from '@nestjs/config';
import { calculateDistance } from '../../common/utils/delivery.utils';
import {
  DeliveryType,
  DeliveryAssignmentResult,
  WeatherCondition,
  DeliveryConstraints,
  VehicleCapability,
} from '../interfaces/delivery.interface';

interface DeliveryAssignment {
  vehicleId: string;
  type: DeliveryType;
  estimatedPickupTime: Date;
  estimatedDeliveryTime: Date;
  estimatedCost: number;
  distanceToPickup?: number;
  totalDistance: number;
}

interface DeliveryAssignmentRequest {
  orderId: string;
  pickupLocation: { latitude: number; longitude: number };
  deliveryLocation: { latitude: number; longitude: number };
  packageWeight: number; // in kg
  packageDimensions: { length: number; width: number; height: number }; // in cm
  priorityLevel: 'low' | 'medium' | 'high' | 'urgent';
  timeConstraints?: {
    maxDeliveryTime?: number; // in minutes
    preferredDeliveryWindow?: { start: Date; end: Date };
  };
}

@Injectable()
export class DeliveryIntelligenceService {
  private readonly logger = new Logger(DeliveryIntelligenceService.name);

  // Delivery constraints configuration
  private readonly DELIVERY_CONSTRAINTS: DeliveryConstraints = {
    drone: {
      maxWeight: 5, // kg
      maxDistance: 15, // km
      maxWindSpeed: 25, // km/h
      minBatteryLevel: 30, // percentage
      maxPackageSize: { length: 40, width: 40, height: 30 }, // cm
      operatingHours: { start: 6, end: 22 }, // 24-hour format
      weatherRestrictions: ['heavy_rain', 'thunderstorm', 'heavy_snow', 'fog'],
    },
    rider: {
      maxWeight: 25, // kg
      maxDistance: 50, // km
      maxPackageSize: { length: 100, width: 80, height: 60 }, // cm
      operatingHours: { start: 0, end: 24 }, // 24/7
      weatherRestrictions: ['extreme_weather'], // only extreme conditions
    },
  };

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly fleetService: FleetService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Main entry point for intelligent delivery assignment
   */
  async assignOptimalDelivery(
    request: DeliveryAssignmentRequest,
  ): Promise<DeliveryAssignmentResult> {
    this.logger.log(
      `Processing delivery assignment for order: ${request.orderId}`,
    );

    try {
      // Step 1: Calculate delivery distance
      const distance = calculateDistance(
        request.pickupLocation.latitude,
        request.pickupLocation.longitude,
        request.deliveryLocation.latitude,
        request.deliveryLocation.longitude,
      );

      // Step 2: Analyze package characteristics
      const packageAnalysis = await this.analyzePackage(request);

      // Step 3: Check weather conditions
      const weatherCondition = await this.getWeatherConditions(
        request.deliveryLocation,
      );

      // Step 4: Determine eligible delivery types
      const eligibleTypes = this.determineEligibleDeliveryTypes(
        packageAnalysis,
        distance,
        weatherCondition,
      );

      if (eligibleTypes.length === 0) {
        throw new Error(
          'No suitable delivery method available for this package',
        );
      }

      // Step 5: Find available vehicles/riders
      const availableOptions = await this.findAvailableDeliveryOptions(
        eligibleTypes,
        request.pickupLocation,
        distance,
      );

      if (availableOptions.length === 0) {
        // Try to find next available option with estimated time
        const nextAvailable = await this.findNextAvailableOption(
          eligibleTypes,
          request.pickupLocation,
        );

        return {
          success: false,
          message: 'No delivery options currently available',
          estimatedAvailableTime: nextAvailable?.estimatedAvailableTime,
          alternativeOptions: nextAvailable ? [nextAvailable] : [],
        };
      }

      // Step 6: Optimize and select best option
      const optimizedAssignment = await this.optimizeDeliveryAssignment(
        availableOptions,
        request,
        distance,
      );

      // Step 7: Reserve the selected option
      await this.reserveDeliveryOption(optimizedAssignment);

      this.logger.log(
        `Successfully assigned ${optimizedAssignment.type} delivery for order ${request.orderId}`,
      );

      return {
        success: true,
        assignment: optimizedAssignment,
        estimatedDeliveryTime: optimizedAssignment.estimatedDeliveryTime,
        estimatedCost: optimizedAssignment.estimatedCost,
      };
    } catch (error: any) {
      this.logger.error(
        `Failed to assign delivery for order ${request.orderId}:`,
        error,
      );
      return {
        success: false,
        message: error.message || 'Failed to assign delivery',
        error: error,
      };
    }
  }

  /**
   * Analyze package characteristics for delivery eligibility with enhanced analysis
   */
  private async analyzePackage(request: DeliveryAssignmentRequest) {
    const { packageWeight, packageDimensions } = request;

    // Calculate package volume
    const packageVolume =
      packageDimensions.length *
      packageDimensions.width *
      packageDimensions.height;

    // Calculate package density (weight per volume)
    const packageDensity = packageWeight / (packageVolume / 1000000); // kg per cubic meter

    // Calculate dimensional weight (volumetric weight)
    const dimensionalWeight = packageVolume / 5000; // industry standard: 1 cubic cm = 0.0002 kg

    // Use the greater of actual weight or dimensional weight
    const chargeableWeight = Math.max(packageWeight, dimensionalWeight);

    // Analyze package shape and orientation
    const isSquare =
      Math.abs(packageDimensions.length - packageDimensions.width) < 5;
    const longestSide = Math.max(
      packageDimensions.length,
      packageDimensions.width,
      packageDimensions.height,
    );
    const shortestSide = Math.min(
      packageDimensions.length,
      packageDimensions.width,
      packageDimensions.height,
    );
    const aspectRatio = longestSide / shortestSide;

    // Calculate drone compatibility score (0-100)
    let droneScore = 100;
    if (packageWeight > this.DELIVERY_CONSTRAINTS.drone.maxWeight * 0.8) {
      droneScore -= 30; // Heavy package
    }
    if (
      longestSide >
      this.DELIVERY_CONSTRAINTS.drone.maxPackageSize.length * 0.9
    ) {
      droneScore -= 25; // Long package
    }
    if (aspectRatio > 3) {
      droneScore -= 15; // Awkward shape
    }
    if (packageDensity > 500) {
      droneScore -= 10; // Dense package
    }

    // Check for fragility
    const isFragile = await this.detectFragilePackage(request.orderId);
    if (isFragile) {
      droneScore -= 20; // Fragile items should prefer ground transportation
    }

    return {
      weight: packageWeight,
      dimensions: packageDimensions,
      volume: packageVolume,
      density: packageDensity,
      dimensionalWeight: dimensionalWeight,
      chargeableWeight: chargeableWeight,
      shape: {
        isSquare,
        aspectRatio,
        longestSide,
        shortestSide,
      },
      isDroneEligible: this.isPackageDroneEligible(
        packageWeight,
        packageDimensions,
      ),
      isRiderEligible: this.isPackageRiderEligible(
        packageWeight,
        packageDimensions,
      ),
      droneCompatibilityScore: Math.max(0, droneScore),
      riderCompatibilityScore: Math.min(100, 100 - droneScore + 40), // Inverse relationship with buffer
      fragileIndicators: isFragile,
    };
  }

  /**
   * Check if package meets drone delivery requirements
   */
  private isPackageDroneEligible(
    weight: number, 
    dimensions: { length: number; width: number; height: number }
  ): boolean {
    const constraints = this.DELIVERY_CONSTRAINTS.drone;

    return (
      weight <= constraints.maxWeight &&
      dimensions.length <= constraints.maxPackageSize.length &&
      dimensions.width <= constraints.maxPackageSize.width &&
      dimensions.height <= constraints.maxPackageSize.height
    );
  }

  /**
   * Check if package meets rider delivery requirements
   */
  private isPackageRiderEligible(
    weight: number, 
    dimensions: { length: number; width: number; height: number }
  ): boolean {
    const constraints = this.DELIVERY_CONSTRAINTS.rider;

    return (
      weight <= constraints.maxWeight &&
      dimensions.length <= constraints.maxPackageSize.length &&
      dimensions.width <= constraints.maxPackageSize.width &&
      dimensions.height <= constraints.maxPackageSize.height
    );
  }

  /**
   * Detect if package contains fragile items
   */
  private async detectFragilePackage(orderId: string): Promise<boolean> {
    const { data: orderItems } = await this.supabaseService.client
      .from('order_items')
      .select('product:products(category, tags)')
      .eq('order_id', orderId);

    if (!orderItems) return false;

    return orderItems.some(
      (item: any) =>
        item.product?.category?.toLowerCase().includes('electronics') ||
        item.product?.tags?.some(
          (tag: string) =>
            tag.toLowerCase().includes('fragile') ||
            tag.toLowerCase().includes('glass') ||
            tag.toLowerCase().includes('delicate'),
        ),
    );
  }

  /**
   * Get current weather conditions for delivery location
   */
  private async getWeatherConditions(location: {
    latitude: number;
    longitude: number;
  }): Promise<WeatherCondition> {
    // In production, integrate with a weather API (OpenWeatherMap, WeatherAPI, etc.)
    try {
      // Get API key from config
      const apiKey = this.configService.get<string>('WEATHER_API_KEY');

      if (!apiKey) {
        throw new Error('Weather API key not configured');
      }

      // Prepare API request to OpenWeatherMap
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${apiKey}&units=metric`;

      // In a production environment, use HttpService from @nestjs/axios
      // For now, using a simulated response based on time of day and location

      // Simulate weather conditions based on latitude (closer to equator = warmer)
      // and time of day
      const now = new Date();
      const hour = now.getHours();
      const isNighttime = hour < 6 || hour > 20;
      const summerHemisphere =
        now.getMonth() >= 4 && now.getMonth() <= 9
          ? location.latitude > 0
          : location.latitude < 0;

      // More realistic weather simulation
      let condition: string;
      let windSpeed: number;
      let precipitation: number;
      let visibility: number;
      let temperature: number;

      // Season and location based weather
      if (Math.abs(location.latitude) > 60) {
        // Polar regions
        temperature = summerHemisphere
          ? -5 + Math.random() * 15
          : -30 + Math.random() * 15;
        windSpeed = 15 + Math.random() * 40;
        condition = Math.random() > 0.6 ? 'snow' : 'cloudy';
        precipitation = condition === 'snow' ? 1 + Math.random() * 5 : 0;
        visibility = 3 + Math.random() * 7;
      } else if (Math.abs(location.latitude) < 23) {
        // Tropical regions
        temperature = 25 + Math.random() * 10;
        windSpeed = 5 + Math.random() * 15;
        condition =
          Math.random() > 0.7
            ? 'clear'
            : Math.random() > 0.5
              ? 'rain'
              : 'cloudy';
        precipitation = condition === 'rain' ? 0.5 + Math.random() * 10 : 0;
        visibility =
          condition === 'rain' ? 5 + Math.random() * 5 : 8 + Math.random() * 7;
      } else {
        // Temperate regions
        temperature = summerHemisphere
          ? 15 + Math.random() * 20
          : 0 + Math.random() * 15;
        windSpeed = 5 + Math.random() * 25;
        condition =
          Math.random() > 0.6
            ? 'clear'
            : Math.random() > 0.5
              ? 'rain'
              : 'cloudy';
        precipitation = condition === 'rain' ? 0.5 + Math.random() * 5 : 0;
        visibility =
          condition === 'rain' ? 5 + Math.random() * 5 : 7 + Math.random() * 8;
      }

      // Time of day adjustments
      if (isNighttime) {
        temperature -= 5 + Math.random() * 5;
        windSpeed *= 0.8;
      }

      // Random severe weather events (small chance)
      if (Math.random() > 0.95) {
        condition = Math.random() > 0.5 ? 'thunderstorm' : 'heavy_rain';
        windSpeed += 15 + Math.random() * 25;
        precipitation = 10 + Math.random() * 30;
        visibility = 1 + Math.random() * 3;
      }

      // Create weather response
      const weatherResponse = {
        condition,
        windSpeed,
        precipitation,
        visibility,
        temperature,
      };

      return {
        condition: weatherResponse.condition as any,
        windSpeed: weatherResponse.windSpeed,
        precipitation: weatherResponse.precipitation,
        visibility: weatherResponse.visibility,
        temperature: weatherResponse.temperature,
        isDroneOperational: this.isWeatherSuitableForDrone(weatherResponse),
        isRiderOperational: this.isWeatherSuitableForRider(weatherResponse),
      };
    } catch (error) {
      this.logger.warn(
        'Failed to fetch weather data, assuming clear conditions',
      );
      return {
        condition: 'clear',
        windSpeed: 0,
        precipitation: 0,
        visibility: 10,
        temperature: 22,
        isDroneOperational: true,
        isRiderOperational: true,
      };
    }
  }

  /**
   * Check if weather is suitable for drone operations
   */
  private isWeatherSuitableForDrone(weather: any): boolean {
    const constraints = this.DELIVERY_CONSTRAINTS.drone;

    return (
      weather.windSpeed <= constraints.maxWindSpeed &&
      !constraints.weatherRestrictions.includes(weather.condition) &&
      weather.visibility >= 5 // minimum visibility for drone operations
    );
  }

  /**
   * Check if weather is suitable for rider operations
   */
  private isWeatherSuitableForRider(weather: any): boolean {
    const constraints = this.DELIVERY_CONSTRAINTS.rider;

    return !constraints.weatherRestrictions.includes(weather.condition);
  }

  /**
   * Determine which delivery types are eligible based on constraints
   */
  private determineEligibleDeliveryTypes(
    packageAnalysis: any,
    distance: number,
    weather: WeatherCondition,
  ): DeliveryType[] {
    const eligibleTypes: DeliveryType[] = [];

    // Check drone eligibility
    if (
      packageAnalysis.isDroneEligible &&
      distance <= this.DELIVERY_CONSTRAINTS.drone.maxDistance &&
      weather.isDroneOperational &&
      this.isWithinOperatingHours('drone')
    ) {
      eligibleTypes.push(DeliveryType.DRONE);
    }

    // Check rider eligibility
    if (
      packageAnalysis.isRiderEligible &&
      distance <= this.DELIVERY_CONSTRAINTS.rider.maxDistance &&
      weather.isRiderOperational &&
      this.isWithinOperatingHours('rider')
    ) {
      eligibleTypes.push(DeliveryType.RIDER);
    }

    return eligibleTypes;
  }

  /**
   * Check if current time is within operating hours for delivery type
   */
  private isWithinOperatingHours(type: 'drone' | 'rider'): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const constraints = this.DELIVERY_CONSTRAINTS[type];

    return (
      currentHour >= constraints.operatingHours.start &&
      currentHour < constraints.operatingHours.end
    );
  }

  /**
   * Find available delivery options from fleet
   */
  private async findAvailableDeliveryOptions(
    eligibleTypes: DeliveryType[],
    pickupLocation: { latitude: number; longitude: number },
    deliveryDistance: number,
  ): Promise<VehicleCapability[]> {
    const availableOptions: VehicleCapability[] = [];

    for (const type of eligibleTypes) {
      if (type === DeliveryType.DRONE) {
        const drones = await this.getAvailableDrones(
          pickupLocation,
          deliveryDistance,
        );
        availableOptions.push(...drones);
      } else if (type === DeliveryType.RIDER) {
        const riders = await this.getAvailableRiders(
          pickupLocation,
          deliveryDistance,
        );
        availableOptions.push(...riders);
      }
    }

    return availableOptions;
  }

  /**
   * Get available drones within operational range
   */
  private async getAvailableDrones(
    pickupLocation: { latitude: number; longitude: number },
    deliveryDistance: number,
  ): Promise<VehicleCapability[]> {
    const { data: drones } = await this.supabaseService.client
      .from('drones')
      .select('*')
      .eq('status', 'available')
      .gte('battery_level', this.DELIVERY_CONSTRAINTS.drone.minBatteryLevel);

    if (!drones) return [];

    return drones
      .map((drone) => {
        const distanceToPickup = calculateDistance(
          drone.current_latitude,
          drone.current_longitude,
          pickupLocation.latitude,
          pickupLocation.longitude,
        );

        const totalDistance = distanceToPickup + deliveryDistance;

        // Check if drone can handle the total distance
        if (totalDistance <= drone.max_range) {
          return {
            id: drone.id,
            type: 'drone' as const,
            maxWeight: drone.payload_capacity,
            maxDistance: drone.max_range,
            currentLocation: {
              latitude: drone.current_latitude,
              longitude: drone.current_longitude,
            },
            batteryLevel: drone.battery_level,
            isAvailable: true,
            distanceToPickup,
          };
        }
        return null;
      })
      .filter(Boolean) as VehicleCapability[];
  }

  /**
   * Get available riders within operational range
   */
  private async getAvailableRiders(
    pickupLocation: { latitude: number; longitude: number },
    deliveryDistance: number,
  ): Promise<VehicleCapability[]> {
    const { data: riders } = await this.supabaseService.client
      .from('riders')
      .select('*')
      .eq('status', 'available');

    if (!riders) return [];

    return riders
      .map((rider) => {
        const distanceToPickup = calculateDistance(
          rider.current_location[0],
          rider.current_location[1],
          pickupLocation.latitude,
          pickupLocation.longitude,
        );

        const totalDistance = distanceToPickup + deliveryDistance;

        // Check if rider can handle the total distance
        if (
          totalDistance <=
          (rider.max_delivery_radius ||
            this.DELIVERY_CONSTRAINTS.rider.maxDistance)
        ) {
          return {
            id: rider.id,
            type: 'rider' as const,
            maxWeight: this.DELIVERY_CONSTRAINTS.rider.maxWeight,
            maxDistance:
              rider.max_delivery_radius ||
              this.DELIVERY_CONSTRAINTS.rider.maxDistance,
            currentLocation: {
              latitude: rider.current_location[0],
              longitude: rider.current_location[1],
            },
            isAvailable: true,
            distanceToPickup,
          };
        }
        return null;
      })
      .filter(Boolean) as VehicleCapability[];
  }

  /**
   * Find next available option when no immediate options exist
   */
  private async findNextAvailableOption(
    eligibleTypes: DeliveryType[],
    pickupLocation: { latitude: number; longitude: number },
  ): Promise<VehicleCapability | null> {
    // This would query for vehicles that will be available soon
    // For now, return a basic estimate
    return {
      id: 'next_available',
      type: eligibleTypes.includes(DeliveryType.DRONE) ? 'drone' : 'rider',
      maxWeight: 0,
      maxDistance: 0,
      currentLocation: pickupLocation,
      isAvailable: false,
      estimatedAvailableTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    };
  }

  /**
   * Optimize and select the best delivery assignment
   */
  private async optimizeDeliveryAssignment(
    availableOptions: VehicleCapability[],
    request: DeliveryAssignmentRequest,
    distance: number,
  ): Promise<DeliveryAssignment> {
    // Score each option based on multiple factors
    const scoredOptions = availableOptions.map((option) => {
      let score = 0;

      // Distance factor (closer is better)
      const distanceScore = Math.max(
        0,
        100 - (option.distanceToPickup || 0) * 2,
      );
      score += distanceScore * 0.3;

      // Speed factor (drones are generally faster)
      const speedScore = option.type === 'drone' ? 100 : 80;
      score += speedScore * 0.25;

      // Cost factor (drones might be cheaper for short distances)
      const costScore = option.type === 'drone' && distance < 5 ? 100 : 70;
      score += costScore * 0.25;

      // Priority factor
      const priorityMultiplier =
        request.priorityLevel === 'urgent'
          ? 1.2
          : request.priorityLevel === 'high'
            ? 1.1
            : 1.0;
      score *= priorityMultiplier;

      // Battery/availability factor
      const availabilityScore = option.batteryLevel
        ? Math.min(100, option.batteryLevel)
        : 100;
      score += availabilityScore * 0.2;

      return { ...option, score };
    });

    // Sort by score (highest first)
    scoredOptions.sort((a, b) => b.score - a.score);

    const bestOption = scoredOptions[0];

    // Calculate estimated times and cost
    const estimatedPickupTime = this.calculateEstimatedPickupTime(bestOption);
    const estimatedDeliveryTime = this.calculateEstimatedDeliveryTime(
      bestOption,
      distance,
      estimatedPickupTime,
    );
    const estimatedCost = this.calculateDeliveryCost(
      bestOption.type as DeliveryType,
      distance,
    );

    return {
      vehicleId: bestOption.id,
      type:
        bestOption.type === 'drone' ? DeliveryType.DRONE : DeliveryType.RIDER,
      estimatedPickupTime,
      estimatedDeliveryTime,
      estimatedCost,
      distanceToPickup: bestOption.distanceToPickup,
      totalDistance: (bestOption.distanceToPickup || 0) + distance,
    };
  }

  /**
   * Calculate estimated pickup time
   */
  private calculateEstimatedPickupTime(option: VehicleCapability): Date {
    const baseSpeed = option.type === 'drone' ? 50 : 30; // km/h
    const travelTimeMinutes = ((option.distanceToPickup || 0) / baseSpeed) * 60;
    const bufferMinutes = 5; // preparation time

    return new Date(
      Date.now() + (travelTimeMinutes + bufferMinutes) * 60 * 1000,
    );
  }

  /**
   * Calculate estimated delivery time
   */
  private calculateEstimatedDeliveryTime(
    option: VehicleCapability,
    deliveryDistance: number,
    pickupTime: Date,
  ): Date {
    const baseSpeed = option.type === 'drone' ? 50 : 30; // km/h
    const deliveryTimeMinutes = (deliveryDistance / baseSpeed) * 60;
    const bufferMinutes = option.type === 'drone' ? 2 : 5; // handling time

    return new Date(
      pickupTime.getTime() + (deliveryTimeMinutes + bufferMinutes) * 60 * 1000,
    );
  }

  /**
   * Calculate delivery cost based on type and distance
   */
  private calculateDeliveryCost(type: DeliveryType, distance: number): number {
    const baseFee = type === DeliveryType.DRONE ? 3.99 : 2.99;
    const perKmRate = type === DeliveryType.DRONE ? 0.75 : 0.5;

    return baseFee + distance * perKmRate;
  }

  /**
   * Reserve the selected delivery option
   */
  private async reserveDeliveryOption(assignment: any): Promise<void> {
    const tableName =
      assignment.type === DeliveryType.DRONE ? 'drones' : 'riders';

    await this.supabaseService.client
      .from(tableName)
      .update({
        status: 'assigned',
        updated_at: new Date().toISOString(),
      })
      .eq('id', assignment.vehicleId);
  }
}
