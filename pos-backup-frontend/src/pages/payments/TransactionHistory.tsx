import { useAppSelector } from '../../hooks/useAppDispatch';
import { formatCurrency, formatDateTime, getStatusColor } from '../../utils/formatters';

export default function TransactionHistory() {
  const { orders } = useAppSelector(s => s.order);
  const paid = orders.filter(o => o.paymentStatus === 'paid');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-surface-200">
          <h3 className="text-lg font-bold text-surface-900">Transaction History</h3>
          <p className="text-sm text-surface-500 mt-1">{paid.length} completed transactions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50/50">
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
                <tr key={o.id} className="border-b border-surface-100 hover:bg-surface-50/50 transition-colors">
                  <td className="table-cell font-semibold text-surface-800">{o.orderNumber}</td>
                  <td className="table-cell text-surface-600">{o.tableNumber || '—'}</td>
                  <td className="table-cell text-surface-600">{o.items.length}</td>
                  <td className="table-cell font-bold text-surface-900">{formatCurrency(o.total)}</td>
                  <td className="table-cell capitalize text-surface-600">{o.paymentMethod || '—'}</td>
                  <td className="table-cell"><span className={`badge ${getStatusColor(o.paymentStatus)}`}>{o.paymentStatus}</span></td>
                  <td className="table-cell text-surface-500 text-xs">{formatDateTime(o.updatedAt)}</td>
                </tr>
              ))}
              {paid.length === 0 && (
                <tr><td colSpan={7} className="table-cell text-center text-surface-400 py-8">No transactions yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
