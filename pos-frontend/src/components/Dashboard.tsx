import { IconCurrencyDollar, IconShoppingCart, IconPackage, IconTrendingUp, IconAlertTriangle, IconClock } from '@tabler/icons-react';
import { useAppSelector } from '../hooks/useAppDispatch';
import { formatCurrency } from '../utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    { label: "Today's Revenue", value: formatCurrency(totalSales), icon: IconCurrencyDollar, bg: 'bg-emerald-50 dark:bg-emerald-900/20', iconColor: 'text-emerald-500' },
    { label: 'Total Orders', value: totalOrders, icon: IconShoppingCart, bg: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-500' },
    { label: 'Active Orders', value: activeOrders, icon: IconClock, bg: 'bg-amber-50 dark:bg-amber-900/20', iconColor: 'text-amber-500' },
    { label: 'Avg Order Value', value: formatCurrency(avgOrderValue), icon: IconTrendingUp, bg: 'bg-purple-50 dark:bg-purple-900/20', iconColor: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-tour="dashboard-stats">
        {stats.map(({ label, value, icon: Icon, bg, iconColor }) => (
          <Card key={label} className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} stroke={1.5} />
                </div>
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Active Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length === 0 ? (
                <p className="text-sm text-[hsl(var(--muted-foreground))] py-4 text-center">No active orders</p>
              ) : (
                orders.filter(o => !['completed', 'cancelled'].includes(o.status)).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-[hsl(var(--muted))] rounded-xl">
                    <div>
                      <p className="text-sm font-semibold">{order.orderNumber}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">Table {order.tableNumber} · {order.items.length} items</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${order.status === 'pending' ? 'badge-pending' : order.status === 'cooking' ? 'badge-cooking' : order.status === 'ready' ? 'badge-ready' : 'badge-served'}`}>
                        {order.status}
                      </span>
                      <span className="text-sm font-bold">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconAlertTriangle className="w-5 h-5 text-amber-500" stroke={1.5} />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {outOfStock.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-[hsl(var(--destructive))]">Out of Stock</p>
                  </div>
                  <span className="badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">0 units</span>
                </div>
              ))}
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">Low Stock (min: {p.minStockLevel})</p>
                  </div>
                  <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{p.stockQuantity} units</span>
                </div>
              ))}
              {lowStock.length === 0 && outOfStock.length === 0 && (
                <p className="text-sm text-[hsl(var(--muted-foreground))] py-4 text-center">All stock levels healthy</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Completed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Completed Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[hsl(var(--border))]">
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
                  <tr key={order.id} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors">
                    <td className="table-cell font-semibold">{order.orderNumber}</td>
                    <td className="table-cell text-[hsl(var(--muted-foreground))]">{order.tableNumber || '—'}</td>
                    <td className="table-cell text-[hsl(var(--muted-foreground))]">{order.items.length} items</td>
                    <td className="table-cell font-semibold">{formatCurrency(order.total)}</td>
                    <td className="table-cell"><span className="capitalize text-[hsl(var(--muted-foreground))]">{order.paymentMethod || '—'}</span></td>
                    <td className="table-cell"><span className="badge badge-completed">Completed</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
