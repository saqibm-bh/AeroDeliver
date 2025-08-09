import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { CartItem, Cart } from './interfaces/cart.interface';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly productsService: ProductsService,
  ) {}

  async getUserCart(userId: string): Promise<Cart> {
    // First get the cart
    const { data: cart, error: cartError } = await this.supabaseService.client
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (cartError) {
      throw new Error(`Failed to fetch cart: ${cartError.message}`);
    }

    // If no cart exists, create one
    let cartId: string;
    if (!cart) {
      const { data: newCart, error: newCartError } =
        await this.supabaseService.client
          .from('carts')
          .insert({ user_id: userId, created_at: new Date().toISOString() })
          .select('id')
          .single();

      if (newCartError || !newCart) {
        throw new Error(`Failed to create cart: ${newCartError?.message}`);
      }
      cartId = newCart.id;
    } else {
      cartId = cart.id;
    }

    // Get cart items
    const { data: items, error: itemsError } = await this.supabaseService.client
      .from('cart_items')
      .select('*, product:product_id(*)')
      .eq('cart_id', cartId);

    if (itemsError) {
      throw new Error(`Failed to fetch cart items: ${itemsError.message}`);
    }

    // Calculate totals
    let subtotal = 0;
    for (const item of items || []) {
      subtotal += (item.product?.price || 0) * item.quantity;
    }

    return {
      id: cartId,
      userId,
      items: items || [],
      subtotal,
      itemCount: (items || []).reduce((acc, item) => acc + item.quantity, 0),
      createdAt: cart?.created_at || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    const { productId, quantity, variantId, notes } = addToCartDto;

    // Validate product exists
    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Get or create user cart
    const cart = await this.getUserCart(userId);

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product_id === productId &&
        ((!variantId && !item.variant_id) || variantId === item.variant_id),
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const existingItem = cart.items[existingItemIndex];
      return this.updateCartItem(userId, existingItem.id, {
        quantity: existingItem.quantity + quantity,
      });
    }

    // Add new item to cart
    const { data: cartItem, error } = await this.supabaseService.client
      .from('cart_items')
      .insert({
        cart_id: cart.id,
        product_id: productId,
        variant_id: variantId,
        quantity,
        notes,
        added_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add item to cart: ${error.message}`);
    }

    // Refresh and return the updated cart
    return this.getUserCart(userId);
  }

  async updateCartItem(
    userId: string,
    cartItemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    // Ensure the cart item belongs to the user
    const cart = await this.getUserCart(userId);
    const cartItem = cart.items.find((item) => item.id === cartItemId);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // If quantity is 0, remove the item
    if (updateCartItemDto.quantity === 0) {
      return this.removeCartItem(userId, cartItemId);
    }

    // Update the cart item
    const { error } = await this.supabaseService.client
      .from('cart_items')
      .update({
        quantity: updateCartItemDto.quantity,
        notes: updateCartItemDto.notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', cartItemId);

    if (error) {
      throw new Error(`Failed to update cart item: ${error.message}`);
    }

    // Refresh and return the updated cart
    return this.getUserCart(userId);
  }

  async removeCartItem(userId: string, cartItemId: string): Promise<Cart> {
    // Ensure the cart item belongs to the user
    const cart = await this.getUserCart(userId);
    const cartItem = cart.items.find((item) => item.id === cartItemId);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // Remove the cart item
    const { error } = await this.supabaseService.client
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) {
      throw new Error(`Failed to remove cart item: ${error.message}`);
    }

    // Refresh and return the updated cart
    return this.getUserCart(userId);
  }

  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.getUserCart(userId);

    if (cart.items.length === 0) {
      return cart;
    }

    // Delete all cart items
    const { error } = await this.supabaseService.client
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);

    if (error) {
      throw new Error(`Failed to clear cart: ${error.message}`);
    }

    // Refresh and return the updated cart
    return this.getUserCart(userId);
  }
}
