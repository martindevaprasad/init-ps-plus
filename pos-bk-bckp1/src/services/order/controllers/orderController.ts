import { Request, Response } from 'express';
import Order from '../models/Order';

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, status, tableNumber } = req.query;
    const q: any = {};
    if (status) q.status = status;
    if (tableNumber) q.tableNumber = tableNumber;
    const orders = await Order.find(q).sort({ createdAt: -1 }).limit(+limit).skip((+page - 1) * +limit);
    const total = await Order.countDocuments(q);
    res.json({ success: true, data: orders, meta: { pagination: { page: +page, limit: +limit, total, totalPages: Math.ceil(total / +limit) } } });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
    res.json({ success: true, data: order });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { tableNumber, items, discount = 0, notes, staffId } = req.body;
    const subtotal = items.reduce((s: number, i: any) => s + i.subtotal, 0);
    const tax = +(subtotal * 0.1).toFixed(2);
    const total = +(subtotal + tax - discount).toFixed(2);
    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    const order = await new Order({ orderNumber, tableNumber, items, subtotal, tax, discount, total, staffId, notes }).save();
    res.status(201).json({ success: true, data: order });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });
    res.json({ success: true, data: order });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Order deleted' } });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};
