import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  CreateStoreDto,
  UpdateStoreDto,
  StoreQueryDto,
  StoreStatsDto,
} from './dto/store.dto';
import { Store, StoreType, StoreStatus, StoreItem } from '../common/types';
import {
  calculateDistance,
  formatCurrency,
} from '../common/utils/delivery.utils';

@Injectable()
export class StoresService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createStore(
    ownerId: string,
    createStoreDto: CreateStoreDto,
  ): Promise<Store> {
    const storeData = {
      owner_id: ownerId,
      name: createStoreDto.name,
      description: createStoreDto.description,
      store_type: createStoreDto.storeType,
      cuisine: createStoreDto.cuisine || [],
      categories: createStoreDto.categories || [],
      address: createStoreDto.address,
      coordinates: createStoreDto.coordinates,
      phone: createStoreDto.phone,
      email: createStoreDto.email,
      delivery_time: createStoreDto.deliveryTime,
      delivery_fee: createStoreDto.deliveryFee,
      minimum_order: createStoreDto.minimumOrder,
      image_url: createStoreDto.imageUrl,
      open_hours: createStoreDto.openHours,
      license_number: createStoreDto.licenseNumber,
      tax_id: createStoreDto.taxId,
      rating: 0,
      total_ratings: 0,
      is_active: false, // Pending approval
      status: StoreStatus.PENDING,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabaseService.client
      .from('stores')
      .insert(storeData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create store: ${error.message}`);
    }

    return this.mapToStore(data);
  }

  async updateStore(
    id: string,
    ownerId: string,
    updateStoreDto: UpdateStoreDto,
  ): Promise<Store> {
    const store = await this.getStoreById(id);
    if (store.ownerId !== ownerId) {
      throw new ForbiddenException('Access denied to this store');
    }

    const updateData = {
      ...(updateStoreDto.name && { name: updateStoreDto.name }),
      ...(updateStoreDto.description && {
        description: updateStoreDto.description,
      }),
      ...(updateStoreDto.cuisine && { cuisine: updateStoreDto.cuisine }),
      ...(updateStoreDto.categories && {
        categories: updateStoreDto.categories,
      }),
      ...(updateStoreDto.address && { address: updateStoreDto.address }),
      ...(updateStoreDto.coordinates && {
        coordinates: updateStoreDto.coordinates,
      }),
      ...(updateStoreDto.phone && { phone: updateStoreDto.phone }),
      ...(updateStoreDto.email && { email: updateStoreDto.email }),
      ...(updateStoreDto.deliveryTime !== undefined && {
        delivery_time: updateStoreDto.deliveryTime,
      }),
      ...(updateStoreDto.deliveryFee !== undefined && {
        delivery_fee: updateStoreDto.deliveryFee,
      }),
      ...(updateStoreDto.minimumOrder !== undefined && {
        minimum_order: updateStoreDto.minimumOrder,
      }),
      ...(updateStoreDto.imageUrl && { image_url: updateStoreDto.imageUrl }),
      ...(updateStoreDto.openHours && { open_hours: updateStoreDto.openHours }),
      ...(updateStoreDto.licenseNumber && {
        license_number: updateStoreDto.licenseNumber,
      }),
      ...(updateStoreDto.taxId && { tax_id: updateStoreDto.taxId }),
      ...(updateStoreDto.status && { status: updateStoreDto.status }),
      ...(updateStoreDto.isActive !== undefined && {
        is_active: updateStoreDto.isActive,
      }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabaseService.client
      .from('stores')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update store: ${error.message}`);
    }

    return this.mapToStore(data);
  }

  async getStoreById(id: string): Promise<Store> {
    const { data, error } = await this.supabaseService.client
      .from('stores')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Store not found');
    }

    return this.mapToStore(data);
  }

  async getStores(query: StoreQueryDto): Promise<{
    stores: Store[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let dbQuery = this.supabaseService.client
      .from('stores')
      .select('*', { count: 'exact' });

    // Apply filters
    if (query.storeType) {
      dbQuery = dbQuery.eq('store_type', query.storeType);
    }

    if (query.cuisine) {
      dbQuery = dbQuery.contains('cuisine', [query.cuisine]);
    }

    if (query.category) {
      dbQuery = dbQuery.contains('categories', [query.category]);
    }

    if (query.search) {
      dbQuery = dbQuery.or(
        `name.ilike.%${query.search}%,description.ilike.%${query.search}%`,
      );
    }

    if (query.isActive !== undefined) {
      dbQuery = dbQuery.eq('is_active', query.isActive);
    }

    if (query.status) {
      dbQuery = dbQuery.eq('status', query.status);
    }

    // Apply sorting
    const sortBy = query.sortBy || 'created_at';
    const sortOrder = query.sortOrder || 'desc';
    dbQuery = dbQuery.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    dbQuery = dbQuery.range(offset, offset + limit - 1);

    const { data, error, count } = await dbQuery;

    if (error) {
      throw new Error(`Failed to fetch stores: ${error.message}`);
    }

    let stores = (data || []).map(this.mapToStore);

    // Apply distance filtering if coordinates provided
    if (query.latitude && query.longitude) {
      const userCoords = {
        latitude: query.latitude,
        longitude: query.longitude,
      };
      stores = stores
        .map((store) => ({
          ...store,
          distance: calculateDistance(
            userCoords.latitude,
            userCoords.longitude,
            store.coordinates.latitude,
            store.coordinates.longitude,
          ),
        }))
        .filter((store) => store.distance <= (query.maxDistance || 10))
        .sort((a, b) => (a as any).distance - (b as any).distance);
    }

    return {
      stores,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  async getStoresByOwner(ownerId: string): Promise<Store[]> {
    const { data, error } = await this.supabaseService.client
      .from('stores')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch owner stores: ${error.message}`);
    }

    return (data || []).map(this.mapToStore);
  }

  async deleteStore(id: string, ownerId: string): Promise<void> {
    const store = await this.getStoreById(id);
    if (store.ownerId !== ownerId) {
      throw new ForbiddenException('Access denied to this store');
    }

    const { error } = await this.supabaseService.client
      .from('stores')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete store: ${error.message}`);
    }
  }

  // Analytics
  async getStoreAnalytics(
    storeId: string,
    ownerId: string,
    statsDto: StoreStatsDto,
  ): Promise<any> {
    const store = await this.getStoreById(storeId);
    if (store.ownerId !== ownerId) {
      throw new ForbiddenException('Access denied to this store');
    }

    const startDate =
      statsDto.startDate ||
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = statsDto.endDate || new Date().toISOString();

    // Get order statistics
    const { data: orders, error: ordersError } =
      await this.supabaseService.client
        .from('orders')
        .select('*, order_items(*)')
        .eq('store_id', storeId)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

    if (ordersError) {
      throw new Error(`Failed to fetch analytics: ${ordersError.message}`);
    }

    const totalOrders = orders?.length || 0;
    const totalRevenue =
      orders?.reduce((sum, order) => sum + order.total, 0) || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get unique customer count
    const uniqueCustomers = new Set(orders?.map((order) => order.user_id));
    const totalCustomers = uniqueCustomers.size;

    // Get revenue and orders for current month
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    const currentMonthOrders =
      orders?.filter(
        (order) => new Date(order.created_at) >= currentMonthStart,
      ) || [];

    const revenueThisMonth = currentMonthOrders.reduce(
      (sum, order) => sum + order.total,
      0,
    );

    const ordersThisMonth = currentMonthOrders.length;

    // Get previous month data for growth calculation
    const previousMonthStart = new Date(currentMonthStart);
    previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);

    const previousMonthEnd = new Date(currentMonthStart);
    previousMonthEnd.setDate(previousMonthEnd.getDate() - 1);

    const { data: previousMonthOrders } = await this.supabaseService.client
      .from('orders')
      .select('total')
      .eq('store_id', storeId)
      .gte('created_at', previousMonthStart.toISOString())
      .lte('created_at', previousMonthEnd.toISOString());

    const previousMonthRevenue = (previousMonthOrders || []).reduce(
      (sum, order) => sum + order.total,
      0,
    );

    // Calculate growth percentage
    const growthPercentage = previousMonthRevenue
      ? ((revenueThisMonth - previousMonthRevenue) / previousMonthRevenue) * 100
      : 100;

    // Get ratings info
    const { data: ratings } = await this.supabaseService.client
      .from('reviews')
      .select('rating')
      .eq('store_id', storeId);

    const totalRatings = ratings?.length || 0;
    const averageRating =
      totalRatings && ratings
        ? ratings.reduce((sum, review) => sum + review.rating, 0) / totalRatings
        : 0;

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      totalCustomers,
      averageRating,
      totalRatings,
      revenueThisMonth,
      ordersThisMonth,
      growthPercentage: Math.round(growthPercentage * 100) / 100,
    };
  }

  // Private helper methods
  private mapToStore(data: any): Store {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      ownerId: data.owner_id,
      storeType: data.store_type,
      cuisineType: data.cuisine || [],
      address: {
        street: data.address?.street || '',
        city: data.address?.city || '',
        state: data.address?.state || '',
        postalCode: data.address?.postal_code || '',
        country: data.address?.country || '',
        coordinates: data.coordinates,
      },
      coordinates: data.coordinates,
      contactEmail: data.email,
      contactPhone: data.phone,
      website: data.website,
      openingHours: data.open_hours || {},
      rating: data.rating || 0,
      ratingCount: data.total_ratings || 0,
      priceRange: data.price_range || 1,
      imageUrl: data.image_url,
      coverImageUrl: data.cover_image_url,
      bannerImages: data.banner_images || [],
      status: data.status,
      minimumOrderAmount: data.minimum_order,
      deliveryFee: data.delivery_fee,
      estimatedDeliveryTime: data.delivery_time,
      featured: data.featured || false,
      verified: data.verified || false,
      businessLicense: data.license_number,
      taxId: data.tax_id,
      socialMedia: data.social_media || {},
      specialOffers: data.special_offers || [],
      tags: data.tags || [],
      returnPolicy: data.return_policy,
      shippingPolicy: data.shipping_policy,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
