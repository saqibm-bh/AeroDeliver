import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { DeliveryType } from '../interfaces/delivery.interface';

interface CostCalculationRequest {
  deliveryType: DeliveryType;
  distance: number;
  weight: number;
  priority: 'standard' | 'express' | 'urgent';
  timeOfDay: 'peak' | 'off-peak';
  weather: 'good' | 'poor' | 'extreme';
  packageDimensions?: {
    length: number;
    width: number;
    height: number;
  };
  specialServices?: {
    fragileHandling?: boolean;
    coldChain?: boolean;
    signature?: boolean;
    insurance?: number;
  };
  orderValue?: number; // Total value of the order in currency units
}

interface CostBreakdown {
  baseFee: number;
  distanceFee: number;
  weightFee: number;
  priorityFee: number;
  peakTimeFee: number;
  weatherFee: number;
  specialServicesFee: number;
  insuranceFee: number;
  subtotal: number;
  taxes: number;
  total: number;
  currency: string;
}

interface DynamicPricing {
  demandMultiplier: number;
  supplyMultiplier: number;
  weatherMultiplier: number;
  timeMultiplier: number;
  finalMultiplier: number;
}

@Injectable()
export class DeliveryCostCalculationService {
  private readonly logger = new Logger(DeliveryCostCalculationService.name);

  // Base pricing configuration
  private readonly PRICING_CONFIG = {
    drone: {
      baseFee: 4.99,
      perKmRate: 0.75,
      perKgRate: 0.25,
      maxFreeWeight: 1.0, // kg
      maxFreeDistance: 2.0, // km
    },
    rider: {
      baseFee: 2.99,
      perKmRate: 0.5,
      perKgRate: 0.15,
      maxFreeWeight: 2.0, // kg
      maxFreeDistance: 1.0, // km
    },
    priorityMultipliers: {
      standard: 1.0,
      express: 1.5,
      urgent: 2.0,
    },
    timeMultipliers: {
      'off-peak': 1.0,
      peak: 1.3,
    },
    weatherMultipliers: {
      good: 1.0,
      poor: 1.2,
      extreme: 1.8,
    },
    specialServices: {
      fragileHandling: 2.5,
      coldChain: 5.0,
      signature: 1.5,
      insuranceRate: 0.02, // 2% of insured value
    },
    taxes: {
      rate: 0.08, // 8% tax rate
      minimum: 0.5,
    },
  };

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Calculate comprehensive delivery cost with dynamic pricing
   */
  async calculateDeliveryCost(
    request: CostCalculationRequest,
  ): Promise<CostBreakdown> {
    this.logger.log(
      `Calculating cost for ${request.deliveryType} delivery: ${request.distance}km, ${request.weight}kg`,
    );

    try {
      // Step 1: Calculate base cost components
      const baseCost = await this.calculateBaseCost(request);

      // Step 2: Apply dynamic pricing
      const dynamicPricing = await this.calculateDynamicPricing(request);

      // Step 3: Calculate special services
      const specialServicesCost = this.calculateSpecialServicesCost(
        request.specialServices,
      );

      // Step 4: Calculate insurance
      const insuranceCost = this.calculateInsuranceCost(
        request.specialServices?.insurance,
      );

      // Step 5: Build cost breakdown
      const subtotal =
        (baseCost.baseFee +
          baseCost.distanceFee +
          baseCost.weightFee +
          baseCost.priorityFee +
          baseCost.peakTimeFee +
          baseCost.weatherFee +
          specialServicesCost +
          insuranceCost) *
        dynamicPricing.finalMultiplier;

      const taxes = Math.max(
        subtotal * this.PRICING_CONFIG.taxes.rate,
        this.PRICING_CONFIG.taxes.minimum,
      );

      const total = subtotal + taxes;

      const breakdown: CostBreakdown = {
        baseFee: parseFloat(baseCost.baseFee.toFixed(2)),
        distanceFee: parseFloat(baseCost.distanceFee.toFixed(2)),
        weightFee: parseFloat(baseCost.weightFee.toFixed(2)),
        priorityFee: parseFloat(baseCost.priorityFee.toFixed(2)),
        peakTimeFee: parseFloat(baseCost.peakTimeFee.toFixed(2)),
        weatherFee: parseFloat(baseCost.weatherFee.toFixed(2)),
        specialServicesFee: parseFloat(specialServicesCost.toFixed(2)),
        insuranceFee: parseFloat(insuranceCost.toFixed(2)),
        subtotal: parseFloat(subtotal.toFixed(2)),
        taxes: parseFloat(taxes.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        currency: 'USD',
      };

      // Step 6: Store pricing data for analytics
      await this.storePricingCalculation(request, breakdown, dynamicPricing);

      this.logger.log(
        `Cost calculated: $${breakdown.total} (base: $${breakdown.subtotal}, taxes: $${breakdown.taxes})`,
      );

      return breakdown;
    } catch (error) {
      this.logger.error('Failed to calculate delivery cost:', error);
      throw new Error('Cost calculation failed');
    }
  }

  /**
   * Calculate base cost components
   */
  private async calculateBaseCost(request: CostCalculationRequest) {
    const config =
      this.PRICING_CONFIG[
        request.deliveryType === DeliveryType.DRONE ? 'drone' : 'rider'
      ];

    // Base fee
    const baseFee = config.baseFee;

    // Distance fee (only charge for distance above free tier)
    const chargeableDistance = Math.max(
      0,
      request.distance - config.maxFreeDistance,
    );
    const distanceFee = chargeableDistance * config.perKmRate;

    // Weight fee (only charge for weight above free tier)
    const chargeableWeight = Math.max(0, request.weight - config.maxFreeWeight);
    const weightFee = chargeableWeight * config.perKgRate;

    // Priority fee
    const priorityMultiplier =
      this.PRICING_CONFIG.priorityMultipliers[request.priority];
    const priorityFee = (baseFee + distanceFee) * (priorityMultiplier - 1);

    // Peak time fee
    const timeMultiplier =
      this.PRICING_CONFIG.timeMultipliers[request.timeOfDay];
    const peakTimeFee = (baseFee + distanceFee) * (timeMultiplier - 1);

    // Weather fee
    const weatherMultiplier =
      this.PRICING_CONFIG.weatherMultipliers[request.weather];
    const weatherFee = (baseFee + distanceFee) * (weatherMultiplier - 1);

    return {
      baseFee,
      distanceFee,
      weightFee,
      priorityFee,
      peakTimeFee,
      weatherFee,
    };
  }

  /**
   * Calculate dynamic pricing based on demand and supply
   */
  private async calculateDynamicPricing(
    request: CostCalculationRequest,
  ): Promise<DynamicPricing> {
    // Get current demand metrics
    const demandMultiplier = await this.calculateDemandMultiplier(
      request.deliveryType,
    );

    // Get current supply metrics
    const supplyMultiplier = await this.calculateSupplyMultiplier(
      request.deliveryType,
    );

    // Weather impact on pricing
    const weatherMultiplier = this.getWeatherPricingMultiplier(request.weather);

    // Time-based pricing
    const timeMultiplier = this.getTimePricingMultiplier();

    // Combine all multipliers with caps
    const finalMultiplier = Math.min(
      Math.max(
        demandMultiplier *
          supplyMultiplier *
          weatherMultiplier *
          timeMultiplier,
        0.8, // Minimum 80% of base price
      ),
      2.5, // Maximum 250% of base price
    );

    return {
      demandMultiplier,
      supplyMultiplier,
      weatherMultiplier,
      timeMultiplier,
      finalMultiplier,
    };
  }

  /**
   * Calculate demand-based pricing multiplier
   */
  private async calculateDemandMultiplier(
    deliveryType: DeliveryType,
  ): Promise<number> {
    try {
      // Get current hour active orders
      const currentHour = new Date();
      const hourStart = new Date(currentHour);
      hourStart.setMinutes(0, 0, 0);
      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hourEnd.getHours() + 1);

      const { data: activeOrders } = await this.supabaseService.client
        .from('deliveries')
        .select('id')
        .eq('type', deliveryType)
        .gte('created_at', hourStart.toISOString())
        .lt('created_at', hourEnd.toISOString())
        .in('status', ['pending', 'assigned', 'in_progress']);

      const orderCount = activeOrders?.length || 0;

      // Calculate multiplier based on demand
      // 0-5 orders: 1.0x, 6-15 orders: 1.1x, 16-30 orders: 1.2x, 30+ orders: 1.3x
      if (orderCount <= 5) return 1.0;
      if (orderCount <= 15) return 1.1;
      if (orderCount <= 30) return 1.2;
      return 1.3;
    } catch (error) {
      this.logger.warn(
        'Failed to calculate demand multiplier, using default:',
        error,
      );
      return 1.0;
    }
  }

  /**
   * Calculate supply-based pricing multiplier
   */
  private async calculateSupplyMultiplier(
    deliveryType: DeliveryType,
  ): Promise<number> {
    try {
      const tableName =
        deliveryType === DeliveryType.DRONE ? 'drones' : 'riders';

      // Get available vehicles
      const { data: available } = await this.supabaseService.client
        .from(tableName)
        .select('id')
        .eq('status', 'available');

      // Get total vehicles
      const { data: total } = await this.supabaseService.client
        .from(tableName)
        .select('id');

      const availableCount = available?.length || 0;
      const totalCount = total?.length || 1;
      const availabilityRatio = availableCount / totalCount;

      // Calculate multiplier based on supply
      // >80% available: 0.95x, 60-80%: 1.0x, 40-60%: 1.1x, 20-40%: 1.2x, <20%: 1.3x
      if (availabilityRatio > 0.8) return 0.95;
      if (availabilityRatio > 0.6) return 1.0;
      if (availabilityRatio > 0.4) return 1.1;
      if (availabilityRatio > 0.2) return 1.2;
      return 1.3;
    } catch (error) {
      this.logger.warn(
        'Failed to calculate supply multiplier, using default:',
        error,
      );
      return 1.0;
    }
  }

  /**
   * Get weather-based pricing multiplier
   */
  private getWeatherPricingMultiplier(weather: string): number {
    switch (weather) {
      case 'poor':
        return 1.1;
      case 'extreme':
        return 1.3;
      default:
        return 1.0;
    }
  }

  /**
   * Get time-based pricing multiplier
   */
  private getTimePricingMultiplier(): number {
    const currentHour = new Date().getHours();

    // Peak hours: 7-9 AM and 5-8 PM
    if (
      (currentHour >= 7 && currentHour <= 9) ||
      (currentHour >= 17 && currentHour <= 20)
    ) {
      return 1.15;
    }

    // Late night hours: 10 PM - 6 AM
    if (currentHour >= 22 || currentHour <= 6) {
      return 1.25;
    }

    return 1.0;
  }

  /**
   * Calculate special services cost
   */
  private calculateSpecialServicesCost(
    specialServices?: CostCalculationRequest['specialServices'],
  ): number {
    if (!specialServices) return 0;

    let cost = 0;
    const config = this.PRICING_CONFIG.specialServices;

    if (specialServices.fragileHandling) cost += config.fragileHandling;
    if (specialServices.coldChain) cost += config.coldChain;
    if (specialServices.signature) cost += config.signature;

    return cost;
  }

  /**
   * Calculate insurance cost
   */
  private calculateInsuranceCost(insuranceValue?: number): number {
    if (!insuranceValue || insuranceValue <= 0) return 0;

    const rate = this.PRICING_CONFIG.specialServices.insuranceRate;
    return insuranceValue * rate;
  }

  /**
   * Store pricing calculation for analytics
   */
  private async storePricingCalculation(
    request: CostCalculationRequest,
    breakdown: CostBreakdown,
    dynamicPricing: DynamicPricing,
  ): Promise<void> {
    try {
      await this.supabaseService.client.from('pricing_calculations').insert({
        delivery_type: request.deliveryType,
        distance: request.distance,
        weight: request.weight,
        priority: request.priority,
        time_of_day: request.timeOfDay,
        weather: request.weather,
        base_fee: breakdown.baseFee,
        distance_fee: breakdown.distanceFee,
        weight_fee: breakdown.weightFee,
        priority_fee: breakdown.priorityFee,
        peak_time_fee: breakdown.peakTimeFee,
        weather_fee: breakdown.weatherFee,
        special_services_fee: breakdown.specialServicesFee,
        insurance_fee: breakdown.insuranceFee,
        subtotal: breakdown.subtotal,
        taxes: breakdown.taxes,
        total: breakdown.total,
        demand_multiplier: dynamicPricing.demandMultiplier,
        supply_multiplier: dynamicPricing.supplyMultiplier,
        weather_multiplier: dynamicPricing.weatherMultiplier,
        time_multiplier: dynamicPricing.timeMultiplier,
        final_multiplier: dynamicPricing.finalMultiplier,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.warn('Failed to store pricing calculation:', error);
      // Don't throw here, as this is not critical to the operation
    }
  }

  /**
   * Get pricing estimates for comparison
   */
  async getPricingEstimates(
    distance: number,
    weight: number,
    priority: 'standard' | 'express' | 'urgent' = 'standard',
  ): Promise<{
    drone: CostBreakdown;
    rider: CostBreakdown;
    savings: number;
    recommendation: 'drone' | 'rider';
  }> {
    const baseRequest: Omit<CostCalculationRequest, 'deliveryType'> = {
      distance,
      weight,
      priority,
      timeOfDay: this.getCurrentTimeCategory(),
      weather: 'good', // assume good weather for estimates
    };

    const [droneCost, riderCost] = await Promise.all([
      this.calculateDeliveryCost({
        ...baseRequest,
        deliveryType: DeliveryType.DRONE,
      }),
      this.calculateDeliveryCost({
        ...baseRequest,
        deliveryType: DeliveryType.RIDER,
      }),
    ]);

    const savings = Math.abs(droneCost.total - riderCost.total);
    const recommendation =
      droneCost.total <= riderCost.total ? 'drone' : 'rider';

    return {
      drone: droneCost,
      rider: riderCost,
      savings: parseFloat(savings.toFixed(2)),
      recommendation,
    };
  }

  /**
   * Get current time category
   */
  private getCurrentTimeCategory(): 'peak' | 'off-peak' {
    const currentHour = new Date().getHours();

    // Peak hours: 7-9 AM and 5-8 PM
    if (
      (currentHour >= 7 && currentHour <= 9) ||
      (currentHour >= 17 && currentHour <= 20)
    ) {
      return 'peak';
    }

    return 'off-peak';
  }

  /**
   * Get historical pricing trends
   */
  async getPricingTrends(
    deliveryType: DeliveryType,
    days: number = 30,
  ): Promise<any[]> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const { data, error } = await this.supabaseService.client
      .from('pricing_calculations')
      .select('*')
      .eq('delivery_type', deliveryType)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      this.logger.error('Failed to fetch pricing trends:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Calculate average pricing for a time period
   */
  async getAveragePricing(
    deliveryType: DeliveryType,
    distance: number,
    weight: number,
    days: number = 7,
  ): Promise<number> {
    const trends = await this.getPricingTrends(deliveryType, days);

    // Filter for similar distance and weight
    const similarDeliveries = trends.filter(
      (t) =>
        Math.abs(t.distance - distance) <= 2 && // within 2km
        Math.abs(t.weight - weight) <= 1, // within 1kg
    );

    if (similarDeliveries.length === 0) {
      // Fallback to current calculation
      const estimate = await this.calculateDeliveryCost({
        deliveryType,
        distance,
        weight,
        priority: 'standard',
        timeOfDay: 'off-peak',
        weather: 'good',
      });
      return estimate.total;
    }

    const averageTotal =
      similarDeliveries.reduce((sum, delivery) => sum + delivery.total, 0) /
      similarDeliveries.length;

    return parseFloat(averageTotal.toFixed(2));
  }

  /**
   * Market-based dynamic pricing with surge pricing during high demand
   */
  async calculateMarketBasedPricing(request: CostCalculationRequest): Promise<{
    standardPrice: number;
    marketPrice: number;
    surgeMultiplier: number;
  }> {
    try {
      // Get base pricing
      const standardPricing = await this.calculateDeliveryCost(request);

      // Analyze market conditions for surge pricing
      const marketConditions = await this.analyzeMarketConditions(
        request.deliveryType,
      );

      // Calculate surge multiplier
      let surgeMultiplier = 1.0;

      // Apply demand surge
      if (marketConditions.demandLevel === 'high') {
        surgeMultiplier *= 1.5;
      } else if (marketConditions.demandLevel === 'very_high') {
        surgeMultiplier *= 2.0;
      }

      // Apply supply constraints
      if (marketConditions.supplyLevel === 'low') {
        surgeMultiplier *= 1.3;
      } else if (marketConditions.supplyLevel === 'very_low') {
        surgeMultiplier *= 1.7;
      }

      // Apply special event multipliers
      if (marketConditions.specialEvents.length > 0) {
        surgeMultiplier *= 1.2;
      }

      // Apply time-based adjustments (e.g., late night premium)
      const currentHour = new Date().getHours();
      if (currentHour >= 22 || currentHour <= 5) {
        surgeMultiplier *= 1.25;
      }

      // Cap the surge multiplier
      surgeMultiplier = Math.min(surgeMultiplier, 3.0);

      // Calculate final market price
      const marketPrice = standardPricing.total * surgeMultiplier;

      return {
        standardPrice: standardPricing.total,
        marketPrice: parseFloat(marketPrice.toFixed(2)),
        surgeMultiplier: parseFloat(surgeMultiplier.toFixed(2)),
      };
    } catch (error) {
      this.logger.error('Failed to calculate market-based pricing:', error);
      // Fallback to standard pricing if market pricing fails
      const standardPricing = await this.calculateDeliveryCost(request);
      return {
        standardPrice: standardPricing.total,
        marketPrice: standardPricing.total,
        surgeMultiplier: 1.0,
      };
    }
  }

  /**
   * Analyze current market conditions for dynamic pricing
   */
  private async analyzeMarketConditions(deliveryType: DeliveryType): Promise<{
    demandLevel: 'low' | 'moderate' | 'high' | 'very_high';
    supplyLevel: 'very_low' | 'low' | 'moderate' | 'high';
    specialEvents: string[];
    weatherImpact: 'none' | 'moderate' | 'severe';
  }> {
    try {
      // Get active orders in the last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const { data: activeOrders } = await this.supabaseService.client
        .from('deliveries')
        .select('id')
        .eq('type', deliveryType)
        .gte('created_at', oneHourAgo.toISOString())
        .in('status', ['pending', 'assigned', 'in_progress']);

      const orderCount = activeOrders?.length || 0;

      // Get available vehicles
      const tableName =
        deliveryType === DeliveryType.DRONE ? 'drones' : 'riders';
      const { data: availableVehicles } = await this.supabaseService.client
        .from(tableName)
        .select('id')
        .eq('status', 'available');

      const availableCount = availableVehicles?.length || 0;

      // Get special events from database
      const { data: events } = await this.supabaseService.client
        .from('special_events')
        .select('name')
        .gte('end_date', new Date().toISOString())
        .lte('start_date', new Date().toISOString());

      const specialEvents = events?.map((e) => e.name) || [];

      // Determine demand level
      let demandLevel: 'low' | 'moderate' | 'high' | 'very_high';
      if (orderCount <= 5) demandLevel = 'low';
      else if (orderCount <= 15) demandLevel = 'moderate';
      else if (orderCount <= 30) demandLevel = 'high';
      else demandLevel = 'very_high';

      // Determine supply level
      let supplyLevel: 'very_low' | 'low' | 'moderate' | 'high';
      if (availableCount <= 2) supplyLevel = 'very_low';
      else if (availableCount <= 5) supplyLevel = 'low';
      else if (availableCount <= 15) supplyLevel = 'moderate';
      else supplyLevel = 'high';

      // Determine weather impact
      // In real implementation, this would get data from a weather API
      const weatherImpact =
        Math.random() > 0.8
          ? 'severe'
          : Math.random() > 0.6
            ? 'moderate'
            : 'none';

      return {
        demandLevel,
        supplyLevel,
        specialEvents,
        weatherImpact,
      };
    } catch (error) {
      this.logger.error('Failed to analyze market conditions:', error);
      return {
        demandLevel: 'moderate',
        supplyLevel: 'moderate',
        specialEvents: [],
        weatherImpact: 'none',
      };
    }
  }

  /**
   * Calculate subscription-based pricing for frequent customers
   */
  async calculateSubscriptionPrice(
    request: CostCalculationRequest,
    subscriptionTier: 'basic' | 'premium' | 'platinum',
  ): Promise<{
    standardPrice: number;
    discountedPrice: number;
    savings: number;
    freeDelivery: boolean;
  }> {
    // Get standard pricing first
    const standardPricing = await this.calculateDeliveryCost(request);

    // Apply subscription discounts
    let discountPercent = 0;
    let freeDelivery = false;

    switch (subscriptionTier) {
      case 'basic':
        discountPercent = 10;
        // Free delivery for orders over $30
        if (request.orderValue && request.orderValue >= 30) {
          freeDelivery = true;
        }
        break;

      case 'premium':
        discountPercent = 20;
        // Free delivery for orders over $20
        if (request.orderValue && request.orderValue >= 20) {
          freeDelivery = true;
        }
        break;

      case 'platinum':
        discountPercent = 30;
        // All deliveries free
        freeDelivery = true;
        break;
    }

    const discountMultiplier = freeDelivery ? 0 : (100 - discountPercent) / 100;
    const discountedPrice = freeDelivery
      ? 0
      : standardPricing.total * discountMultiplier;
    const savings = standardPricing.total - discountedPrice;

    return {
      standardPrice: standardPricing.total,
      discountedPrice: parseFloat(discountedPrice.toFixed(2)),
      savings: parseFloat(savings.toFixed(2)),
      freeDelivery,
    };
  }
}
