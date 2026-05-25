export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

export const formatDate = (date: string | Date): string =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const formatDateTime = (date: string | Date): string =>
  new Date(date).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });

export const formatTime = (date: string | Date): string =>
  new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

export const generateOrderNumber = (): string => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${dateStr}-${rand}`;
};

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    pending: 'badge-pending',
    cooking: 'badge-cooking',
    ready: 'badge-ready',
    served: 'badge-served',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
    paid: 'badge-paid',
    partial: 'badge-pending',
    refunded: 'badge-refunded',
  };
  return map[status] || 'badge-pending';
};
