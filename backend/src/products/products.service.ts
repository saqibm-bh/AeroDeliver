import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from './dto/product.dto';
import { Product } from './interfaces/product.interface';

@Injectable()
export class ProductsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllProducts(query: ProductQueryDto): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, category, search } = query;
    const offset = (page - 1) * limit;

    let queryBuilder = this.supabaseService.client
      .from('products')
      .select('*', { count: 'exact' });

    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    if (search) {
      queryBuilder = queryBuilder.ilike('name', `%${search}%`);
    }

    const { data, error, count } = await queryBuilder
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return {
      products: data || [],
      total: count || 0,
      page: Number(page),
      limit: Number(limit),
    };
  }

  async getProductById(id: string): Promise<Product> {
    const { data, error } = await this.supabaseService.client
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Product not found');
    }

    return data;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { data, error } = await this.supabaseService.client
      .from('products')
      .insert({
        ...createProductDto,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return data;
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { data, error } = await this.supabaseService.client
      .from('products')
      .update({
        ...updateProductDto,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('Product not found or failed to update');
    }

    return data;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<Product> {
    return this.getProductById(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await this.supabaseService.client
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch products by category: ${error.message}`);
    }

    return data || [];
  }
}
