import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { calculateDistance } from '../../common/utils/delivery.utils';

interface RoutePoint {
  id: string;
  latitude: number;
  longitude: number;
  type: 'pickup' | 'delivery' | 'depot';
  priority: number;
  timeWindow?: {
    earliest: Date;
    latest: Date;
  };
  estimatedServiceTime: number; // minutes
}

interface RouteOptimizationRequest {
  vehicleId: string;
  vehicleType: 'drone' | 'rider';
  startLocation: { latitude: number; longitude: number };
  points: RoutePoint[];
  constraints: {
    maxDistance: number;
    maxDuration: number; // minutes
    maxPayload: number;
  };
}

interface OptimizedRoute {
  totalDistance: number;
  totalDuration: number; // minutes
  optimizedPoints: RoutePoint[];
  estimatedCost: number;
  efficiency: number; // percentage
}

interface TrafficData {
  segmentId: string;
  averageSpeed: number; // km/h
  congestionLevel: 'low' | 'medium' | 'high';
  estimatedDelay: number; // minutes
}

@Injectable()
export class RouteOptimizationService {
  private readonly logger = new Logger(RouteOptimizationService.name);
  private optimizationStartTime: number;

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Optimize route for multiple delivery points
   */
  async optimizeRoute(
    request: RouteOptimizationRequest,
  ): Promise<OptimizedRoute> {
    this.logger.log(
      `Optimizing route for vehicle ${request.vehicleId} with ${request.points.length} points`,
    );

    try {
      // Step 1: Validate constraints
      await this.validateRouteConstraints(request);

      // Step 2: Get real-time traffic data
      const trafficData = await this.getTrafficData(request.points);

      // Step 3: Apply optimization algorithm
      const optimizedRoute = await this.applyRouteOptimization(
        request,
        trafficData,
      );

      // Step 4: Calculate route metrics
      const routeMetrics = await this.calculateRouteMetrics(
        optimizedRoute,
        request.vehicleType,
      );

      // Step 5: Store optimization result for analytics
      await this.storeOptimizationResult(
        request.vehicleId,
        optimizedRoute,
        routeMetrics,
      );

      this.logger.log(
        `Route optimized: ${routeMetrics.totalDistance}km, ${routeMetrics.totalDuration}min`,
      );

      return {
        ...optimizedRoute,
        ...routeMetrics,
      };
    } catch (error) {
      this.logger.error(
        `Route optimization failed for vehicle ${request.vehicleId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Advanced optimization algorithm for multiple delivery points
   * Uses a hybrid approach combining nearest neighbor and genetic algorithm
   */
  async optimizeRouteAdvanced(
    request: RouteOptimizationRequest,
  ): Promise<OptimizedRoute> {
    this.logger.log(
      `Running advanced route optimization for vehicle ${request.vehicleId} with ${request.points.length} points`,
    );
    this.optimizationStartTime = Date.now();

    try {
      // Step 1: Initial solution using nearest neighbor
      const initialSolution = await this.applyRouteOptimization(request, []);

      // Step 2: Apply genetic algorithm improvements
      const optimizedSolution = await this.applyGeneticAlgorithm(
        initialSolution.optimizedPoints,
        request.startLocation,
      );

      // Step 3: Calculate route metrics
      const routeMetrics = await this.calculateRouteMetrics(
        { optimizedPoints: optimizedSolution },
        request.vehicleType,
      );

      // Step 4: Store optimization result with metadata
      await this.storeAdvancedOptimizationResult(
        request,
        optimizedSolution,
        routeMetrics,
      );

      return {
        ...routeMetrics,
        optimizedPoints: optimizedSolution,
      };
    } catch (error) {
      this.logger.error(`Advanced route optimization failed:`, error);
      // Fall back to standard optimization
      return this.optimizeRoute(request);
    }
  }

  /**
   * Validate route constraints before optimization
   */
  private async validateRouteConstraints(
    request: RouteOptimizationRequest,
  ): Promise<void> {
    // Check maximum points limit
    if (request.points.length > 10) {
      throw new Error('Maximum 10 delivery points allowed per route');
    }

    // Check payload constraints
    const totalPayload = await this.calculateTotalPayload(request.points);
    if (totalPayload > request.constraints.maxPayload) {
      throw new Error(
        `Total payload ${totalPayload}kg exceeds vehicle capacity ${request.constraints.maxPayload}kg`,
      );
    }

    // Check initial distance estimation
    const estimatedDistance = await this.estimateTotalDistance(request);
    if (estimatedDistance > request.constraints.maxDistance) {
      throw new Error(
        `Estimated distance ${estimatedDistance}km exceeds vehicle range ${request.constraints.maxDistance}km`,
      );
    }
  }

  /**
   * Calculate total payload for all delivery points
   */
  private async calculateTotalPayload(points: RoutePoint[]): Promise<number> {
    let totalWeight = 0;

    for (const point of points.filter((p) => p.type === 'delivery')) {
      // Get order weight from database
      const { data: order } = await this.supabaseService.client
        .from('orders')
        .select('total_weight')
        .eq('id', point.id)
        .single();

      if (order?.total_weight) {
        totalWeight += order.total_weight;
      }
    }

    return totalWeight;
  }

  /**
   * Estimate total distance for initial validation
   */
  private async estimateTotalDistance(
    request: RouteOptimizationRequest,
  ): Promise<number> {
    let totalDistance = 0;
    let currentLocation = request.startLocation;

    // Simple distance estimation (not optimized order)
    for (const point of request.points) {
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        point.latitude,
        point.longitude,
      );
      totalDistance += distance;
      currentLocation = {
        latitude: point.latitude,
        longitude: point.longitude,
      };
    }

    return totalDistance;
  }

  /**
   * Get real-time traffic data for route segments
   */
  private async getTrafficData(points: RoutePoint[]): Promise<TrafficData[]> {
    // In production, integrate with traffic APIs (Google Maps, HERE, etc.)
    // For now, return mock traffic data

    const trafficData: TrafficData[] = [];

    for (let i = 0; i < points.length - 1; i++) {
      const from = points[i];
      const to = points[i + 1];

      // Mock traffic calculation based on time of day and distance
      const currentHour = new Date().getHours();
      const isRushHour =
        (currentHour >= 7 && currentHour <= 9) ||
        (currentHour >= 17 && currentHour <= 19);

      const distance = calculateDistance(
        from.latitude,
        from.longitude,
        to.latitude,
        to.longitude,
      );

      let congestionLevel: 'low' | 'medium' | 'high' = 'low';
      let averageSpeed = 50; // km/h default

      if (isRushHour && distance > 2) {
        congestionLevel = 'high';
        averageSpeed = 25;
      } else if (isRushHour || distance > 5) {
        congestionLevel = 'medium';
        averageSpeed = 35;
      }

      trafficData.push({
        segmentId: `${from.id}-${to.id}`,
        averageSpeed,
        congestionLevel,
        estimatedDelay:
          congestionLevel === 'high' ? 5 : congestionLevel === 'medium' ? 2 : 0,
      });
    }

    return trafficData;
  }

  /**
   * Apply route optimization algorithm
   */
  private async applyRouteOptimization(
    request: RouteOptimizationRequest,
    trafficData: TrafficData[],
  ): Promise<{ optimizedPoints: RoutePoint[] }> {
    // Separate pickup and delivery points
    const pickupPoints = request.points.filter((p) => p.type === 'pickup');
    const deliveryPoints = request.points.filter((p) => p.type === 'delivery');
    const depotPoints = request.points.filter((p) => p.type === 'depot');

    // For drone routes, optimize differently than rider routes
    if (request.vehicleType === 'drone') {
      return this.optimizeDroneRoute(
        pickupPoints,
        deliveryPoints,
        depotPoints,
        request.startLocation,
      );
    } else {
      return this.optimizeRiderRoute(
        pickupPoints,
        deliveryPoints,
        depotPoints,
        request.startLocation,
        trafficData,
      );
    }
  }

  /**
   * Optimize route specifically for drone delivery
   */
  private async optimizeDroneRoute(
    pickupPoints: RoutePoint[],
    deliveryPoints: RoutePoint[],
    depotPoints: RoutePoint[],
    startLocation: { latitude: number; longitude: number },
  ): Promise<{ optimizedPoints: RoutePoint[] }> {
    // Drones can take more direct routes, less affected by traffic
    const allPoints = [...pickupPoints, ...deliveryPoints, ...depotPoints];

    // Simple nearest neighbor algorithm optimized for drones
    const optimizedPoints: RoutePoint[] = [];
    const unvisited = [...allPoints];
    let currentLocation = startLocation;

    // Prioritize by time windows and priority
    unvisited.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      if (a.timeWindow && b.timeWindow) {
        return (
          a.timeWindow.earliest.getTime() - b.timeWindow.earliest.getTime()
        );
      }
      return 0;
    });

    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      // Find nearest unvisited point
      unvisited.forEach((point, index) => {
        const distance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          point.latitude,
          point.longitude,
        );

        // Apply time window penalty
        const now = new Date();
        let timePenalty = 0;
        if (point.timeWindow) {
          if (now > point.timeWindow.latest) {
            timePenalty = 1000; // Heavy penalty for late delivery
          } else if (now < point.timeWindow.earliest) {
            timePenalty = 100; // Light penalty for early arrival
          }
        }

        const adjustedDistance = distance + timePenalty;
        if (adjustedDistance < nearestDistance) {
          nearestDistance = adjustedDistance;
          nearestIndex = index;
        }
      });

      const selectedPoint = unvisited.splice(nearestIndex, 1)[0];
      optimizedPoints.push(selectedPoint);
      currentLocation = {
        latitude: selectedPoint.latitude,
        longitude: selectedPoint.longitude,
      };
    }

    return { optimizedPoints };
  }

  /**
   * Optimize route specifically for rider delivery (considering traffic)
   */
  private async optimizeRiderRoute(
    pickupPoints: RoutePoint[],
    deliveryPoints: RoutePoint[],
    depotPoints: RoutePoint[],
    startLocation: { latitude: number; longitude: number },
    trafficData: TrafficData[],
  ): Promise<{ optimizedPoints: RoutePoint[] }> {
    const allPoints = [...pickupPoints, ...deliveryPoints, ...depotPoints];

    // More sophisticated optimization considering traffic
    const optimizedPoints: RoutePoint[] = [];
    const unvisited = [...allPoints];
    let currentLocation = startLocation;

    while (unvisited.length > 0) {
      let bestIndex = 0;
      let bestScore = Infinity;

      unvisited.forEach((point, index) => {
        const distance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          point.latitude,
          point.longitude,
        );

        // Find relevant traffic data
        const relevantTraffic = trafficData.find(
          (t) => t.segmentId.includes(point.id) || distance < 2, // assume same traffic conditions for nearby points
        );

        let trafficMultiplier = 1;
        if (relevantTraffic) {
          trafficMultiplier =
            relevantTraffic.congestionLevel === 'high'
              ? 2.5
              : relevantTraffic.congestionLevel === 'medium'
                ? 1.5
                : 1;
        }

        // Calculate time-based score
        const estimatedTravelTime = (distance / 30) * 60 * trafficMultiplier; // 30 km/h average with traffic
        let timeScore = estimatedTravelTime;

        // Time window considerations
        const now = new Date();
        if (point.timeWindow) {
          const arrivalTime = new Date(
            now.getTime() + estimatedTravelTime * 60 * 1000,
          );

          if (arrivalTime > point.timeWindow.latest) {
            timeScore += 500; // Heavy penalty for late arrival
          } else if (arrivalTime < point.timeWindow.earliest) {
            timeScore += 50; // Light penalty for early arrival
          }
        }

        // Priority scoring
        const priorityMultiplier = 1 / Math.max(point.priority, 1);
        const finalScore = timeScore * priorityMultiplier;

        if (finalScore < bestScore) {
          bestScore = finalScore;
          bestIndex = index;
        }
      });

      const selectedPoint = unvisited.splice(bestIndex, 1)[0];
      optimizedPoints.push(selectedPoint);
      currentLocation = {
        latitude: selectedPoint.latitude,
        longitude: selectedPoint.longitude,
      };
    }

    return { optimizedPoints };
  }

  /**
   * Apply genetic algorithm to further optimize route
   * Uses crossover, mutation, and selection to improve solution
   */
  private async applyGeneticAlgorithm(
    initialRoute: RoutePoint[],
    startLocation: { latitude: number; longitude: number },
  ): Promise<RoutePoint[]> {
    if (initialRoute.length <= 3) {
      // Not worth running GA for very short routes
      return initialRoute;
    }

    // Constants for genetic algorithm
    const POPULATION_SIZE = Math.min(
      100,
      Math.max(20, initialRoute.length * 10),
    );
    const GENERATIONS = Math.min(100, Math.max(20, initialRoute.length * 5));
    const MUTATION_RATE = 0.1;
    const ELITE_SIZE = Math.floor(POPULATION_SIZE * 0.2);

    // Generate initial population
    const population: RoutePoint[][] = [];

    // Add initial route to population
    population.push([...initialRoute]);

    // Add random variations for the rest
    for (let i = 1; i < POPULATION_SIZE; i++) {
      population.push(this.shuffleRoute([...initialRoute]));
    }

    // Main GA loop
    let bestRoute = [...initialRoute];
    let bestDistance = this.calculateRouteDistance(bestRoute, startLocation);

    for (let generation = 0; generation < GENERATIONS; generation++) {
      // Calculate fitness for each route
      const fitnessScores = population.map(
        (route) => 1 / this.calculateRouteDistance(route, startLocation),
      );

      // Select parents based on fitness (tournament selection)
      const selectedParents = this.selectParents(
        population,
        fitnessScores,
        POPULATION_SIZE,
      );

      // Create next generation through crossover and mutation
      const nextGeneration: RoutePoint[][] = [];

      // Elitism - carry forward the best routes
      for (let i = 0; i < ELITE_SIZE; i++) {
        const eliteIndex = fitnessScores.indexOf(Math.max(...fitnessScores));
        nextGeneration.push([...population[eliteIndex]]);
        fitnessScores[eliteIndex] = -1; // Mark as used
      }

      // Crossover and mutation
      while (nextGeneration.length < POPULATION_SIZE) {
        // Select parents
        const parent1Index = Math.floor(Math.random() * selectedParents.length);
        const parent2Index = Math.floor(Math.random() * selectedParents.length);

        // Create child through crossover
        const child = this.crossoverRoutes(
          selectedParents[parent1Index],
          selectedParents[parent2Index],
        );

        // Apply mutation
        if (Math.random() < MUTATION_RATE) {
          this.mutateRoute(child);
        }

        nextGeneration.push(child);
      }

      // Update population
      population.length = 0;
      population.push(...nextGeneration);

      // Check if we have a new best route
      const currentBest = population.reduce(
        (best, route) => {
          const distance = this.calculateRouteDistance(route, startLocation);
          return distance < bestDistance
            ? { route, distance }
            : { route: best.route, distance: best.distance };
        },
        { route: bestRoute, distance: bestDistance },
      );

      if (currentBest.distance < bestDistance) {
        bestRoute = [...currentBest.route];
        bestDistance = currentBest.distance;
      }
    }

    return bestRoute;
  }

  /**
   * Shuffle route randomly
   */
  private shuffleRoute(route: RoutePoint[]): RoutePoint[] {
    for (let i = route.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [route[i], route[j]] = [route[j], route[i]];
    }
    return route;
  }

  /**
   * Calculate total route distance
   */
  private calculateRouteDistance(
    route: RoutePoint[],
    startLocation: { latitude: number; longitude: number },
  ): number {
    let totalDistance = 0;
    let currentLocation = startLocation;

    for (const point of route) {
      totalDistance += calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        point.latitude,
        point.longitude,
      );
      currentLocation = {
        latitude: point.latitude,
        longitude: point.longitude,
      };
    }

    return totalDistance;
  }

  /**
   * Select parents for next generation using tournament selection
   */
  private selectParents(
    population: RoutePoint[][],
    fitnessScores: number[],
    count: number,
  ): RoutePoint[][] {
    const selected: RoutePoint[][] = [];
    const tournamentSize = 3;

    while (selected.length < count) {
      // Select random candidates for tournament
      const candidates: number[] = [];
      while (candidates.length < tournamentSize) {
        const randomIndex = Math.floor(Math.random() * population.length);
        if (!candidates.includes(randomIndex)) {
          candidates.push(randomIndex);
        }
      }

      // Find the best candidate
      let bestCandidateIndex = candidates[0];
      for (let i = 1; i < candidates.length; i++) {
        if (fitnessScores[candidates[i]] > fitnessScores[bestCandidateIndex]) {
          bestCandidateIndex = candidates[i];
        }
      }

      selected.push([...population[bestCandidateIndex]]);
    }

    return selected;
  }

  /**
   * Perform crossover between two parent routes (Ordered Crossover - OX)
   */
  private crossoverRoutes(
    parent1: RoutePoint[],
    parent2: RoutePoint[],
  ): RoutePoint[] {
    const size = parent1.length;
    const child: RoutePoint[] = Array(size).fill(null);

    // Select a random subsequence from parent1
    const start = Math.floor(Math.random() * size);
    const end = start + Math.floor(Math.random() * (size - start));

    // Copy subsequence from parent1 to child
    for (let i = start; i <= end; i++) {
      child[i] = parent1[i];
    }

    // Fill remaining positions with elements from parent2 (maintaining order)
    let parent2Index = 0;
    for (let i = 0; i < size; i++) {
      if (child[i] === null) {
        // Find next element in parent2 that isn't already in child
        while (
          child.some(
            (point) =>
              point &&
              parent2[parent2Index] &&
              point.id === parent2[parent2Index].id,
          )
        ) {
          parent2Index++;
          if (parent2Index >= size) break;
        }

        if (parent2Index < size) {
          child[i] = parent2[parent2Index];
          parent2Index++;
        }
      }
    }

    return child;
  }

  /**
   * Mutate route by swapping random points
   */
  private mutateRoute(route: RoutePoint[]): void {
    // Perform 1-3 random swaps
    const numSwaps = 1 + Math.floor(Math.random() * 3);

    for (let i = 0; i < numSwaps; i++) {
      const idx1 = Math.floor(Math.random() * route.length);
      const idx2 = Math.floor(Math.random() * route.length);

      // Swap the points
      [route[idx1], route[idx2]] = [route[idx2], route[idx1]];
    }
  }

  /**
   * Calculate comprehensive route metrics
   */
  private async calculateRouteMetrics(
    route: { optimizedPoints: RoutePoint[] },
    vehicleType: 'drone' | 'rider',
  ): Promise<{
    totalDistance: number;
    totalDuration: number;
    estimatedCost: number;
    efficiency: number;
  }> {
    let totalDistance = 0;
    let totalDuration = 0;
    const baseSpeed = vehicleType === 'drone' ? 50 : 30; // km/h

    // Calculate distance and duration for each segment
    for (let i = 0; i < route.optimizedPoints.length; i++) {
      const current = route.optimizedPoints[i];
      const next = route.optimizedPoints[i + 1];

      if (next) {
        const segmentDistance = calculateDistance(
          current.latitude,
          current.longitude,
          next.latitude,
          next.longitude,
        );

        totalDistance += segmentDistance;

        // Add travel time
        const travelTime = (segmentDistance / baseSpeed) * 60; // minutes
        totalDuration += travelTime;
      }

      // Add service time at each point
      totalDuration += current.estimatedServiceTime;
    }

    // Calculate cost (simplified)
    const baseCost = vehicleType === 'drone' ? 5.0 : 3.5;
    const perKmCost = vehicleType === 'drone' ? 0.8 : 0.6;
    const estimatedCost = baseCost + totalDistance * perKmCost;

    // Calculate efficiency (how much better than naive route)
    const naiveDistance = await this.calculateNaiveRouteDistance(
      route.optimizedPoints,
    );
    const efficiency = Math.max(
      0,
      ((naiveDistance - totalDistance) / naiveDistance) * 100,
    );

    return {
      totalDistance: parseFloat(totalDistance.toFixed(2)),
      totalDuration: Math.round(totalDuration),
      estimatedCost: parseFloat(estimatedCost.toFixed(2)),
      efficiency: parseFloat(efficiency.toFixed(1)),
    };
  }

  /**
   * Calculate naive route distance for efficiency comparison
   */
  private async calculateNaiveRouteDistance(
    points: RoutePoint[],
  ): Promise<number> {
    let distance = 0;

    for (let i = 0; i < points.length - 1; i++) {
      distance += calculateDistance(
        points[i].latitude,
        points[i].longitude,
        points[i + 1].latitude,
        points[i + 1].longitude,
      );
    }

    return distance;
  }

  /**
   * Store optimization result for analytics and learning
   */
  private async storeOptimizationResult(
    vehicleId: string,
    route: { optimizedPoints: RoutePoint[] },
    metrics: any,
  ): Promise<void> {
    try {
      await this.supabaseService.client.from('route_optimizations').insert({
        vehicle_id: vehicleId,
        optimized_route: route.optimizedPoints,
        total_distance: metrics.totalDistance,
        total_duration: metrics.totalDuration,
        estimated_cost: metrics.estimatedCost,
        efficiency_percentage: metrics.efficiency,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.warn('Failed to store optimization result:', error);
      // Don't throw here, as this is not critical to the operation
    }
  }

  /**
   * Store advanced optimization results with detailed metrics
   */
  private async storeAdvancedOptimizationResult(
    request: RouteOptimizationRequest,
    optimizedRoute: RoutePoint[],
    metrics: any,
  ): Promise<void> {
    try {
      await this.supabaseService.client.from('route_optimizations').insert({
        vehicle_id: request.vehicleId,
        algorithm_type: 'advanced_genetic',
        optimized_route: optimizedRoute,
        total_distance: metrics.totalDistance,
        total_duration: metrics.totalDuration,
        estimated_cost: metrics.estimatedCost,
        efficiency_percentage: metrics.efficiency,
        points_count: optimizedRoute.length,
        optimization_time_ms: Date.now() - this.optimizationStartTime,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.warn('Failed to store advanced optimization result:', error);
    }
  }

  /**
   * Get route optimization history for analytics
   */
  async getOptimizationHistory(
    vehicleId: string,
    days: number = 7,
  ): Promise<any[]> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const { data, error } = await this.supabaseService.client
      .from('route_optimizations')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      this.logger.error('Failed to fetch optimization history:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get average optimization efficiency for a vehicle
   */
  async getAverageEfficiency(
    vehicleId: string,
    days: number = 30,
  ): Promise<number> {
    const history = await this.getOptimizationHistory(vehicleId, days);

    if (history.length === 0) return 0;

    const averageEfficiency =
      history.reduce(
        (sum, record) => sum + (record.efficiency_percentage || 0),
        0,
      ) / history.length;

    return parseFloat(averageEfficiency.toFixed(1));
  }
}
