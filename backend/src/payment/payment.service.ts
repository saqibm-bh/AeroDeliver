import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import {
  NotificationsService,
  NotificationType,
} from '../notifications/notifications.service';
import {
  CreatePaymentDto,
  RefundRequestDto,
  DisputeDto,
} from './dto/payment.dto';
import {
  Payment,
  PaymentStatus,
  PaymentMethod,
  TransactionType,
  RefundStatus,
  PaymentProcessorResult,
  OrderData,
  OrderItem,
} from './interfaces/payment.interface';

interface ReceiptData {
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  total: number;
  paymentMethod: string;
  transactionId: string;
  timestamp: Date;
}

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
  ) {
    // Get Stripe secret key with better error handling
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!stripeSecretKey || stripeSecretKey === 'sk_test_dummy_key') {
      this.logger.warn(
        'Missing or default Stripe secret key. Payment processing will be limited.',
      );
    }

    try {
      this.stripe = new Stripe(stripeSecretKey || 'sk_test_dummy_key', {
        apiVersion: '2025-07-30.basil',
        typescript: true,
        appInfo: {
          name: 'AeroDeliver',
          version: '1.0.0',
        },
        timeout: 30000, // 30 second timeout
      });
      this.logger.log('Stripe payment processor initialized');
    } catch (error) {
      this.logger.error(
        'Failed to initialize Stripe payment processor:',
        error,
      );
      // Still create a Stripe instance to prevent errors, but it won't work correctly
      this.stripe = new Stripe('sk_test_dummy_key', {
        apiVersion: '2025-07-30.basil',
      });
    }
  }

  /**
   * Process payment with comprehensive error handling and transaction lifecycle
   */
  async processPayment(
    userId: string,
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    this.logger.log(
      `Processing payment for user ${userId}, amount: $${createPaymentDto.amount}`,
    );

    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    try {
      // Step 1: Validate payment request
      await this.validatePaymentRequest(createPaymentDto);

      // Step 2: Create payment record
      const payment = await this.createPaymentRecord(
        userId,
        createPaymentDto,
        transactionId,
      );

      // Step 3: Process payment with Stripe
      const stripeResult = await this.processStripePayment(
        createPaymentDto,
        transactionId,
      );

      // Step 4: Update payment status
      const completedPayment = await this.updatePaymentStatus(
        payment.id,
        stripeResult.success ? PaymentStatus.COMPLETED : PaymentStatus.FAILED,
        stripeResult,
      );

      // Step 5: Handle post-payment actions
      if (stripeResult.success) {
        await this.handleSuccessfulPayment(completedPayment, userId);
      } else {
        await this.handleFailedPayment(
          completedPayment,
          userId,
          stripeResult.error || 'Unknown error',
        );
      }

      this.logger.log(
        `Payment ${stripeResult.success ? 'completed' : 'failed'}: ${transactionId}`,
      );

      return completedPayment;
    } catch (error: any) {
      this.logger.error(
        `Payment processing failed for transaction ${transactionId}:`,
        error,
      );

      // Update payment status to failed
      try {
        await this.updatePaymentStatus(transactionId, PaymentStatus.FAILED, {
          success: false,
          transactionId,
          error: error.message || 'Unknown error',
        });
      } catch (updateError) {
        this.logger.error('Failed to update payment status:', updateError);
      }

      throw new BadRequestException(
        `Payment processing failed: ${error.message || 'Unknown error'}`,
      );
    }
  }

  /**
   * Validate payment request
   */
  private async validatePaymentRequest(
    createPaymentDto: CreatePaymentDto,
  ): Promise<void> {
    if (createPaymentDto.amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than 0');
    }

    if (createPaymentDto.amount > 10000) {
      throw new BadRequestException('Payment amount exceeds maximum limit');
    }

    // Validate payment method
    if (!createPaymentDto.paymentMethod) {
      throw new BadRequestException('Payment method is required');
    }

    // Validate order exists
    if (createPaymentDto.orderId) {
      const { data: order } = await this.supabaseService.client
        .from('orders')
        .select('id, status, total_amount')
        .eq('id', createPaymentDto.orderId)
        .single();

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status === 'paid') {
        throw new BadRequestException('Order has already been paid');
      }

      if (Math.abs(order.total_amount - createPaymentDto.amount) > 0.01) {
        throw new BadRequestException(
          'Payment amount does not match order total',
        );
      }
    }
  }

  /**
   * Create payment record in database
   */
  private async createPaymentRecord(
    userId: string,
    createPaymentDto: CreatePaymentDto,
    transactionId: string,
  ): Promise<Payment> {
    const { data, error } = await this.supabaseService.client
      .from('payments')
      .insert({
        id: transactionId,
        user_id: userId,
        order_id: createPaymentDto.orderId,
        amount: createPaymentDto.amount,
        currency: createPaymentDto.currency || 'USD',
        payment_method: createPaymentDto.paymentMethod.type,
        status: PaymentStatus.PENDING,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(
        `Failed to create payment record: ${error.message}`,
      );
    }

    return data as Payment;
  }

  /**
   * Process payment with Stripe
   */
  private async processStripePayment(
    createPaymentDto: CreatePaymentDto,
    transactionId: string,
  ): Promise<PaymentProcessorResult> {
    try {
      // Prepare payment method handling
      let paymentMethodOptions = {};
      const paymentMethod = createPaymentDto.paymentMethod;

      if (
        paymentMethod.type === PaymentMethod.CREDIT_CARD ||
        paymentMethod.type === PaymentMethod.DEBIT_CARD
      ) {
        // Standard card payment
        paymentMethodOptions = {
          payment_method_types: ['card'],
        };
      } else if (paymentMethod.type === PaymentMethod.PAYPAL) {
        // PayPal specific handling
        paymentMethodOptions = {
          payment_method_types: ['paypal'],
          payment_method_options: {
            paypal: {
              capture_method: 'automatic',
            },
          },
        };
      } else if (
        paymentMethod.type === PaymentMethod.GOOGLE_PAY ||
        paymentMethod.type === PaymentMethod.APPLE_PAY
      ) {
        // Digital wallet handling
        paymentMethodOptions = {
          payment_method_types: ['card'],
        };
      } else {
        // Default to card for other methods
        paymentMethodOptions = {
          payment_method_types: ['card'],
        };
      }

      // Create idempotent payment request
      const idempotencyKey = `payment_${transactionId}_${Date.now()}`;

      // Create payment intent with enhanced options
      const paymentIntent = await this.stripe.paymentIntents.create(
        {
          amount: Math.round(createPaymentDto.amount * 100), // Convert to cents
          currency: createPaymentDto.currency?.toLowerCase() || 'usd',
          ...paymentMethodOptions,
          confirmation_method: 'manual',
          confirm: true,
          return_url:
            this.configService.get<string>('FRONTEND_URL') +
            '/payment/complete',
          metadata: {
            transactionId,
            orderId: createPaymentDto.orderId || '',
            paymentType: createPaymentDto.paymentMethod?.type || 'unknown',
          },
          description: `Payment for order ${createPaymentDto.orderId}`,
          statement_descriptor: 'AERODELIVER',
          statement_descriptor_suffix: 'ORDER',
          capture_method: 'automatic',
        },
        {
          idempotencyKey,
          stripeAccount:
            this.configService.get<string>('STRIPE_ACCOUNT_ID') || undefined,
        },
      );

      // Handle payment intent status
      if (paymentIntent.status === 'succeeded') {
        this.logger.log(`Payment succeeded: ${paymentIntent.id}`);
        return {
          success: true,
          transactionId,
          stripePaymentIntentId: paymentIntent.id,
        };
      } else if (paymentIntent.status === 'requires_action') {
        this.logger.log(`Payment requires action: ${paymentIntent.id}`);
        // Handle 3D Secure or other authentication requirements
        return {
          success: false,
          transactionId,
          error: 'Payment requires additional authentication',
          stripePaymentIntentId: paymentIntent.id,
        };
      } else {
        this.logger.warn(
          `Payment incomplete with status: ${paymentIntent.status}`,
        );
        return {
          success: false,
          transactionId,
          error: `Payment failed with status: ${paymentIntent.status}`,
          stripePaymentIntentId: paymentIntent.id,
        };
      }
    } catch (error: any) {
      this.logger.error('Stripe payment processing failed:', error);

      let errorMessage = 'Payment processing failed';

      // Enhanced error handling with specific error messages
      if (error.type) {
        switch (error.type) {
          case 'StripeCardError':
            errorMessage = error.message || 'Card was declined';
            break;
          case 'StripeInvalidRequestError':
            errorMessage = 'Invalid payment information';
            break;
          case 'StripeAPIError':
            errorMessage = 'Payment system error';
            break;
          case 'StripeAuthenticationError':
            errorMessage = 'Authentication with payment provider failed';
            this.logger.error('Stripe authentication error - check API keys');
            break;
          case 'StripeRateLimitError':
            errorMessage = 'Too many payment requests';
            break;
          default:
            errorMessage = 'Unexpected payment error';
        }
      }

      return {
        success: false,
        transactionId,
        error: errorMessage,
      };
    }
  }

  /**
   * Update payment status
   */
  private async updatePaymentStatus(
    paymentId: string,
    status: PaymentStatus,
    processorData: PaymentProcessorResult,
  ): Promise<Payment> {
    const { data, error } = await this.supabaseService.client
      .from('payments')
      .update({
        status,
        processor_transaction_id: processorData.stripePaymentIntentId,
        processor_response: JSON.stringify(processorData),
        updated_at: new Date().toISOString(),
        ...(status === PaymentStatus.COMPLETED && {
          completed_at: new Date().toISOString(),
        }),
        ...(status === PaymentStatus.FAILED && {
          failed_at: new Date().toISOString(),
        }),
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(
        `Failed to update payment status: ${error.message}`,
      );
    }

    return data as Payment;
  }

  /**
   * Handle successful payment
   */
  private async handleSuccessfulPayment(
    payment: Payment,
    userId: string,
  ): Promise<void> {
    try {
      // Update order status
      if (payment.order_id) {
        await this.supabaseService.client
          .from('orders')
          .update({
            status: 'paid',
            payment_id: payment.id,
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', payment.order_id);
      }

      // Create transaction record
      await this.createTransactionRecord({
        paymentId: payment.id,
        type: TransactionType.PAYMENT,
        amount: payment.amount,
        status: 'completed',
        description: `Payment for order ${payment.order_id}`,
      });

      // Generate receipt
      await this.generateReceipt(payment);

      // Send success notification
      await this.notificationsService.sendNotification({
        recipientId: userId,
        type: NotificationType.PAYMENT_RECEIVED,
        title: 'Payment Successful',
        message: `Your payment of $${payment.amount} has been processed successfully.`,
        data: { paymentId: payment.id, orderId: payment.order_id },
      });

      this.logger.log(
        `Payment success handling completed for payment ${payment.id}`,
      );
    } catch (error) {
      this.logger.error('Error in success payment handling:', error);
      // Don't throw here as payment was successful
    }
  }

  /**
   * Handle failed payment
   */
  private async handleFailedPayment(
    payment: Payment,
    userId: string,
    error: string,
  ): Promise<void> {
    try {
      // Create transaction record
      await this.createTransactionRecord({
        paymentId: payment.id,
        type: TransactionType.PAYMENT,
        amount: payment.amount,
        status: 'failed',
        description: `Failed payment for order ${payment.order_id}: ${error}`,
      });

      // Send failure notification
      await this.notificationsService.sendNotification({
        recipientId: userId,
        type: NotificationType.PAYMENT_FAILED,
        title: 'Payment Failed',
        message: `Your payment of $${payment.amount} could not be processed. ${error}`,
        data: { paymentId: payment.id, orderId: payment.order_id, error },
      });

      this.logger.log(
        `Payment failure handling completed for payment ${payment.id}`,
      );
    } catch (handlingError) {
      this.logger.error('Error in failed payment handling:', handlingError);
    }
  }

  /**
   * Create transaction record
   */
  private async createTransactionRecord(data: {
    paymentId: string;
    type: TransactionType;
    amount: number;
    status: string;
    description: string;
  }): Promise<void> {
    await this.supabaseService.client.from('transactions').insert({
      id: `trans_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      payment_id: data.paymentId,
      type: data.type,
      amount: data.amount,
      status: data.status,
      description: data.description,
      created_at: new Date().toISOString(),
    });
  }

  /**
   * Process refund
   */
  async processRefund(refundRequest: RefundRequestDto): Promise<{
    id: string;
    status: RefundStatus;
    amount: number;
  }> {
    this.logger.log(
      `Processing refund for payment ${refundRequest.paymentId}, amount: $${refundRequest.amount}`,
    );

    try {
      // Get original payment
      const { data: payment, error } = await this.supabaseService.client
        .from('payments')
        .select('*')
        .eq('id', refundRequest.paymentId)
        .single();

      if (error || !payment) {
        throw new NotFoundException('Payment not found');
      }

      const typedPayment = payment as Payment;

      if (typedPayment.status !== PaymentStatus.COMPLETED) {
        throw new BadRequestException('Can only refund completed payments');
      }

      // Validate refund amount
      const refundAmount = refundRequest.amount || typedPayment.amount;
      if (refundAmount > typedPayment.amount) {
        throw new BadRequestException(
          'Refund amount cannot exceed original payment amount',
        );
      }

      // Process refund with Stripe
      const stripeRefund = await this.stripe.refunds.create({
        payment_intent: typedPayment.processor_transaction_id as string,
        amount: Math.round(refundAmount * 100), // Convert to cents
        reason: refundRequest.reason as Stripe.RefundCreateParams.Reason,
        metadata: {
          originalPaymentId: typedPayment.id,
          refundReason: refundRequest.reason,
        },
      });

      // Create refund record
      const { data: refund } = await this.supabaseService.client
        .from('refunds')
        .insert({
          id: `ref_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          payment_id: typedPayment.id,
          amount: refundAmount,
          reason: refundRequest.reason,
          status: RefundStatus.PROCESSING,
          processor_refund_id: stripeRefund.id,
          requested_by: refundRequest.userId,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      const typedRefund = refund as {
        id: string;
        status: string;
        amount: number;
      };

      // Update refund status based on Stripe response
      const finalStatus =
        stripeRefund.status === 'succeeded'
          ? RefundStatus.COMPLETED
          : RefundStatus.PENDING;

      await this.supabaseService.client
        .from('refunds')
        .update({
          status: finalStatus,
          processed_at:
            stripeRefund.status === 'succeeded'
              ? new Date().toISOString()
              : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', typedRefund.id);

      // Create transaction record
      await this.createTransactionRecord({
        paymentId: typedPayment.id,
        type: TransactionType.REFUND,
        amount: -refundAmount, // Negative amount for refund
        status: finalStatus,
        description: `Refund: ${refundRequest.reason}`,
      });

      // Send notification
      await this.notificationsService.sendNotification({
        recipientId: typedPayment.user_id,
        type: NotificationType.PAYMENT_RECEIVED, // Using a generic payment type since REFUND_PROCESSED isn't defined
        title: 'Refund Processed',
        message: `A refund of $${refundAmount} has been processed for your payment.`,
        data: {
          paymentId: typedPayment.id,
          refundId: typedRefund.id,
          amount: refundAmount,
        },
      });

      this.logger.log(`Refund processed successfully: ${typedRefund.id}`);

      return { ...typedRefund, status: finalStatus };
    } catch (error: any) {
      this.logger.error(`Refund processing failed:`, error);
      throw new BadRequestException(
        `Refund processing failed: ${error.message || 'Unknown error'}`,
      );
    }
  }

  /**
   * Handle dispute
   */
  async handleDispute(disputeDto: DisputeDto): Promise<{
    id: string;
    payment_id: string;
    reason: string;
  }> {
    this.logger.log(`Handling dispute for payment ${disputeDto.paymentId}`);

    try {
      // Create dispute record
      const { data: dispute, error } = await this.supabaseService.client
        .from('disputes')
        .insert({
          id: `disp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          payment_id: disputeDto.paymentId,
          reason: disputeDto.reason,
          description: disputeDto.description,
          status: 'open',
          created_by: disputeDto.userId,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const typedDispute = dispute as {
        id: string;
        payment_id: string;
        reason: string;
      };

      // Notify relevant parties
      await this.notificationsService.sendNotification({
        recipientId: disputeDto.userId,
        type: NotificationType.PAYMENT_FAILED, // Using payment_failed as a close alternative
        title: 'Dispute Created',
        message: `Your dispute has been created and is being reviewed.`,
        data: { disputeId: typedDispute.id, paymentId: disputeDto.paymentId },
      });

      return typedDispute;
    } catch (error: any) {
      this.logger.error('Dispute handling failed:', error);
      throw new BadRequestException(
        `Dispute creation failed: ${error.message || 'Unknown error'}`,
      );
    }
  }

  /**
   * Generate receipt
   */
  async generateReceipt(payment: Payment): Promise<ReceiptData> {
    try {
      // Get order details
      const { data: orderData, error } = await this.supabaseService.client
        .from('orders')
        .select(
          `
          *,
          order_items (
            quantity,
            unit_price,
            product:products (
              name,
              price
            )
          )
        `,
        )
        .eq('id', payment.order_id)
        .single();

      if (error || !orderData) {
        throw new Error('Order not found for receipt generation');
      }

      const order = orderData as OrderData;

      // Build receipt data
      const receiptData: ReceiptData = {
        orderId: order.id,
        items: order.order_items.map((item: OrderItem) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.unit_price,
          total: item.quantity * item.unit_price,
        })),
        subtotal: order.subtotal || 0,
        deliveryFee: order.delivery_fee || 0,
        taxes: order.tax_amount || 0,
        total: payment.amount,
        paymentMethod: payment.payment_method,
        transactionId: payment.id,
        timestamp: payment.completed_at
          ? new Date(payment.completed_at)
          : new Date(),
      };

      // Store receipt
      await this.supabaseService.client.from('receipts').insert({
        id: `rcpt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        payment_id: payment.id,
        order_id: order.id,
        receipt_data: receiptData,
        generated_at: new Date().toISOString(),
      });

      return receiptData;
    } catch (error: any) {
      this.logger.error('Receipt generation failed:', error);
      throw error;
    }
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string): Promise<Payment> {
    const { data, error } = await this.supabaseService.client
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Payment not found');
    }

    return data as Payment;
  }

  /**
   * Get user payments
   */
  async getUserPayments(
    userId: string,
    limit: number = 50,
  ): Promise<Payment[]> {
    const { data, error } = await this.supabaseService.client
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new InternalServerErrorException(
        `Failed to fetch payments: ${error.message}`,
      );
    }

    return (data || []) as Payment[];
  }

  /**
   * Get payment methods for user
   */
  async getPaymentMethods(userId: string): Promise<Array<{
    id: string;
    type: string;
    card?: {
      brand: string;
      last4: string;
      exp_month: number;
      exp_year: number;
    };
    created: Date;
  }>> {
    try {
      // Get saved payment methods from Stripe
      const customer = await this.getOrCreateStripeCustomer(userId);

      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customer.id,
        type: 'card',
      });

      return paymentMethods.data.map((pm) => ({
        id: pm.id,
        type: pm.type,
        card: pm.card
          ? {
              brand: pm.card.brand,
              last4: pm.card.last4,
              exp_month: pm.card.exp_month,
              exp_year: pm.card.exp_year,
            }
          : undefined,
        created: new Date(pm.created * 1000),
      }));
    } catch (error: any) {
      this.logger.error('Failed to fetch payment methods:', error);
      return [];
    }
  }

  /**
   * Get or create Stripe customer
   */
  private async getOrCreateStripeCustomer(
    userId: string,
  ): Promise<Stripe.Customer> {
    // Check if customer exists in our database
    const { data: existingCustomer } = await this.supabaseService.client
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (existingCustomer?.stripe_customer_id) {
      return (await this.stripe.customers.retrieve(
        existingCustomer.stripe_customer_id as string,
      )) as Stripe.Customer;
    }

    // Get user details
    const { data: user } = await this.supabaseService.client
      .from('users')
      .select('email, full_name')
      .eq('id', userId)
      .single();

    // Create new Stripe customer
    const customer = await this.stripe.customers.create({
      email: user?.email as string,
      name: user?.full_name as string,
      metadata: { userId },
    });

    // Save customer ID
    await this.supabaseService.client.from('stripe_customers').insert({
      user_id: userId,
      stripe_customer_id: customer.id,
      created_at: new Date().toISOString(),
    });

    return customer;
  }

  /**
   * Get payments by order ID
   */
  async getPaymentsByOrderId(
    orderId: string, 
    userId?: string
  ): Promise<Payment[]> {
    const query = this.supabaseService.client
      .from('payments')
      .select('*')
      .eq('order_id', orderId);
      
    // If userId is provided, additionally filter by user_id
    if (userId) {
      query.eq('user_id', userId);
    }
    
    const { data, error } = await query;

    if (error) {
      throw new InternalServerErrorException(
        `Failed to fetch payments for order: ${error.message}`,
      );
    }

    return (data || []) as Payment[];
  }

  /**
   * Get user payment methods - alias for getPaymentMethods for backward compatibility
   */
  async getUserPaymentMethods(userId: string): Promise<Array<{
    id: string;
    type: string;
    card?: {
      brand: string;
      last4: string;
      exp_month: number;
      exp_year: number;
    };
    created: Date;
  }>> {
    return this.getPaymentMethods(userId);
  }

  /**
   * Add a payment method for a user
   */
  async addPaymentMethod(
    userId: string, 
    paymentMethodDto: any
  ): Promise<{
    id: string;
    type: string;
  }> {
    try {
      // Get Stripe customer
      const customer = await this.getOrCreateStripeCustomer(userId);
      
      // Attach payment method to customer
      const paymentMethod = await this.stripe.paymentMethods.attach(
        paymentMethodDto.paymentMethodId,
        { customer: customer.id }
      );
      
      // Update the payment method to be the default
      if (paymentMethodDto.setAsDefault) {
        await this.stripe.customers.update(customer.id, {
          invoice_settings: {
            default_payment_method: paymentMethodDto.paymentMethodId,
          },
        });
      }
      
      return {
        id: paymentMethod.id,
        type: paymentMethod.type,
      };
    } catch (error: any) {
      this.logger.error('Failed to add payment method:', error);
      throw new BadRequestException(
        `Failed to add payment method: ${error.message || 'Unknown error'}`
      );
    }
  }

  /**
   * Delete a payment method
   */
  async deletePaymentMethod(
    userId: string, 
    paymentMethodId: string
  ): Promise<{ success: boolean }> {
    try {
      // Verify user owns this payment method by checking customer
      const customer = await this.getOrCreateStripeCustomer(userId);
      
      // Get customer payment methods
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customer.id,
        type: 'card',
      });
      
      // Check if payment method belongs to customer
      const paymentMethodBelongsToCustomer = paymentMethods.data.some(
        (pm) => pm.id === paymentMethodId
      );
      
      if (!paymentMethodBelongsToCustomer) {
        throw new NotFoundException('Payment method not found for this user');
      }
      
      // Detach the payment method
      await this.stripe.paymentMethods.detach(paymentMethodId);
      
      return { success: true };
    } catch (error: any) {
      this.logger.error('Failed to delete payment method:', error);
      throw new BadRequestException(
        `Failed to delete payment method: ${error.message || 'Unknown error'}`
      );
    }
  }
}
