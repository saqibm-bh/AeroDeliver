import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { StoresService } from '../stores.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from './dto/product.dto';

@Injectable()
export class InventoryService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly storesService: StoresService,
  ) {}

  async createProduct(ownerId: string, createProductDto: CreateProductDto) {
    // Verify that the user owns the store
    const store = await this.storesService.getStoreById(
      createProductDto.storeId,
    );
    if (store.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You do not have permission to add products to this store',
      );
    }

    const productData = {
      store_id: createProductDto.storeId,
      name: createProductDto.name,
      description: createProductDto.description,
      category: createProductDto.category,
      subcategory: createProductDto.subcategory,
      price: createProductDto.price,
      discounted_price: createProductDto.discountedPrice,
      image_url: createProductDto.imageUrl,
      additional_images: createProductDto.additionalImages,
      sku: createProductDto.sku,
      barcode: createProductDto.barcode,
      weight: createProductDto.weight,
      dimensions: createProductDto.dimensions,
      brand: createProductDto.brand,
      manufacturer: createProductDto.manufacturer,
      stock_quantity: createProductDto.stockQuantity,
      min_stock_level: createProductDto.minStockLevel,
      max_stock_level: createProductDto.maxStockLevel,
      features: createProductDto.features,
      ingredients: createProductDto.ingredients,
      nutritional_info: createProductDto.nutritionalInfo,
      preparation_time: createProductDto.preparationTime,
      spicy_level: createProductDto.spicyLevel,
      vegetarian: createProductDto.vegetarian,
      vegan: createProductDto.vegan,
      gluten_free: createProductDto.glutenFree,
      tags: createProductDto.tags,
      featured: createProductDto.featured,
      available: createProductDto.available ?? true,
      warranty: createProductDto.warranty,
      return_policy: createProductDto.returnPolicy,
      specifications: createProductDto.specifications,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabaseService.client
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return this.mapToProduct(data);
  }

  async updateProduct(
    productId: string,
    ownerId: string,
    updateProductDto: UpdateProductDto,
  ) {
    const { data: product, error: productError } =
      await this.supabaseService.client
        .from('products')
        .select('*, stores!inner(*)')
        .eq('id', productId)
        .single();

    if (productError || !product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stores.owner_id !== ownerId) {
      throw new ForbiddenException(
        'You do not have permission to update this product',
      );
    }

    const updateData = {};
    for (const [key, value] of Object.entries(updateProductDto)) {
      if (value !== undefined) {
        // Convert camelCase to snake_case
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        updateData[snakeKey] = value;
      }
    }

    updateData['updated_at'] = new Date().toISOString();

    const { data, error } = await this.supabaseService.client
      .from('products')
      .update(updateData)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }

    return this.mapToProduct(data);
  }

  async getProductById(productId: string) {
    const { data, error } = await this.supabaseService.client
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Product not found');
    }

    return this.mapToProduct(data);
  }

  async getProducts(query: ProductQueryDto) {
    let dbQuery = this.supabaseService.client
      .from('products')
      .select('*', { count: 'exact' });

    if (query.storeId) {
      dbQuery = dbQuery.eq('store_id', query.storeId);
    }

    if (query.category) {
      dbQuery = dbQuery.eq('category', query.category);
    }

    if (query.subcategory) {
      dbQuery = dbQuery.eq('subcategory', query.subcategory);
    }

    if (query.brand) {
      dbQuery = dbQuery.eq('brand', query.brand);
    }

    if (query.search) {
      dbQuery = dbQuery.or(
        `name.ilike.%${query.search}%,description.ilike.%${query.search}%`,
      );
    }

    if (query.tag) {
      dbQuery = dbQuery.contains('tags', [query.tag]);
    }

    if (query.available !== undefined) {
      dbQuery = dbQuery.eq('available', query.available);
    }

    if (query.featured !== undefined) {
      dbQuery = dbQuery.eq('featured', query.featured);
    }

    if (query.minPrice !== undefined) {
      dbQuery = dbQuery.gte('price', query.minPrice);
    }

    if (query.maxPrice !== undefined) {
      dbQuery = dbQuery.lte('price', query.maxPrice);
    }

    // Apply sorting
    const sortBy = query.sortBy || 'created_at';
    const sortOrder = query.sortOrder || 'desc';
    dbQuery = dbQuery.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;
    dbQuery = dbQuery.range(offset, offset + limit - 1);

    const { data, error, count } = await dbQuery;

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return {
      products: (data || []).map(this.mapToProduct),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  async deleteProduct(productId: string, ownerId: string) {
    const { data: product, error: productError } =
      await this.supabaseService.client
        .from('products')
        .select('*, stores!inner(*)')
        .eq('id', productId)
        .single();

    if (productError || !product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stores.owner_id !== ownerId) {
      throw new ForbiddenException(
        'You do not have permission to delete this product',
      );
    }

    const { error } = await this.supabaseService.client
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }

    return { success: true, message: 'Product deleted successfully' };
  }

  async getInventoryLevels(storeId: string, ownerId: string) {
    const store = await this.storesService.getStoreById(storeId);
    if (store.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You do not have permission to access this store inventory',
      );
    }

    const { data, error } = await this.supabaseService.client
      .from('products')
      .select('id, name, sku, stock_quantity, min_stock_level, max_stock_level')
      .eq('store_id', storeId)
      .order('stock_quantity', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch inventory levels: ${error.message}`);
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      stockQuantity: item.stock_quantity,
      minStockLevel: item.min_stock_level,
      maxStockLevel: item.max_stock_level,
      status: this.getInventoryStatus(
        item.stock_quantity,
        item.min_stock_level,
      ),
    }));
  }

  async updateInventoryLevel(
    productId: string,
    ownerId: string,
    quantity: number,
    action: 'set' | 'add' | 'subtract' = 'set',
  ) {
    const { data: product, error: productError } =
      await this.supabaseService.client
        .from('products')
        .select('*, stores!inner(*)')
        .eq('id', productId)
        .single();

    if (productError || !product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stores.owner_id !== ownerId) {
      throw new ForbiddenException(
        'You do not have permission to update this product inventory',
      );
    }

    let newQuantity: number;

    if (action === 'set') {
      newQuantity = quantity;
    } else if (action === 'add') {
      newQuantity = (product.stock_quantity || 0) + quantity;
    } else if (action === 'subtract') {
      newQuantity = Math.max(0, (product.stock_quantity || 0) - quantity);
    } else {
      throw new Error('Invalid inventory action');
    }

    const { data, error } = await this.supabaseService.client
      .from('products')
      .update({
        stock_quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update inventory level: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      stockQuantity: data.stock_quantity,
      minStockLevel: data.min_stock_level,
      maxStockLevel: data.max_stock_level,
      status: this.getInventoryStatus(
        data.stock_quantity,
        data.min_stock_level,
      ),
    };
  }

  private getInventoryStatus(quantity: number, minLevel: number) {
    if (quantity <= 0) {
      return 'OUT_OF_STOCK';
    } else if (quantity <= minLevel) {
      return 'LOW_STOCK';
    } else {
      return 'IN_STOCK';
    }
  }

  private mapToProduct(data: any) {
    return {
      id: data.id,
      storeId: data.store_id,
      name: data.name,
      description: data.description,
      category: data.category,
      subcategory: data.subcategory,
      price: data.price,
      discountedPrice: data.discounted_price,
      imageUrl: data.image_url,
      additionalImages: data.additional_images || [],
      sku: data.sku,
      barcode: data.barcode,
      weight: data.weight,
      dimensions: data.dimensions,
      brand: data.brand,
      manufacturer: data.manufacturer,
      stockQuantity: data.stock_quantity,
      minStockLevel: data.min_stock_level,
      maxStockLevel: data.max_stock_level,
      features: data.features || [],
      ingredients: data.ingredients || [],
      nutritionalInfo: data.nutritional_info,
      preparationTime: data.preparation_time,
      spicyLevel: data.spicy_level,
      vegetarian: data.vegetarian || false,
      vegan: data.vegan || false,
      glutenFree: data.gluten_free || false,
      tags: data.tags || [],
      featured: data.featured || false,
      available: data.available,
      warranty: data.warranty,
      returnPolicy: data.return_policy,
      specifications: data.specifications,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
