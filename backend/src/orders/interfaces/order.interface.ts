export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    images?: string[];
  };
}

export interface Order {
  id: string;
  user_id: string;
  delivery_address_id: string;
  total_amount: number;
  status: OrderStatus;
  notes?: string;
  estimated_delivery?: string;
  delivered_at?: string;
  current_location?: {
    latitude: number;
    longitude: number;
  };
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  delivery_address?: any;
  user?: {
    email: string;
    full_name: string;
  };
}
