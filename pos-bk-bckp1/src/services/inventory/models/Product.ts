import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string; category: string; price: number; cost: number;
  sku: string; barcode: string; stockQuantity: number; minStockLevel: number;
  description: string; isActive: boolean; isBakeryItem: boolean;
  recipe?: { ingredientId: string; quantity: number; unit: string }[];
}

const productSchema = new Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  cost: { type: Number, required: true, min: 0 },
  sku: { type: String, required: true, unique: true },
  barcode: { type: String, unique: true, sparse: true },
  stockQuantity: { type: Number, default: 0, min: 0 },
  minStockLevel: { type: Number, default: 10, min: 0 },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  isBakeryItem: { type: Boolean, default: false },
  recipe: [{ ingredientId: String, quantity: Number, unit: String }],
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', productSchema);
