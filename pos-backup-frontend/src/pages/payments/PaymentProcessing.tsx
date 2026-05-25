import { useState } from 'react';
import { CreditCard, Banknote, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { markOrderPaid } from '../../store/slices/orderSlice';
import { formatCurrency } from '../../utils/formatters';
import type { PaymentMethod } from '../../types';

export default function PaymentProcessing() {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector(s => s.order);

  const unpaid = orders.filter(o => o.paymentStatus !== 'paid' && o.status !== 'cancelled');
  const [selected, setSelected] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const order = unpaid.find(o => o.id === selected);
  const change = method === 'cash' && cashReceived ? parseFloat(cashReceived) - (order?.total || 0) : 0;

  const handlePay = () => {
    if (!order) return;
    if (method === 'cash' && change < 0) return;
    dispatch(markOrderPaid({ orderId: order.id, method }));
    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); setSelected(null); setCashReceived(''); }, 2000);
  };

  const METHODS: { key: PaymentMethod; label: string; icon: React.ElementType }[] = [
    { key: 'cash', label: 'Cash', icon: Banknote },
    { key: 'card', label: 'Card', icon: CreditCard },
    { key: 'mobile', label: 'Mobile', icon: Smartphone },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unpaid Orders List */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-surface-900 mb-4">Unpaid Orders</h3>
          {unpaid.length === 0 ? (
            <p className="text-sm text-surface-400 py-8 text-center">All orders are paid 🎉</p>
          ) : (
            <div className="space-y-3">
              {unpaid.map(o => (
                <button key={o.id} onClick={() => { setSelected(o.id); setCashReceived(''); }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selected === o.id ? 'border-brand-400 bg-brand-50' : 'border-surface-200 hover:border-surface-300 bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-surface-800">{o.orderNumber}</p>
                      <p className="text-xs text-surface-500">Table {o.tableNumber} · {o.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-surface-900">{formatCurrency(o.total)}</p>
                      <span className={`badge ${o.status === 'ready' ? 'badge-ready' : o.status === 'served' ? 'badge-served' : 'badge-pending'}`}>{o.status}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Payment Panel */}
        <div className="glass-card p-6">
          {!order ? (
            <div className="flex flex-col items-center justify-center h-full text-surface-400 py-12">
              <CreditCard className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">Select an order to process payment</p>
            </div>
          ) : showSuccess ? (
            <div className="flex flex-col items-center justify-center h-full animate-fade-in py-12">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold text-surface-900">Payment Successful!</h3>
              <p className="text-surface-500 mt-1">{order.orderNumber} has been paid</p>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-bold text-surface-900 mb-4">Process Payment</h3>

              {/* Order Summary */}
              <div className="bg-surface-50 rounded-xl p-4 mb-5 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-surface-600">Order</span><span className="font-semibold">{order.orderNumber}</span></div>
                <div className="flex justify-between text-sm"><span className="text-surface-600">Table</span><span>{order.tableNumber}</span></div>
                <div className="flex justify-between text-sm"><span className="text-surface-600">Items</span><span>{order.items.length}</span></div>
                <div className="border-t border-surface-200 pt-2 mt-2">
                  <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                  <div className="flex justify-between text-sm"><span>Tax</span><span>{formatCurrency(order.tax)}</span></div>
                  {order.discount > 0 && <div className="flex justify-between text-sm text-emerald-600"><span>Discount</span><span>-{formatCurrency(order.discount)}</span></div>}
                  <div className="flex justify-between text-lg font-bold text-surface-900 mt-2"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-surface-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {METHODS.map(({ key, label, icon: Icon }) => (
                    <button key={key} onClick={() => setMethod(key)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                        ${method === key ? 'border-brand-400 bg-brand-50 text-brand-600' : 'border-surface-200 text-surface-500 hover:border-surface-300'}`}>
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cash Amount */}
              {method === 'cash' && (
                <div className="mb-5">
                  <label className="block text-sm font-medium text-surface-700 mb-1">Amount Received</label>
                  <input type="number" step="0.01" value={cashReceived} onChange={e => setCashReceived(e.target.value)}
                    className="input-field text-lg font-bold" placeholder="0.00" />
                  {cashReceived && (
                    <p className={`text-sm mt-1 font-semibold ${change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      Change: {formatCurrency(Math.max(0, change))}
                      {change < 0 && ' — Insufficient'}
                    </p>
                  )}
                </div>
              )}

              <button onClick={handlePay} id="process-payment-btn"
                disabled={method === 'cash' && change < 0}
                className="btn-success w-full disabled:opacity-50 disabled:cursor-not-allowed">
                {method === 'cash' ? `Pay ${formatCurrency(order.total)} Cash` : method === 'card' ? 'Process Card Payment' : 'Confirm Mobile Payment'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
