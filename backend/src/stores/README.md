# Stores Module for AeroDeliver

This module provides comprehensive functionality for managing multi-category stores in the AeroDeliver platform, replacing the previous restaurant-specific implementation with a more versatile solution that supports various business types.

## Features

- Multi-category store management (restaurants, clothing, electronics, etc.)
- Store profile management (contact info, operating hours, etc.)
- Inventory management for products across different store types
- Store analytics and performance metrics
- Store search and filtering by various criteria

## Module Structure

- **StoresModule**: Main module for store management
- **StoresController**: API endpoints for store operations
- **StoresService**: Core functionality for store management
- **InventoryModule**: Submodule for product inventory management
  - **InventoryController**: API endpoints for inventory operations
  - **InventoryService**: Core functionality for inventory management

## DTOs

- **CreateStoreDto**: Data structure for creating new stores
- **UpdateStoreDto**: Data structure for updating existing stores
- **StoreQueryDto**: Data structure for querying stores with filters
- **StoreStatsDto**: Data structure for store statistics queries
- **CreateProductDto**: Data structure for creating new products
- **UpdateProductDto**: Data structure for updating existing products
- **ProductQueryDto**: Data structure for querying products with filters

## API Endpoints

### Stores

- `POST /stores`: Create a new store
- `GET /stores`: Get all stores with filtering options
- `GET /stores/my-stores`: Get stores owned by the current user
- `GET /stores/:id`: Get a specific store by ID
- `PUT /stores/:id`: Update a store
- `DELETE /stores/:id`: Delete a store
- `GET /stores/:id/analytics`: Get analytics for a store

### Inventory

- `POST /inventory/products`: Create a new product
- `GET /inventory/products`: Get products with filtering options
- `GET /inventory/products/:id`: Get a specific product
- `PUT /inventory/products/:id`: Update a product
- `DELETE /inventory/products/:id`: Delete a product
- `GET /inventory/stores/:storeId/levels`: Get inventory levels for a store
- `PUT /inventory/products/:id/stock`: Update product inventory level

## Database Structure

The Stores Module uses the following tables in the database:

- `stores`: Stores information and metadata
- `products`: Product inventory for all store types

## Migration from Restaurants

This module replaces the previous RestaurantsModule with a more versatile solution. The migration process includes:

1. Creating new `stores` table with enhanced schema
2. Migrating data from `restaurants` to `stores` with appropriate transformations
3. Creating a backward compatibility view (`restaurants_view`) for legacy code
4. Updating foreign keys in related tables to reference the new `stores` table

## Example Usage

```typescript
// Creating a new store
const newStore = await storesService.createStore(userId, {
  name: "Electronics Plus",
  description: "Your one-stop shop for electronics",
  storeType: StoreType.ELECTRONICS,
  address: "123 Tech Street",
  // ...other store details
});

// Adding a product to inventory
const newProduct = await inventoryService.createProduct(userId, {
  storeId: storeId,
  name: "Smartphone X",
  description: "Latest smartphone with advanced features",
  category: ProductCategory.ELECTRONICS,
  subcategory: "Smartphones",
  price: 699.99,
  // ...other product details
});

// Getting store analytics
const analytics = await storesService.getStoreAnalytics(
  storeId, 
  userId,
  { startDate: "2025-01-01", endDate: "2025-07-31" }
);
```
