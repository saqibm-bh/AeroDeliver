import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from './dto/product.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async createProduct(
    @Request() req: any,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.inventoryService.createProduct(req.user.id, createProductDto);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get products with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
  })
  async getProducts(@Query() query: ProductQueryDto) {
    return this.inventoryService.getProducts(query);
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async getProductById(@Param('id') id: string) {
    return this.inventoryService.getProductById(id);
  }

  @Put('products/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
  })
  async updateProduct(
    @Param('id') id: string,
    @Request() req: any,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.inventoryService.updateProduct(
      id,
      req.user.id,
      updateProductDto,
    );
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 204,
    description: 'Product deleted successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: string, @Request() req: any) {
    return this.inventoryService.deleteProduct(id, req.user.id);
  }

  @Get('stores/:storeId/levels')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get inventory levels for a store' })
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiResponse({
    status: 200,
    description: 'Inventory levels retrieved successfully',
  })
  async getInventoryLevels(
    @Param('storeId') storeId: string,
    @Request() req: any,
  ) {
    return this.inventoryService.getInventoryLevels(storeId, req.user.id);
  }

  @Put('products/:id/stock')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update product inventory level' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Inventory level updated successfully',
  })
  async updateInventoryLevel(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: { quantity: number; action?: 'set' | 'add' | 'subtract' },
  ) {
    return this.inventoryService.updateInventoryLevel(
      id,
      req.user.id,
      body.quantity,
      body.action || 'set',
    );
  }
}
