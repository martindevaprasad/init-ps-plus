import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  orderId: string; amount: number; paymentMethod: string;
  status: string; transactionId?: string; change?: number; staffId: string; notes?: string;
}

const paymentSchema = new Schema({
  orderId: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ['cash', 'card', 'mobile'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  transactionId: String,
  change: Number,
  staffId: { type: String, required: true },
  notes: String,
}, { timestamps: true });

export default mongoose.model<IPayment>('Payment', paymentSchema);
