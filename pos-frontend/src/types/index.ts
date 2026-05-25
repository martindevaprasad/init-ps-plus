// ── User Types ──────────────────────────────────────────
export interface User {
  id: string;
  _id?: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier' | 'kitchen';
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  accessibleTenants?: string[];
  createdAt: string;
  updatedAt: string;
}

// ── Category Types ──────────────────────────────────────
export interface Category {
  id?: string;
  _id?: string;
  name: string;
  parentCategory: string | Category | null;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ── Product / Inventory Types ───────────────────────────
export interface RecipeIngredient {
  ingredientId: string;
  quantity: number;
  unit: string;
}

export interface Product {
  id: string;
  _id?: string;
  name: string;
  category: string | Category;
  price: number;
  cost: number;
  sku: string;
  barcode: string;
  stockQuantity: number;
  minStockLevel: number;
  description: string;
  isActive: boolean;
  isBakeryItem: boolean;
  recipe?: RecipeIngredient[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryLog {
  id: string;
  _id?: string;
  productId: string;
  changeType: 'purchase' | 'waste' | 'adjustment' | 'sale';
  quantity: number;
  reason: string;
  userId: string;
  referenceId: string;
  createdAt: string;
}

// ── Order Types ─────────────────────────────────────────
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  modifiers: string[];
  subtotal: number;
}

export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'served' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'mobile';

export interface Order {
  id: string;
  _id?: string;
  orderNumber: string;
  tableNumber?: number;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  staffId: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Payment Types ───────────────────────────────────────
export interface Payment {
  id: string;
  _id?: string;
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  change?: number;
  staffId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ── API Response Types ──────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// ── Report Types ────────────────────────────────────────
export interface SalesReport {
  totalSales: number;
  totalOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  dailySales: Record<string, number>;
  bestSellingItems: { productId: string; name: string; quantity: number; revenue: number }[];
}

export interface InventoryReport {
  totalProducts: number;
  lowStockItems: Product[];
  outOfStockItems: Product[];
  totalValue: number;
  totalLowStock: number;
  totalOutOfStock: number;
}
