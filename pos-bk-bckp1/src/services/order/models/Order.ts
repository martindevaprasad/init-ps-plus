import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string; tableNumber?: number;
  items: { productId: string; name: string; price: number; quantity: number; modifiers: string[]; subtotal: number }[];
  subtotal: number; tax: number; discount: number; total: number;
  status: string; paymentStatus: string; paymentMethod?: string;
  staffId: string; customerName?: string; customerPhone?: string; notes?: string;
}

const orderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  tableNumber: Number,
  items: [{ productId: String, name: String, price: Number, quantity: Number, modifiers: [String], subtotal: Number }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'cooking', 'ready', 'served', 'completed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'partial', 'paid', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cash', 'card', 'mobile'] },
  staffId: { type: String, required: true },
  customerName: String, customerPhone: String, notes: String,
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', orderSchema);
