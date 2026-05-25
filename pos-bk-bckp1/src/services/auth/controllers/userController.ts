import { Request, Response } from 'express';
import User from '../models/User';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const q: any = {};
    if (search) q.$or = [{ username: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const users = await User.find(q).select('-password').sort({ createdAt: -1 }).limit(+limit).skip((+page - 1) * +limit);
    const total = await User.countDocuments(q);
    res.json({ success: true, data: users, meta: { pagination: { page: +page, limit: +limit, total, totalPages: Math.ceil(total / +limit) } } });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    res.json({ success: true, data: user });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await new User(req.body).save();
    res.status(201).json({ success: true, data: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    res.json({ success: true, data: user });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, data: { message: 'User deactivated' } });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};
