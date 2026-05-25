import { Request, Response } from 'express';
import InventoryLog from '../models/InventoryLog';

export const getAllInventoryLogs = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, productId, changeType } = req.query;
    const q: any = {};
    if (productId) q.productId = productId;
    if (changeType) q.changeType = changeType;
    const logs = await InventoryLog.find(q).sort({ createdAt: -1 }).limit(+limit).skip((+page - 1) * +limit);
    const total = await InventoryLog.countDocuments(q);
    res.json({ success: true, data: logs, meta: { pagination: { page: +page, limit: +limit, total, totalPages: Math.ceil(total / +limit) } } });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};
