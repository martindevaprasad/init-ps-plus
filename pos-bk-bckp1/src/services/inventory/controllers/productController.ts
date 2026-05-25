import { Request, Response } from 'express';
import Product from '../models/Product';
import InventoryLog from '../models/InventoryLog';
import { AuthRequest } from '../../../middleware/auth';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, category, search } = req.query;
    const q: any = {};
    if (category) q.category = category;
    if (search) q.$or = [{ name: { $regex: search, $options: 'i' } }, { sku: { $regex: search, $options: 'i' } }];
    const products = await Product.find(q).sort({ createdAt: -1 }).limit(+limit).skip((+page - 1) * +limit);
    const total = await Product.countDocuments(q);
    res.json({ success: true, data: products, meta: { pagination: { page: +page, limit: +limit, total, totalPages: Math.ceil(total / +limit) } } });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } });
    res.json({ success: true, data: p });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const p = await new Product(req.body).save();
    res.status(201).json({ success: true, data: p });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } });
    res.json({ success: true, data: p });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};

export const updateStock = async (req: AuthRequest, res: Response) => {
  try {
    const { quantity, changeType, reason, referenceId } = req.body;
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Product not found' } });
    let newQty = p.stockQuantity;
    if (changeType === 'purchase' || changeType === 'adjustment') newQty += quantity;
    else newQty = Math.max(0, newQty - quantity);
    p.stockQuantity = newQty; await p.save();
    const log = await new InventoryLog({ productId: req.params.id, changeType, quantity, reason, userId: req.user?.id || '', referenceId: referenceId || 'manual' }).save();
    res.json({ success: true, data: { product: p, log } });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, data: { message: 'Product deactivated' } });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};
