import { createSupabaseClient } from './supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

// User profile interface
export interface UserProfile {
  id: string;
  email: string;
  role: 'customer' | 'admin' | 'rider' | 'store_owner';
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

// Order interface
export interface Order {
  id: string;
  customerId: string;
  storeId: string;
  riderId?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const supabase = createSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token && {
            Authorization: `Bearer ${session.access_token}`,
          }),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Auth methods
  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/auth/profile');
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Orders methods
  async getOrders(userId: string): Promise<ApiResponse<Order[]>> {
    return this.request<Order[]>(`/orders/user/${userId}`);
  }

  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${orderId}`);
  }

  async createOrder(orderData: Partial<Order>): Promise<ApiResponse<Order>> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrder(orderId: string, orderData: Partial<Order>): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  }

  // Products methods
  async getProducts(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/products');
  }

  async getProduct(productId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/products/${productId}`);
  }

  // Stores methods
  async getStores(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/stores');
  }

  async getStore(storeId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/stores/${storeId}`);
  }

  // Addresses methods
  async getAddresses(userId: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/addresses/user/${userId}`);
  }

  async createAddress(addressData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  async updateAddress(addressId: string, addressData: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  }

  async deleteAddress(addressId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/addresses/${addressId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
