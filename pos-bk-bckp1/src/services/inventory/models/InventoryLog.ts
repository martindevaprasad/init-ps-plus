import mongoose, { Document, Schema } from 'mongoose';

export interface IInventoryLog extends Document {
  productId: string; changeType: string; quantity: number;
  reason: string; userId: string; referenceId: string;
}

const logSchema = new Schema({
  productId: { type: String, required: true },
  changeType: { type: String, enum: ['purchase', 'waste', 'adjustment', 'sale'], required: true },
  quantity: { type: Number, required: true },
  reason: { type: String, required: true },
  userId: { type: String, required: true },
  referenceId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IInventoryLog>('InventoryLog', logSchema);
