export enum NotificationType {
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_PREPARING = 'order_preparing',
  ORDER_READY = 'order_ready',
  ORDER_PICKED_UP = 'order_picked_up',
  ORDER_IN_TRANSIT = 'order_in_transit',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELLED = 'order_cancelled',
  DELIVERY_ASSIGNED = 'delivery_assigned',
  VEHICLE_LOW_BATTERY = 'vehicle_low_battery',
  VEHICLE_MAINTENANCE = 'vehicle_maintenance',
  SYSTEM_ALERT = 'system_alert',
  PROMOTION = 'promotion',
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  channels: NotificationChannel[];
  is_read: boolean;
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreference {
  id: string;
  user_id: string;
  type: NotificationType;
  enabled_channels: NotificationChannel[];
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}
