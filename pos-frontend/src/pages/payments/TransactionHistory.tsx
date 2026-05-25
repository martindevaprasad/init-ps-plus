import { useAppSelector } from '../../hooks/useAppDispatch';
import { formatCurrency, formatDateTime, getStatusColor } from '../../utils/formatters';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function TransactionHistory() {
  const { orders } = useAppSelector(s => s.order);
  const paid = orders.filter(o => o.paymentStatus === 'paid');

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>{paid.length} completed transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50">
                  <th className="table-header">Order</th>
                  <th className="table-header">Table</th>
                  <th className="table-header">Items</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Method</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Date</th>
                </tr>
              </thead>
              <tbody>
                {paid.map(o => (
                  <tr key={o.id} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/50 transition-colors">
                    <td className="table-cell font-semibold">{o.orderNumber}</td>
                    <td className="table-cell text-[hsl(var(--muted-foreground))]">{o.tableNumber || '—'}</td>
                    <td className="table-cell text-[hsl(var(--muted-foreground))]">{o.items.length}</td>
                    <td className="table-cell font-bold">{formatCurrency(o.total)}</td>
                    <td className="table-cell capitalize text-[hsl(var(--muted-foreground))]">{o.paymentMethod || '—'}</td>
                    <td className="table-cell"><span className={`badge ${getStatusColor(o.paymentStatus)}`}>{o.paymentStatus}</span></td>
                    <td className="table-cell text-[hsl(var(--muted-foreground))] text-xs">{formatDateTime(o.updatedAt)}</td>
                  </tr>
                ))}
                {paid.length === 0 && (
                  <tr><td colSpan={7} className="table-cell text-center text-[hsl(var(--muted-foreground))] py-8">No transactions yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
