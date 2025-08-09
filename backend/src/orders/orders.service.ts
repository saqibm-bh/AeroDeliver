import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateOrderDto, UpdateOrderDto, OrderQueryDto } from './dto/order.dto';
import { Order, OrderStatus } from './interfaces/order.interface';
import { DeliveryService } from '../delivery/delivery.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly supabaseService: SupabaseService,
    @Inject(forwardRef(() => DeliveryService))
    private readonly deliveryService: DeliveryService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  async getUserOrders(
    userId: string,
    query: OrderQueryDto,
  ): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, status } = query;
    const offset = (page - 1) * limit;

    let queryBuilder = this.supabaseService.client
      .from('orders')
      .select('*, order_items(*), delivery_address(*)', { count: 'exact' })
      .eq('user_id', userId);

    if (status) {
      queryBuilder = queryBuilder.eq('status', status);
    }

    const { data, error, count } = await queryBuilder
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    return {
      orders: data || [],
      total: count || 0,
      page: Number(page),
      limit: Number(limit),
    };
  }

  async getOrderById(id: string, userId: string): Promise<Order> {
    const { data, error } = await this.supabaseService.client
      .from('orders')
      .select('*, order_items(*), delivery_address(*)')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Order not found');
    }

    return data;
  }

  async createOrder(
    createOrderDto: CreateOrderDto & { userId: string },
  ): Promise<Order> {
    const { userId, items, deliveryAddressId, notes } = createOrderDto;

    // Validate inventory availability
    await this.validateInventory(items);

    // Calculate order totals
    const { subtotal, deliveryFee, tax, total } =
      await this.calculateOrderTotals(items, deliveryAddressId);

    try {
      // Create order in transaction
      const order = await this.createOrderTransaction({
        userId,
        items,
        deliveryAddressId,
        notes,
        subtotal,
        deliveryFee,
        tax,
        total,
      });

      // Assign delivery (drone or rider)
      await this.assignDelivery(order.id);

      // Send confirmation notifications
      await this.notificationsService.sendOrderConfirmation(order);

      return order;
    } catch (error) {
      throw error;
    }
  }

  private async validateInventory(items: any[]): Promise<void> {
    for (const item of items) {
      const { data: product } = await this.supabaseService.client
        .from('products')
        .select('*')
        .eq('id', item.productId)
        .single();

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        );
      }
    }
  }

  private async calculateOrderTotals(
    items: any[],
    deliveryAddressId: string,
  ): Promise<{
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
  }> {
    let subtotal = 0;

    // Calculate subtotal
    for (const item of items) {
      const { data: product } = await this.supabaseService.client
        .from('products')
        .select('price')
        .eq('id', item.productId)
        .single();

      if (product) {
        subtotal += product.price * item.quantity;
      }
    }

    // Calculate delivery fee based on address
    const deliveryFee = await this.calculateDeliveryFee(
      deliveryAddressId,
      subtotal,
    );

    // Calculate tax (8% example)
    const tax = subtotal * 0.08;

    const total = subtotal + deliveryFee + tax;

    return { subtotal, deliveryFee, tax, total };
  }

  private async calculateDeliveryFee(
    deliveryAddressId: string,
    subtotal: number,
  ): Promise<number> {
    // Free delivery for orders over $50
    if (subtotal >= 50) return 0;

    // Get delivery zone for address
    const { data: address } = await this.supabaseService.client
      .from('addresses')
      .select('*, delivery_zones(*)')
      .eq('id', deliveryAddressId)
      .single();

    return address?.delivery_zones?.delivery_fee || 5.99;
  }

  private async createOrderTransaction(orderData: any): Promise<Order> {
    const { data: order, error: orderError } = await this.supabaseService.client
      .from('orders')
      .insert({
        user_id: orderData.userId,
        delivery_address_id: orderData.deliveryAddressId,
        subtotal: orderData.subtotal,
        delivery_fee: orderData.deliveryFee,
        tax: orderData.tax,
        total_amount: orderData.total,
        status: OrderStatus.PENDING,
        notes: orderData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    // Create order items
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const { error: itemsError } = await this.supabaseService.client
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    return this.getOrderById(order.id, orderData.userId);
  }

  private async assignDelivery(orderId: string): Promise<void> {
    try {
      // Get order details to extract location and weight info
      const { data: orderData, error } = await this.supabaseService.client
        .from('orders')
        .select(
          `
          *,
          stores:store_id (
            address,
            coordinates
          )
        `,
        )
        .eq('id', orderId)
        .single();

      if (error || !orderData) {
        throw new Error('Order not found');
      }

      const pickupLocation = orderData.stores?.coordinates || {
        latitude: 0,
        longitude: 0,
      };
      const deliveryLocation = orderData.delivery_address?.coordinates || {
        latitude: 0,
        longitude: 0,
      };
      const orderWeight = orderData.total_weight || 1; // Default weight if not specified

      await this.deliveryService.assignOptimalDelivery(
        orderId,
        pickupLocation,
        deliveryLocation,
        orderWeight,
      );
    } catch (error) {
      // Log error but don't fail order creation
      console.error('Failed to assign delivery:', error);
    }
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
    userId: string,
  ): Promise<Order> {
    const { data, error } = await this.supabaseService.client
      .from('orders')
      .update({
        ...updateOrderDto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('Order not found or failed to update');
    }

    return this.getOrderById(id, userId);
  }

  async cancelOrder(id: string, userId: string): Promise<void> {
    const order = await this.getOrderById(id, userId);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    const { error } = await this.supabaseService.client
      .from('orders')
      .update({
        status: OrderStatus.CANCELLED,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to cancel order: ${error.message}`);
    }
  }

  async trackOrder(id: string, userId: string): Promise<any> {
    const order = await this.getOrderById(id, userId);

    // Get tracking information (this would integrate with drone tracking)
    return {
      orderId: order.id,
      status: order.status,
      estimatedDelivery: order.estimated_delivery,
      currentLocation: order.current_location,
      timeline: [
        {
          status: 'Order Placed',
          timestamp: order.created_at,
          completed: true,
        },
        {
          status: 'Preparing',
          timestamp: null,
          completed: order.status !== OrderStatus.PENDING,
        },
        {
          status: 'In Transit',
          timestamp: null,
          completed: [OrderStatus.IN_TRANSIT, OrderStatus.DELIVERED].includes(
            order.status,
          ),
        },
        {
          status: 'Delivered',
          timestamp: order.delivered_at,
          completed: order.status === OrderStatus.DELIVERED,
        },
      ],
    };
  }

  async getAllOrders(query: OrderQueryDto): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, status } = query;
    const offset = (page - 1) * limit;

    let queryBuilder = this.supabaseService.client
      .from('orders')
      .select(
        '*, order_items(*), delivery_address(*), users(email, full_name)',
        { count: 'exact' },
      );

    if (status) {
      queryBuilder = queryBuilder.eq('status', status);
    }

    const { data, error, count } = await queryBuilder
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }

    return {
      orders: data || [],
      total: count || 0,
      page: Number(page),
      limit: Number(limit),
    };
  }
}
