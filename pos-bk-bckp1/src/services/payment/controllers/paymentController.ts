import { Request, Response } from 'express';
import Payment from '../models/Payment';
import Order from '../../order/models/Order';
import { AuthRequest } from '../../../middleware/auth';

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, status, paymentMethod } = req.query;
    const q: any = {};
    if (status) q.status = status;
    if (paymentMethod) q.paymentMethod = paymentMethod;
    const payments = await Payment.find(q).sort({ createdAt: -1 }).limit(+limit).skip((+page - 1) * +limit);
    const total = await Payment.countDocuments(q);
    res.json({ success: true, data: payments, meta: { pagination: { page: +page, limit: +limit, total, totalPages: Math.ceil(total / +limit) } } });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};

export const processPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentMethod, amount, amountPaid } = req.body;
    const orderId = req.params.orderId;
    const staffId = req.user?.id || '';
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Order not found' } });

    let change = 0;
    if (paymentMethod === 'cash') {
      if (amountPaid < order.total) return res.status(400).json({ success: false, error: { code: 'INSUFFICIENT', message: 'Insufficient payment' } });
      change = +(amountPaid - order.total).toFixed(2);
    }

    const payment = await new Payment({ orderId, amount: order.total, paymentMethod, status: 'completed', staffId, change: paymentMethod === 'cash' ? change : undefined }).save();
    order.paymentStatus = 'paid'; order.paymentMethod = paymentMethod; order.status = 'completed'; await order.save();

    res.json({ success: true, data: { payment, order, change } });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};
