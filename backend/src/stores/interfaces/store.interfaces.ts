import { Store, StoreType, StoreStatus, CuisineType } from '../../common/types';

export interface IStoreService {
  createStore(ownerId: string, createStoreDto: any): Promise<Store>;
  updateStore(id: string, ownerId: string, updateStoreDto: any): Promise<Store>;
  getStoreById(id: string): Promise<Store>;
  getStores(query: any): Promise<{
    stores: Store[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  getStoresByOwner(ownerId: string): Promise<Store[]>;
  deleteStore(id: string, ownerId: string): Promise<void>;
  updateStoreStatus(id: string, status: StoreStatus): Promise<Store>;
  getStoreStats(id: string, ownerId: string): Promise<any>;
  getNearbyStores(
    latitude: number,
    longitude: number,
    radius?: number,
  ): Promise<Store[]>;
  getStoresByType(storeType: StoreType): Promise<Store[]>;
  searchStores(searchTerm: string): Promise<Store[]>;
}

export interface IStoreRepository {
  create(storeData: any): Promise<any>;
  findById(id: string): Promise<any>;
  findByOwnerId(ownerId: string): Promise<any[]>;
  findMany(
    filters: any,
    pagination: any,
  ): Promise<{ data: any[]; count: number }>;
  update(id: string, updateData: any): Promise<any>;
  delete(id: string): Promise<void>;
  findByCoordinates(
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<any[]>;
  findByType(storeType: StoreType): Promise<any[]>;
  search(searchTerm: string): Promise<any[]>;
  getStats(storeId: string): Promise<any>;
}

export interface StoreFilters {
  storeType?: StoreType;
  cuisine?: CuisineType;
  category?: string;
  isActive?: boolean;
  status?: StoreStatus;
  search?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
    maxDistance?: number;
  };
}

export interface StorePagination {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface StoreAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalCustomers: number;
  revenueThisMonth: number;
  ordersThisMonth: number;
  growthPercentage: number;
  topProducts?: Array<{
    productId: string;
    productName: string;
    orderCount: number;
    revenue: number;
  }>;
  customerDistribution?: Array<{
    ageGroup: string;
    percentage: number;
  }>;
  peakHours?: Array<{
    hour: number;
    orderCount: number;
  }>;
}
