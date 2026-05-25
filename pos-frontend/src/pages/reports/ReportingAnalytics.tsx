import { useAppSelector } from '../../hooks/useAppDispatch';
import { formatCurrency } from '../../utils/formatters';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChartWidget } from '@/components/charts/PieChartWidget';
import { BarChartWidget } from '@/components/charts/BarChartWidget';

export default function ReportingAnalytics() {
  const { orders } = useAppSelector(s => s.order);
  const { products } = useAppSelector(s => s.inventory);

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
          <Card key={s.label}>
            <CardContent className="p-6">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PieChartWidget
              title="Revenue by Payment Method"
              data={methodData}
              formatValue={(v: number) => formatCurrency(v)}
            />
            <BarChartWidget
              title="Top Selling Items"
              data={itemSales.slice(0, 6)}
              dataKey="qty"
              nameKey="name"
              layout="vertical"
            />
          </div>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Product Sales Ranking</h3>
              <div className="space-y-2">
                {itemSales.slice(0, 10).map((item, i) => (
                  <div key={item.name} className="flex items-center gap-3 bg-[hsl(var(--muted))] rounded-xl p-3">
                    <span className="w-7 h-7 rounded-lg bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] flex items-center justify-center text-xs font-bold">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.name}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{item.qty} sold</p>
                    </div>
                    <span className="text-sm font-bold">{formatCurrency(item.rev)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Low Stock Items ({lowStock.length})</h3>
              <table className="w-full">
                <thead><tr className="border-b border-[hsl(var(--border))]">
                  <th className="table-header">Product</th><th className="table-header">Stock</th>
                  <th className="table-header">Min</th><th className="table-header">Status</th>
                </tr></thead>
                <tbody>
                  {lowStock.map(p => (
                    <tr key={p.id} className="border-b border-[hsl(var(--border))]">
                      <td className="table-cell font-semibold">{p.name}</td>
                      <td className="table-cell font-bold text-[hsl(var(--destructive))]">{p.stockQuantity}</td>
                      <td className="table-cell text-[hsl(var(--muted-foreground))]">{p.minStockLevel}</td>
                      <td className="table-cell">{p.stockQuantity === 0 ? <span className="badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Out</span> : <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Low</span>}</td>
                    </tr>
                  ))}
                  {lowStock.length === 0 && <tr><td colSpan={4} className="table-cell text-center text-[hsl(var(--muted-foreground))] py-8">All healthy ✅</td></tr>}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
