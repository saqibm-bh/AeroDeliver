import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

/**
 * Notification types supported by the system
 */
export enum NotificationType {
  ORDER_PLACED = 'order_placed',
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_CANCELLED = 'order_cancelled',
  DELIVERY_ASSIGNED = 'delivery_assigned',
  DELIVERY_PICKED_UP = 'delivery_picked_up',
  DELIVERY_EN_ROUTE = 'delivery_en_route',
  DELIVERY_COMPLETED = 'delivery_completed',
  DELIVERY_FAILED = 'delivery_failed',
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_FAILED = 'payment_failed',
  ACCOUNT_CREATED = 'account_created',
  ACCOUNT_UPDATED = 'account_updated',
}

/**
 * Notification channels supported by the system
 */
export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
}

// Type for notification data
export type NotificationData = Record<string, unknown>;

/**
 * Notification payload structure
 */
export interface NotificationPayload {
  type: NotificationType;
  title: string;
  message: string;
  recipientId: string;
  data?: NotificationData;
  channels?: NotificationChannel[];
}

// Type for status messages
interface StatusMessage {
  title: string;
  message: string;
}

// Type for status message mapping
type StatusMessageMap = Record<string, StatusMessage>;

/**
 * Notification service for sending various types of notifications
 */
@Injectable()
export class NotificationsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Send a notification to a user
   * @param payload The notification payload
   */
  async sendNotification(payload: NotificationPayload): Promise<void> {
    const {
      type,
      title,
      message,
      recipientId,
      data = {},
      channels = [NotificationChannel.IN_APP],
    } = payload;

    // Log notification to database for in-app notifications and history
    const { error } = await this.supabaseService.client
      .from('notifications')
      .insert({
        type,
        title,
        message,
        recipient_id: recipientId,
        data,
        read: false,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving notification:', error);
    }

    // Handle each notification channel
    for (const channel of channels) {
      switch (channel) {
        case NotificationChannel.EMAIL:
          await this.sendEmailNotification(recipientId, title, message, data);
          break;
        case NotificationChannel.SMS:
          await this.sendSmsNotification(recipientId, message);
          break;
        case NotificationChannel.PUSH:
          await this.sendPushNotification(recipientId, title, message, data);
          break;
        case NotificationChannel.IN_APP:
          // Already handled by database insert
          break;
      }
    }
  }

  /**
   * Send order status notification
   * @param orderId The order ID
   * @param status The new order status
   * @param userId The user ID to notify
   */
  async sendOrderStatusNotification(
    orderId: string,
    status: string,
    userId: string,
  ): Promise<void> {
    const statusMessages: StatusMessageMap = {
      placed: {
        title: 'Order Received',
        message: `Your order #${orderId} has been received and is being processed.`,
      },
      confirmed: {
        title: 'Order Confirmed',
        message: `Your order #${orderId} has been confirmed and is being prepared.`,
      },
      cancelled: {
        title: 'Order Cancelled',
        message: `Your order #${orderId} has been cancelled.`,
      },
      completed: {
        title: 'Order Completed',
        message: `Your order #${orderId} has been completed. Enjoy!`,
      },
    };

    const defaultMessage: StatusMessage = {
      title: 'Order Update',
      message: `Your order #${orderId} status has been updated to: ${status}`,
    };

    const statusInfo = statusMessages[status] || defaultMessage;

    let notificationType: NotificationType;

    if (status === 'placed') {
      notificationType = NotificationType.ORDER_PLACED;
    } else if (status === 'confirmed') {
      notificationType = NotificationType.ORDER_CONFIRMED;
    } else if (status === 'cancelled') {
      notificationType = NotificationType.ORDER_CANCELLED;
    } else {
      notificationType = NotificationType.ORDER_CONFIRMED;
    }

    await this.sendNotification({
      type: notificationType,
      title: statusInfo.title,
      message: statusInfo.message,
      recipientId: userId,
      data: { orderId, status },
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
    });
  }

  /**
   * Send delivery status notification
   * @param deliveryId The delivery ID
   * @param status The new delivery status
   * @param userId The user ID to notify
   */
  async sendDeliveryStatusNotification(
    deliveryId: string,
    status: string,
    userId: string,
  ): Promise<void> {
    const statusMessages: StatusMessageMap = {
      assigned: {
        title: 'Delivery Assigned',
        message: 'A delivery agent has been assigned to your order.',
      },
      en_route_pickup: {
        title: 'Delivery Update',
        message: 'Your delivery agent is on the way to pick up your order.',
      },
      picked_up: {
        title: 'Order Picked Up',
        message: 'Your order has been picked up and is on the way to you.',
      },
      en_route_delivery: {
        title: 'Out for Delivery',
        message: 'Your order is out for delivery and will arrive soon.',
      },
      delivered: {
        title: 'Order Delivered',
        message: 'Your order has been delivered. Enjoy!',
      },
      failed: {
        title: 'Delivery Failed',
        message:
          'We encountered an issue with your delivery. Our customer service will contact you.',
      },
    };

    const defaultMessage: StatusMessage = {
      title: 'Delivery Update',
      message: `Your delivery status has been updated to: ${status}`,
    };

    const statusInfo = statusMessages[status] || defaultMessage;

    let notificationType: NotificationType;
    switch (status) {
      case 'assigned':
        notificationType = NotificationType.DELIVERY_ASSIGNED;
        break;
      case 'picked_up':
        notificationType = NotificationType.DELIVERY_PICKED_UP;
        break;
      case 'en_route_delivery':
        notificationType = NotificationType.DELIVERY_EN_ROUTE;
        break;
      case 'delivered':
        notificationType = NotificationType.DELIVERY_COMPLETED;
        break;
      case 'failed':
        notificationType = NotificationType.DELIVERY_FAILED;
        break;
      default:
        notificationType = NotificationType.DELIVERY_EN_ROUTE;
    }

    await this.sendNotification({
      type: notificationType,
      title: statusInfo.title,
      message: statusInfo.message,
      recipientId: userId,
      data: { deliveryId, status },
      channels: [NotificationChannel.IN_APP, NotificationChannel.PUSH],
    });
  }

  /**
   * Send a notification about a delivery assignment
   * @param orderId The ID of the order being assigned
   * @param decision The delivery decision containing method and assignee details
   */
  async sendDeliveryAssignment(
    orderId: string,
    decision: { method: string; assigneeId: string; estimatedTime: number },
  ): Promise<void> {
    try {
      // Get order and recipient details
      const { data: orderData } = await this.supabaseService.client
        .from('orders')
        .select('user_id, total_amount')
        .eq('id', orderId)
        .single();

      if (!orderData) {
        console.error(
          `Order ${orderId} not found for delivery assignment notification`,
        );
        return;
      }

      // Type-safe extraction of order properties
      const order = {
        user_id: String(orderData.user_id || ''),
        total_amount: Number(orderData.total_amount || 0),
      };

      const assigneeType = decision.method === 'drone' ? 'drone' : 'rider';
      const estimatedMinutes = Math.round(decision.estimatedTime);

      // Prepare notification content
      const title = 'Your Order is on the Way!';
      const message = `Your order #${orderId} has been assigned to a ${assigneeType}. Estimated delivery time: ${estimatedMinutes} minutes.`;

      // Send the notification
      await this.sendNotification({
        type: NotificationType.DELIVERY_ASSIGNED,
        title,
        message,
        recipientId: order.user_id,
        data: {
          orderId,
          assigneeType,
          assigneeId: decision.assigneeId,
          estimatedDeliveryTime: new Date(
            Date.now() + decision.estimatedTime * 60 * 1000,
          ).toISOString(),
        },
        channels: [NotificationChannel.PUSH, NotificationChannel.IN_APP],
      });

      // If it's a high-value order, also send an SMS
      if (order.total_amount > 100) {
        await this.sendNotification({
          type: NotificationType.DELIVERY_ASSIGNED,
          title,
          message,
          recipientId: order.user_id,
          data: { orderId },
          channels: [NotificationChannel.SMS],
        });
      }
    } catch (error) {
      console.error('Error sending delivery assignment notification:', error);
    }
  }

  /**
   * Create a new notification
   */
  async createNotification(createNotificationDto: any): Promise<any> {
    const { data, error } = await this.supabaseService.client
      .from('notifications')
      .insert({
        user_id: createNotificationDto.userId,
        type: createNotificationDto.type,
        title: createNotificationDto.title,
        message: createNotificationDto.message,
        data: createNotificationDto.data,
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create notification: ${error.message}`);
    }

    return data;
  }

  /**
   * Get notifications with pagination and filters
   */
  async getNotifications(query: any): Promise<any> {
    return this.getUserNotifications(query.userId || '', query);
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(userId: string): Promise<any> {
    const { data, error } = await this.supabaseService.client
      .from('user_notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get preferences: ${error.message}`);
    }

    return (
      data || {
        userId,
        emailEnabled: true,
        smsEnabled: true,
        pushEnabled: true,
        orderUpdates: true,
        deliveryUpdates: true,
        promotions: true,
      }
    );
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(userId: string, preferences: any): Promise<any> {
    const { data, error } = await this.supabaseService.client
      .from('user_notification_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update preferences: ${error.message}`);
    }

    return data;
  }

  /**
   * Get notification by ID
   */
  async getNotificationById(id: string): Promise<any> {
    const { data, error } = await this.supabaseService.client
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to get notification: ${error.message}`);
    }

    return data;
  }

  /**
   * Update notification
   */
  async updateNotification(id: string, updateData: any): Promise<any> {
    const { data, error } = await this.supabaseService.client
      .from('notifications')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update notification: ${error.message}`);
    }

    return data;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<any> {
    const { data, error } = await this.supabaseService.client
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }

    return data;
  }

  /**
   * Mark all notifications as read for user
   */
  async markAllAsRead(userId: string): Promise<any> {
    return this.markAllNotificationsAsRead(userId);
  }

  /**
   * Delete notification
   */
  async deleteNotification(id: string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete notification: ${error.message}`);
    }
  }

  /**
   * Send order confirmation notification
   */
  async sendOrderConfirmation(order: any): Promise<void> {
    await this.sendNotification({
      recipientId: order.customerId || order.customer_id,
      type: NotificationType.ORDER_CONFIRMED,
      title: 'Order Confirmed',
      message: `Your order #${order.id} has been confirmed and is being prepared.`,
      data: { orderId: order.id },
      channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
    });
  }

  /**
   * Get all notifications for a user
   * @param userId The user ID
   * @param page Page number
   * @param limit Items per page
   */
  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const { data, error, count } = await this.supabaseService.client
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      throw new Error(`Failed to get notifications: ${error.message}`);
    }

    return {
      notifications: data,
      total: count ?? 0,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    };
  }

  /**
   * Mark a notification as read
   * @param notificationId The notification ID
   * @param userId The user ID
   */
  async markNotificationAsRead(
    notificationId: string,
    userId: string,
  ): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('recipient_id', userId);

    if (error) {
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  }

  /**
   * Mark all notifications as read for a user
   * @param userId The user ID
   */
  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('notifications')
      .update({ read: true })
      .eq('recipient_id', userId)
      .eq('read', false);

    if (error) {
      throw new Error(
        `Failed to mark all notifications as read: ${error.message}`,
      );
    }
  }

  /**
   * Send an email notification
   * @param recipientId The recipient user ID
   * @param title The notification title
   * @param message The notification message
   * @param data Additional data
   */
  private async sendEmailNotification(
    recipientId: string,
    title: string,
    message: string,
    data: NotificationData,
  ): Promise<void> {
    try {
      // Get user email from Supabase
      const { data: userData, error: userError } =
        await this.supabaseService.client
          .from('users')
          .select('email')
          .eq('id', recipientId)
          .single();

      if (userError || !userData) {
        console.error('Error getting user email:', userError);
        return;
      }

      // Here you would integrate with an email service like SendGrid, Mailgun, etc.
      // For now, we'll just log the email that would be sent
      console.log(
        `[EMAIL SERVICE] Sending email to ${userData.email}:
        Subject: ${title}
        Body: ${message}
        Data: ${JSON.stringify(data)}`,
      );

      // Example integration with SendGrid or similar service would go here
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  /**
   * Send an SMS notification
   * @param recipientId The recipient user ID
   * @param message The notification message
   */
  private async sendSmsNotification(
    recipientId: string,
    message: string,
  ): Promise<void> {
    try {
      // Get user phone from Supabase
      const { data: userData, error: userError } =
        await this.supabaseService.client
          .from('users')
          .select('phone')
          .eq('id', recipientId)
          .single();

      if (userError || !userData || !userData.phone) {
        console.error('Error getting user phone number:', userError);
        return;
      }

      // Here you would integrate with an SMS service like Twilio, Nexmo, etc.
      // For now, we'll just log the SMS that would be sent
      console.log(
        `[SMS SERVICE] Sending SMS to ${userData.phone}:
        Message: ${message}`,
      );

      // Example integration with Twilio or similar service would go here
    } catch (error) {
      console.error('Error sending SMS notification:', error);
    }
  }

  /**
   * Send a push notification
   * @param recipientId The recipient user ID
   * @param title The notification title
   * @param message The notification message
   * @param data Additional data
   */
  private async sendPushNotification(
    recipientId: string,
    title: string,
    message: string,
    data: NotificationData,
  ): Promise<void> {
    try {
      // Get user device tokens from Supabase
      const { data: deviceData, error: deviceError } =
        await this.supabaseService.client
          .from('user_devices')
          .select('device_token, platform')
          .eq('user_id', recipientId);

      if (deviceError || !deviceData || deviceData.length === 0) {
        console.error('Error getting user device tokens:', deviceError);
        return;
      }

      // Here you would integrate with a push notification service like Firebase Cloud Messaging, etc.
      // For now, we'll just log the push notification that would be sent
      for (const device of deviceData) {
        console.log(
          `[PUSH SERVICE] Sending push to ${device.device_token} (${device.platform}):
          Title: ${title}
          Message: ${message}
          Data: ${JSON.stringify(data)}`,
        );
      }

      // Example integration with FCM or similar service would go here
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }
}
