import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { formatCurrency } from '../../utils/formatters';

const COLORS = ['#e86d2d', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function ReportingAnalytics() {
  const { orders } = useAppSelector(s => s.order);
  const { products } = useAppSelector(s => s.inventory);
  const [tab, setTab] = useState<'sales' | 'products' | 'inventory'>('sales');

  const paid = orders.filter(o => o.paymentStatus === 'paid');
  const totalSales = paid.reduce((s, o) => s + o.total, 0);
  const avgVal = paid.length > 0 ? totalSales / paid.length : 0;
  const invValue = products.filter(p => p.isActive).reduce((s, p) => s + p.stockQuantity * p.cost, 0);
  const lowStock = products.filter(p => p.isActive && p.stockQuantity <= p.minStockLevel);

  const byMethod = paid.reduce((a, o) => {
    const m = o.paymentMethod || 'unknown';
    a[m] = (a[m] || 0) + o.total;
    return a;
  }, {} as Record<string, number>);
  const methodData = Object.entries(byMethod).map(([name, value]) => ({ name, value: +value.toFixed(2) }));

  const itemSales = paid.flatMap(o => o.items).reduce((a, item) => {
    const ex = a.find(x => x.name === item.name);
    if (ex) { ex.qty += item.quantity; ex.rev += item.subtotal; }
    else a.push({ name: item.name, qty: item.quantity, rev: item.subtotal });
    return a;
  }, [] as { name: string; qty: number; rev: number }[]).sort((a, b) => b.qty - a.qty);

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalSales) },
    { label: 'Orders', value: paid.length },
    { label: 'Avg Order', value: formatCurrency(avgVal) },
    { label: 'Inventory Value', value: formatCurrency(invValue) },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <p className="text-2xl font-bold text-surface-900">{s.value}</p>
            <p className="text-sm text-surface-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(['sales', 'products', 'inventory'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all
              ${tab === t ? 'bg-brand-500 text-white' : 'bg-white text-surface-600 border border-surface-200'}`}>{t}</button>
        ))}
      </div>

      {tab === 'sales' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-surface-900 mb-4">Revenue by Payment Method</h3>
            {methodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={methodData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={50} paddingAngle={4}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {methodData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} /><Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-surface-400 text-center py-12">No data</p>}
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-surface-900 mb-4">Top Selling Items</h3>
            {itemSales.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={itemSales.slice(0, 6)} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={75} />
                  <Tooltip /><Bar dataKey="qty" fill="#e86d2d" radius={[0, 6, 6, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-surface-400 text-center py-12">No data</p>}
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-surface-900 mb-4">Product Sales Ranking</h3>
          <div className="space-y-2">
            {itemSales.slice(0, 10).map((item, i) => (
              <div key={item.name} className="flex items-center gap-3 bg-surface-50 rounded-xl p-3">
                <span className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-800 truncate">{item.name}</p>
                  <p className="text-xs text-surface-500">{item.qty} sold</p>
                </div>
                <span className="text-sm font-bold">{formatCurrency(item.rev)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'inventory' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-surface-900 mb-4">Low Stock Items ({lowStock.length})</h3>
          <table className="w-full">
            <thead><tr className="border-b border-surface-200">
              <th className="table-header">Product</th><th className="table-header">Stock</th>
              <th className="table-header">Min</th><th className="table-header">Status</th>
            </tr></thead>
            <tbody>
              {lowStock.map(p => (
                <tr key={p.id} className="border-b border-surface-100">
                  <td className="table-cell font-semibold">{p.name}</td>
                  <td className="table-cell font-bold text-red-600">{p.stockQuantity}</td>
                  <td className="table-cell text-surface-500">{p.minStockLevel}</td>
                  <td className="table-cell">{p.stockQuantity === 0 ? <span className="badge bg-red-100 text-red-700">Out</span> : <span className="badge bg-amber-100 text-amber-700">Low</span>}</td>
                </tr>
              ))}
              {lowStock.length === 0 && <tr><td colSpan={4} className="table-cell text-center text-surface-400 py-8">All healthy ✅</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
