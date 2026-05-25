import { Request, Response } from 'express';
import Order from '../../order/models/Order';
import Product from '../../inventory/models/Product';

export const getSalesReport = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ status: 'completed' }).sort({ createdAt: -1 });
    const totalSales = orders.reduce((s, o) => s + o.total, 0);
    const avgVal = orders.length > 0 ? totalSales / orders.length : 0;

    const items = orders.flatMap(o => o.items).reduce((a: any[], item) => {
      const ex = a.find(x => x.name === item.name);
      if (ex) { ex.quantity += item.quantity; ex.revenue += item.subtotal; }
      else a.push({ productId: item.productId, name: item.name, quantity: item.quantity, revenue: item.subtotal });
      return a;
    }, []).sort((a: any, b: any) => b.quantity - a.quantity);

    res.json({ success: true, data: { totalSales, totalOrders: orders.length, averageOrderValue: avgVal, bestSellingItems: items.slice(0, 10) } });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};

export const getInventoryReport = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find({ isActive: true });
    const lowStock = products.filter(p => p.stockQuantity <= p.minStockLevel && p.stockQuantity > 0);
    const outOfStock = products.filter(p => p.stockQuantity === 0);
    const totalValue = products.reduce((s, p) => s + p.stockQuantity * p.cost, 0);
    res.json({ success: true, data: { totalProducts: products.length, lowStockItems: lowStock, outOfStockItems: outOfStock, totalValue, totalLowStock: lowStock.length, totalOutOfStock: outOfStock.length } });
  } catch (err: any) { res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } }); }
};
