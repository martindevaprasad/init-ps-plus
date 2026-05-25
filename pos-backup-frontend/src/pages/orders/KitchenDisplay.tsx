import { Clock, ChefHat, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { updateOrderStatus } from '../../store/slices/orderSlice';
import { formatCurrency, formatTime } from '../../utils/formatters';
import type { OrderStatus } from '../../types';

const STATUS_FLOW: Record<string, OrderStatus> = {
  pending: 'cooking',
  cooking: 'ready',
  ready: 'served',
  served: 'completed',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'border-amber-400 bg-amber-50', icon: Clock },
  cooking: { label: 'Cooking', color: 'border-blue-400 bg-blue-50', icon: ChefHat },
  ready: { label: 'Ready', color: 'border-emerald-400 bg-emerald-50', icon: CheckCircle2 },
};

export default function KitchenDisplay() {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector(s => s.order);

  const columns = ['pending', 'cooking', 'ready'] as const;

  const advance = (orderId: string, current: string) => {
    const next = STATUS_FLOW[current];
    if (next) dispatch(updateOrderStatus({ orderId, status: next }));
  };

  return (
    <div className="h-[calc(100vh-7rem)] animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
        {columns.map(status => {
          const config = STATUS_CONFIG[status];
          const Icon = config.icon;
          const filtered = orders.filter(o => o.status === status);

          return (
            <div key={status} className={`rounded-2xl border-2 ${config.color} flex flex-col`}>
              {/* Column Header */}
              <div className="p-4 flex items-center justify-between border-b border-white/50">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <h3 className="font-bold text-surface-800">{config.label}</h3>
                </div>
                <span className="badge bg-white/70 text-surface-700">{filtered.length}</span>
              </div>

              {/* Order Cards */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filtered.length === 0 ? (
                  <p className="text-center text-sm text-surface-400 py-8">No orders</p>
                ) : (
                  filtered.map(order => (
                    <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm animate-slide-up">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-bold text-surface-900">{order.orderNumber}</p>
                          <p className="text-xs text-surface-500">Table {order.tableNumber} · {formatTime(order.createdAt)}</p>
                        </div>
                        <span className="text-sm font-bold text-surface-700">{formatCurrency(order.total)}</span>
                      </div>

                      <div className="space-y-1.5 mb-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-surface-700">
                              <span className="font-semibold">{item.quantity}×</span> {item.name}
                              {item.modifiers.length > 0 && (
                                <span className="text-xs text-surface-400 ml-1">({item.modifiers.join(', ')})</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-2 py-1 mb-3">📝 {order.notes}</p>
                      )}

                      <button onClick={() => advance(order.id, status)}
                        className="w-full btn-primary text-sm flex items-center justify-center gap-2 !py-2">
                        Move to {STATUS_FLOW[status]}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
