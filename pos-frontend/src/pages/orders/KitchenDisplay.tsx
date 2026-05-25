import { IconClock, IconToolsKitchen2, IconCircleCheck, IconArrowRight } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { updateOrderStatus } from '../../store/slices/orderSlice';
import { formatCurrency, formatTime } from '../../utils/formatters';
import type { OrderStatus } from '../../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const STATUS_FLOW: Record<string, OrderStatus> = {
  pending: 'cooking',
  cooking: 'ready',
  ready: 'served',
  served: 'completed',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'border-amber-400 bg-amber-50 dark:bg-amber-900/10', icon: IconClock },
  cooking: { label: 'Cooking', color: 'border-blue-400 bg-blue-50 dark:bg-blue-900/10', icon: IconToolsKitchen2 },
  ready: { label: 'Ready', color: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10', icon: IconCircleCheck },
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
              <div className="p-4 flex items-center justify-between border-b border-white/50 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" stroke={1.5} />
                  <h3 className="font-bold">{config.label}</h3>
                </div>
                <span className="badge bg-white/70 dark:bg-white/10">{filtered.length}</span>
              </div>

              {/* Order Cards */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filtered.length === 0 ? (
                  <p className="text-center text-sm text-[hsl(var(--muted-foreground))] py-8">No orders</p>
                ) : (
                  filtered.map(order => (
                    <Card key={order.id} className="animate-slide-up">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-bold">{order.orderNumber}</p>
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">Table {order.tableNumber} · {formatTime(order.createdAt)}</p>
                          </div>
                          <span className="text-sm font-bold">{formatCurrency(order.total)}</span>
                        </div>

                        <div className="space-y-1.5 mb-3">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span>
                                <span className="font-semibold">{item.quantity}×</span> {item.name}
                                {item.modifiers.length > 0 && (
                                  <span className="text-xs text-[hsl(var(--muted-foreground))] ml-1">({item.modifiers.join(', ')})</span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>

                        {order.notes && (
                          <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 rounded-lg px-2 py-1 mb-3">📝 {order.notes}</p>
                        )}

                        <Button onClick={() => advance(order.id, status)} className="w-full gap-2" size="sm">
                          Move to {STATUS_FLOW[status]}
                          <IconArrowRight className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
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
