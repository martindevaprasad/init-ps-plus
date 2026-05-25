import { DollarSign, ShoppingCart, Package, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppDispatch';
import { formatCurrency } from '../utils/formatters';

export default function Dashboard() {
  const { orders } = useAppSelector(s => s.order);
  const { products } = useAppSelector(s => s.inventory);

  const todayOrders = orders;
  const totalSales = todayOrders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0);
  const totalOrders = todayOrders.length;
  const activeOrders = todayOrders.filter(o => !['completed', 'cancelled'].includes(o.status)).length;
  const avgOrderValue = totalOrders > 0 ? totalSales / todayOrders.filter(o => o.paymentStatus === 'paid').length || 0 : 0;
  const lowStock = products.filter(p => p.isActive && p.stockQuantity <= p.minStockLevel && p.stockQuantity > 0);
  const outOfStock = products.filter(p => p.isActive && p.stockQuantity === 0);

  const stats = [
    { label: "Today's Revenue", value: formatCurrency(totalSales), icon: DollarSign, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingCart, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Orders', value: activeOrders, icon: Clock, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
    { label: 'Avg Order Value', value: formatCurrency(avgOrderValue), icon: TrendingUp, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between">
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 bg-gradient-to-r ${color} bg-clip-text text-transparent`} style={{ color: color.includes('emerald') ? '#10b981' : color.includes('blue') ? '#3b82f6' : color.includes('amber') ? '#f59e0b' : '#8b5cf6' }} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-surface-900">{value}</p>
              <p className="text-sm text-surface-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Orders */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-surface-900 mb-4">Active Orders</h3>
          <div className="space-y-3">
            {orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length === 0 ? (
              <p className="text-sm text-surface-400 py-4 text-center">No active orders</p>
            ) : (
              orders.filter(o => !['completed', 'cancelled'].includes(o.status)).map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-surface-800">{order.orderNumber}</p>
                    <p className="text-xs text-surface-500">Table {order.tableNumber} · {order.items.length} items</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${order.status === 'pending' ? 'badge-pending' : order.status === 'cooking' ? 'badge-cooking' : order.status === 'ready' ? 'badge-ready' : 'badge-served'}`}>
                      {order.status}
                    </span>
                    <span className="text-sm font-bold text-surface-700">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-surface-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Inventory Alerts
          </h3>
          <div className="space-y-3">
            {outOfStock.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-surface-800">{p.name}</p>
                  <p className="text-xs text-red-600">Out of Stock</p>
                </div>
                <span className="badge bg-red-100 text-red-700">0 units</span>
              </div>
            ))}
            {lowStock.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-surface-800">{p.name}</p>
                  <p className="text-xs text-amber-600">Low Stock (min: {p.minStockLevel})</p>
                </div>
                <span className="badge bg-amber-100 text-amber-700">{p.stockQuantity} units</span>
              </div>
            ))}
            {lowStock.length === 0 && outOfStock.length === 0 && (
              <p className="text-sm text-surface-400 py-4 text-center">All stock levels healthy</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Completed */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-surface-900 mb-4">Recent Completed Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200">
                <th className="table-header">Order</th>
                <th className="table-header">Table</th>
                <th className="table-header">Items</th>
                <th className="table-header">Total</th>
                <th className="table-header">Payment</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.filter(o => o.status === 'completed').slice(0, 5).map(order => (
                <tr key={order.id} className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
                  <td className="table-cell font-semibold text-surface-800">{order.orderNumber}</td>
                  <td className="table-cell text-surface-600">{order.tableNumber || '—'}</td>
                  <td className="table-cell text-surface-600">{order.items.length} items</td>
                  <td className="table-cell font-semibold text-surface-800">{formatCurrency(order.total)}</td>
                  <td className="table-cell"><span className="capitalize text-surface-600">{order.paymentMethod || '—'}</span></td>
                  <td className="table-cell"><span className="badge badge-completed">Completed</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
