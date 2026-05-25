import { useState } from 'react';
import { IconCreditCard, IconCash, IconDeviceMobile, IconCircleCheck } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { markOrderPaid } from '../../store/slices/orderSlice';
import { formatCurrency } from '../../utils/formatters';
import type { PaymentMethod } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    { key: 'cash', label: 'Cash', icon: IconCash },
    { key: 'card', label: 'Card', icon: IconCreditCard },
    { key: 'mobile', label: 'Mobile', icon: IconDeviceMobile },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unpaid Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Unpaid Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {unpaid.length === 0 ? (
              <p className="text-sm text-[hsl(var(--muted-foreground))] py-8 text-center">All orders are paid 🎉</p>
            ) : (
              <div className="space-y-3">
                {unpaid.map(o => (
                  <button key={o.id} onClick={() => { setSelected(o.id); setCashReceived(''); }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selected === o.id ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5' : 'border-[hsl(var(--border))] hover:border-[hsl(var(--border))]/80 bg-[hsl(var(--card))]'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{o.orderNumber}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">Table {o.tableNumber} · {o.items.length} items</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(o.total)}</p>
                        <span className={`badge ${o.status === 'ready' ? 'badge-ready' : o.status === 'served' ? 'badge-served' : 'badge-pending'}`}>{o.status}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Panel */}
        <Card>
          <CardContent className="p-6">
            {!order ? (
              <div className="flex flex-col items-center justify-center h-full text-[hsl(var(--muted-foreground))] py-12">
                <IconCreditCard className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">Select an order to process payment</p>
              </div>
            ) : showSuccess ? (
              <div className="flex flex-col items-center justify-center h-full animate-fade-in py-12">
                <IconCircleCheck className="w-16 h-16 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold">Payment Successful!</h3>
                <p className="text-[hsl(var(--muted-foreground))] mt-1">{order.orderNumber} has been paid</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-4">Process Payment</h3>

                {/* Order Summary */}
                <div className="bg-[hsl(var(--muted))] rounded-xl p-4 mb-5 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-[hsl(var(--muted-foreground))]">Order</span><span className="font-semibold">{order.orderNumber}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[hsl(var(--muted-foreground))]">Table</span><span>{order.tableNumber}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-[hsl(var(--muted-foreground))]">Items</span><span>{order.items.length}</span></div>
                  <div className="border-t border-[hsl(var(--border))] pt-2 mt-2">
                    <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
                    <div className="flex justify-between text-sm"><span>Tax</span><span>{formatCurrency(order.tax)}</span></div>
                    {order.discount > 0 && <div className="flex justify-between text-sm text-emerald-600"><span>Discount</span><span>-{formatCurrency(order.discount)}</span></div>}
                    <div className="flex justify-between text-lg font-bold mt-2"><span>Total</span><span>{formatCurrency(order.total)}</span></div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-5">
                  <Label className="mb-2 block">Payment Method</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {METHODS.map(({ key, label, icon: Icon }) => (
                      <button key={key} onClick={() => setMethod(key)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                          ${method === key ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5 text-[hsl(var(--primary))]' : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--border))]/80'}`}>
                        <Icon className="w-6 h-6" stroke={1.5} />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cash Amount */}
                {method === 'cash' && (
                  <div className="mb-5">
                    <Label className="mb-1 block">Amount Received</Label>
                    <Input type="number" step="0.01" value={cashReceived} onChange={e => setCashReceived(e.target.value)}
                      className="text-lg font-bold" placeholder="0.00" />
                    {cashReceived && (
                      <p className={`text-sm mt-1 font-semibold ${change >= 0 ? 'text-emerald-600' : 'text-[hsl(var(--destructive))]'}`}>
                        Change: {formatCurrency(Math.max(0, change))}
                        {change < 0 && ' — Insufficient'}
                      </p>
                    )}
                  </div>
                )}

                <Button onClick={handlePay} id="process-payment-btn" variant="success" className="w-full"
                  disabled={method === 'cash' && change < 0}>
                  {method === 'cash' ? `Pay ${formatCurrency(order.total)} Cash` : method === 'card' ? 'Process Card Payment' : 'Confirm Mobile Payment'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
