import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken, generateRefreshToken } from '../../../utils/tokenUtils';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isActive: true });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }
    user.lastLogin = new Date(); await user.save();
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    res.json({ success: true, data: { token, refreshToken, user: { id: user._id, username: user.username, email: user.email, role: user.role, permissions: user.permissions } } });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    if (await User.findOne({ $or: [{ email }, { username }] })) {
      return res.status(400).json({ success: false, error: { code: 'USER_EXISTS', message: 'User already exists' } });
    }
    const user = await new User({ username, email, password, role: role || 'cashier' }).save();
    const token = generateToken(user);
    res.status(201).json({ success: true, data: { token, user: { id: user._id, username: user.username, email: user.email, role: user.role } } });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: rt } = req.body;
    if (!rt) return res.status(401).json({ success: false, error: { code: 'NO_TOKEN', message: 'Refresh token required' } });
    const decoded = jwt.verify(rt, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret') as any;
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    res.json({ success: true, data: { token: generateToken(user), refreshToken: generateRefreshToken(user) } });
  } catch (err: any) { res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid refresh token' } }); }
};
