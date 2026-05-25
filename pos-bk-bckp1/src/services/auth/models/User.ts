import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string; email: string; password: string;
  role: 'admin' | 'manager' | 'cashier' | 'kitchen';
  permissions: string[]; isActive: boolean; lastLogin?: Date;
  comparePassword(pw: string): Promise<boolean>;
}

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'manager', 'cashier', 'kitchen'], default: 'cashier' },
  permissions: [String],
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (pw: string) {
  return bcrypt.compare(pw, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
