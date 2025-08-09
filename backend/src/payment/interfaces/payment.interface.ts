export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  CRYPTO = 'crypto',
  BANK_TRANSFER = 'bank_transfer',
  CASH_ON_DELIVERY = 'cash_on_delivery',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
  CANCELLED = 'cancelled',
}

export enum TransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  DISPUTE = 'dispute',
  CHARGEBACK = 'chargeback',
  ADJUSTMENT = 'adjustment',
}

export enum RefundStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface Payment {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  payment_method_id?: string;
  processor_transaction_id?: string;
  processor_response?: string;
  description?: string;
  refunded_amount?: number;
  refund_reason?: string;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  failed_at?: string;
}

export interface Transaction {
  id: string;
  payment_id: string;
  type: TransactionType;
  amount: number;
  status: string;
  description: string;
  created_at: string;
  processed_at?: string;
}

export interface SavedPaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  created: Date;
}

export interface Refund {
  id: string;
  payment_id: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  processor_refund_id?: string;
  requested_by: string;
  created_at: string;
  processed_at?: string;
  updated_at: string;
}

export interface Dispute {
  id: string;
  payment_id: string;
  reason: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  created_by: string;
  created_at: string;
  resolved_at?: string;
  resolution?: string;
}

export interface PaymentProcessorResult {
  success: boolean;
  transactionId: string;
  error?: string;
  stripePaymentIntentId?: string;
}

export interface StripeError {
  type: string;
  message?: string;
  code?: string;
  decline_code?: string;
}

export interface OrderData {
  id: string;
  status: string;
  subtotal: number;
  delivery_fee: number;
  tax_amount: number;
  order_items: OrderItem[];
}

export interface OrderItem {
  quantity: number;
  unit_price: number;
  product: {
    name: string;
    price: number;
  };
}
