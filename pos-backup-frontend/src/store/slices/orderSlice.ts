import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Order, OrderItem } from '../../types';
import { generateOrderNumber } from '../../utils/formatters';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
}

const DEMO_ORDERS: Order[] = [
  {
    id: 'ord-1', orderNumber: 'ORD-20260416-001', tableNumber: 3,
    items: [
      { productId: 'p1', name: 'Croissant', price: 3.50, quantity: 2, modifiers: [], subtotal: 7.00 },
      { productId: 'p5', name: 'Cappuccino', price: 4.50, quantity: 2, modifiers: ['Oat milk'], subtotal: 9.00 },
    ],
    subtotal: 16.00, tax: 1.60, discount: 0, total: 17.60,
    status: 'cooking', paymentStatus: 'pending', staffId: 'demo-cash-001',
    createdAt: new Date(Date.now() - 1200000).toISOString(), updatedAt: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: 'ord-2', orderNumber: 'ORD-20260416-002', tableNumber: 7,
    items: [
      { productId: 'p3', name: 'Sourdough Loaf', price: 6.00, quantity: 1, modifiers: [], subtotal: 6.00 },
      { productId: 'p8', name: 'Caesar Salad', price: 12.00, quantity: 1, modifiers: ['No croutons'], subtotal: 12.00 },
    ],
    subtotal: 18.00, tax: 1.80, discount: 0, total: 19.80,
    status: 'ready', paymentStatus: 'pending', staffId: 'demo-cash-001',
    createdAt: new Date(Date.now() - 3600000).toISOString(), updatedAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'ord-3', orderNumber: 'ORD-20260416-003', tableNumber: 1,
    items: [
      { productId: 'p2', name: 'Blueberry Muffin', price: 4.00, quantity: 3, modifiers: [], subtotal: 12.00 },
    ],
    subtotal: 12.00, tax: 1.20, discount: 0, total: 13.20,
    status: 'completed', paymentStatus: 'paid', paymentMethod: 'card', staffId: 'demo-cash-001',
    createdAt: new Date(Date.now() - 7200000).toISOString(), updatedAt: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: 'ord-4', orderNumber: 'ORD-20260415-010', tableNumber: 5,
    items: [
      { productId: 'p6', name: 'Latte', price: 5.00, quantity: 2, modifiers: [], subtotal: 10.00 },
      { productId: 'p1', name: 'Croissant', price: 3.50, quantity: 1, modifiers: ['Chocolate'], subtotal: 3.50 },
      { productId: 'p10', name: 'Club Sandwich', price: 11.00, quantity: 1, modifiers: [], subtotal: 11.00 },
    ],
    subtotal: 24.50, tax: 2.45, discount: 2.00, total: 24.95,
    status: 'completed', paymentStatus: 'paid', paymentMethod: 'cash', staffId: 'demo-mgr-001',
    createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 82800000).toISOString(),
  },
];

const initialState: OrderState = {
  orders: DEMO_ORDERS,
  currentOrder: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    startNewOrder(state, action: PayloadAction<number>) {
      state.currentOrder = {
        id: 'new-' + Date.now(),
        orderNumber: generateOrderNumber(),
        tableNumber: action.payload,
        items: [],
        subtotal: 0, tax: 0, discount: 0, total: 0,
        status: 'pending',
        paymentStatus: 'pending',
        staffId: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
    addItemToOrder(state, action: PayloadAction<{ product: { id: string; name: string; price: number } }>) {
      if (!state.currentOrder) return;
      const { product } = action.payload;
      const existing = state.currentOrder.items.find(i => i.productId === product.id);
      if (existing) {
        existing.quantity += 1;
        existing.subtotal = existing.price * existing.quantity;
      } else {
        state.currentOrder.items.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          modifiers: [],
          subtotal: product.price,
        });
      }
      const sub = state.currentOrder.items.reduce((s, i) => s + i.subtotal, 0);
      state.currentOrder.subtotal = sub;
      state.currentOrder.tax = +(sub * 0.1).toFixed(2);
      state.currentOrder.total = +(sub + state.currentOrder.tax - state.currentOrder.discount).toFixed(2);
    },
    removeItemFromOrder(state, action: PayloadAction<string>) {
      if (!state.currentOrder) return;
      state.currentOrder.items = state.currentOrder.items.filter(i => i.productId !== action.payload);
      const sub = state.currentOrder.items.reduce((s, i) => s + i.subtotal, 0);
      state.currentOrder.subtotal = sub;
      state.currentOrder.tax = +(sub * 0.1).toFixed(2);
      state.currentOrder.total = +(sub + state.currentOrder.tax - state.currentOrder.discount).toFixed(2);
    },
    updateItemQuantity(state, action: PayloadAction<{ productId: string; quantity: number }>) {
      if (!state.currentOrder) return;
      const item = state.currentOrder.items.find(i => i.productId === action.payload.productId);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
        item.subtotal = item.price * item.quantity;
      }
      const sub = state.currentOrder.items.reduce((s, i) => s + i.subtotal, 0);
      state.currentOrder.subtotal = sub;
      state.currentOrder.tax = +(sub * 0.1).toFixed(2);
      state.currentOrder.total = +(sub + state.currentOrder.tax - state.currentOrder.discount).toFixed(2);
    },
    submitOrder(state, action: PayloadAction<string>) {
      if (!state.currentOrder || state.currentOrder.items.length === 0) return;
      state.currentOrder.staffId = action.payload;
      state.currentOrder.status = 'pending';
      state.orders.unshift({ ...state.currentOrder });
      state.currentOrder = null;
    },
    updateOrderStatus(state, action: PayloadAction<{ orderId: string; status: Order['status'] }>) {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
        order.updatedAt = new Date().toISOString();
      }
    },
    markOrderPaid(state, action: PayloadAction<{ orderId: string; method: Order['paymentMethod'] }>) {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.paymentStatus = 'paid';
        order.paymentMethod = action.payload.method;
        order.status = 'completed';
        order.updatedAt = new Date().toISOString();
      }
    },
    clearCurrentOrder(state) { state.currentOrder = null; },
    setDiscount(state, action: PayloadAction<number>) {
      if (!state.currentOrder) return;
      state.currentOrder.discount = action.payload;
      state.currentOrder.total = +(state.currentOrder.subtotal + state.currentOrder.tax - action.payload).toFixed(2);
    },
  },
});

export const {
  startNewOrder, addItemToOrder, removeItemFromOrder, updateItemQuantity,
  submitOrder, updateOrderStatus, markOrderPaid, clearCurrentOrder, setDiscount,
} = orderSlice.actions;
export default orderSlice.reducer;
