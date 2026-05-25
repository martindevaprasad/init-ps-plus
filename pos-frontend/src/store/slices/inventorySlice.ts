import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product, InventoryLog } from '../../types';

interface InventoryState {
  products: Product[];
  inventoryLogs: InventoryLog[];
}

const DEMO_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Butter Croissant', category: 'Bakery', price: 3.50, cost: 1.20, sku: 'BKY-001', barcode: '1000001', stockQuantity: 85, minStockLevel: 20, description: 'Flaky, golden butter croissant', isActive: true, isBakeryItem: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'p2', name: 'Blueberry Muffin', category: 'Bakery', price: 4.00, cost: 1.50, sku: 'BKY-002', barcode: '1000002', stockQuantity: 42, minStockLevel: 15, description: 'Moist muffin loaded with blueberries', isActive: true, isBakeryItem: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'p3', name: 'Sourdough Loaf', category: 'Bakery', price: 6.00, cost: 2.00, sku: 'BKY-003', barcode: '1000003', stockQuantity: 30, minStockLevel: 10, description: 'Artisan sourdough bread', isActive: true, isBakeryItem: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'p4', name: 'Chocolate Eclair', category: 'Bakery', price: 4.50, cost: 1.80, sku: 'BKY-004', barcode: '1000004', stockQuantity: 8, minStockLevel: 15, description: 'Classic eclair with chocolate ganache', isActive: true, isBakeryItem: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'p5', name: 'Cappuccino', category: 'Beverages', price: 4.50, cost: 1.00, sku: 'BEV-001', barcode: '2000001', stockQuantity: 200, minStockLevel: 50, description: 'Rich espresso with steamed milk foam', isActive: true, isBakeryItem: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'p6', name: 'Café Latte', category: 'Beverages', price: 5.00, cost: 1.10, sku: 'BEV-002', barcode: '2000002', stockQuantity: 200, minStockLevel: 50, description: 'Smooth espresso with velvety steamed milk', isActive: true, isBakeryItem: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'p7', name: 'Fresh Orange Juice', category: 'Beverages', price: 5.50, cost: 2.50, sku: 'BEV-003', barcode: '2000003', stockQuantity: 0, minStockLevel: 20, description: 'Freshly squeezed orange juice', isActive: true, isBakeryItem: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'p8', name: 'Caesar Salad', category: 'Food', price: 12.00, cost: 4.50, sku: 'FOD-001', barcode: '3000001', stockQuantity: 25, minStockLevel: 10, description: 'Classic Caesar with parmesan and croutons', isActive: true, isBakeryItem: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'p9', name: 'Margherita Pizza', category: 'Food', price: 14.00, cost: 5.00, sku: 'FOD-002', barcode: '3000002', stockQuantity: 18, minStockLevel: 8, description: 'Wood-fired pizza with fresh mozzarella', isActive: true, isBakeryItem: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'p10', name: 'Club Sandwich', category: 'Food', price: 11.00, cost: 3.80, sku: 'FOD-003', barcode: '3000003', stockQuantity: 22, minStockLevel: 10, description: 'Triple-decker with turkey, bacon, and avocado', isActive: true, isBakeryItem: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'p11', name: 'Tiramisu', category: 'Desserts', price: 7.50, cost: 3.00, sku: 'DST-001', barcode: '4000001', stockQuantity: 12, minStockLevel: 5, description: 'Classic Italian coffee-flavored dessert', isActive: true, isBakeryItem: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'p12', name: 'Cinnamon Roll', category: 'Bakery', price: 4.50, cost: 1.60, sku: 'BKY-005', barcode: '1000005', stockQuantity: 35, minStockLevel: 15, description: 'Warm cinnamon roll with cream cheese icing', isActive: true, isBakeryItem: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const DEMO_LOGS: InventoryLog[] = [
  { id: 'log-1', productId: 'p1', changeType: 'purchase', quantity: 50, reason: 'Morning batch delivery', userId: 'demo-mgr-001', referenceId: 'PO-001', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'log-2', productId: 'p7', changeType: 'waste', quantity: 5, reason: 'Expired stock', userId: 'demo-mgr-001', referenceId: 'WST-001', createdAt: new Date(Date.now() - 43200000).toISOString() },
  { id: 'log-3', productId: 'p4', changeType: 'sale', quantity: 3, reason: 'Order ORD-20260416-003', userId: 'demo-cash-001', referenceId: 'ord-3', createdAt: new Date(Date.now() - 7200000).toISOString() },
];

const initialState: InventoryState = {
  products: DEMO_PRODUCTS,
  inventoryLogs: DEMO_LOGS,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) { state.products.push(action.payload); },
    updateProduct(state, action: PayloadAction<Product>) {
      const idx = state.products.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.products[idx] = action.payload;
    },
    deleteProduct(state, action: PayloadAction<string>) {
      const p = state.products.find(p => p.id === action.payload);
      if (p) p.isActive = false;
    },
    adjustStock(state, action: PayloadAction<{ productId: string; quantity: number; type: InventoryLog['changeType']; reason: string }>) {
      const product = state.products.find(p => p.id === action.payload.productId);
      if (!product) return;
      if (action.payload.type === 'purchase' || action.payload.type === 'adjustment') {
        product.stockQuantity += action.payload.quantity;
      } else {
        product.stockQuantity = Math.max(0, product.stockQuantity - action.payload.quantity);
      }
      state.inventoryLogs.unshift({
        id: 'log-' + Date.now(),
        productId: action.payload.productId,
        changeType: action.payload.type,
        quantity: action.payload.quantity,
        reason: action.payload.reason,
        userId: 'current-user',
        referenceId: 'manual',
        createdAt: new Date().toISOString(),
      });
    },
  },
});

export const { addProduct, updateProduct, deleteProduct, adjustStock } = inventorySlice.actions;
export default inventorySlice.reducer;
