import { useState } from 'react';
import { IconSearch, IconPlus, IconMinus, IconTrash, IconSend, IconX } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import {
  startNewOrder, addItemToOrder, removeItemFromOrder,
  updateItemQuantity, submitOrder, clearCurrentOrder, setDiscount,
} from '../../store/slices/orderSlice';
import { formatCurrency } from '../../utils/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const TABLES = Array.from({ length: 20 }, (_, i) => i + 1);

export default function OrderManagement() {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector(s => s.inventory);
  const { currentOrder } = useAppSelector(s => s.order);
  const { user } = useAppSelector(s => s.auth);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showTablePicker, setShowTablePicker] = useState(false);

  const categories = ['All', ...new Set(products.filter(p => p.isActive).map(p => p.category))];
  const filtered = products.filter(p => {
    if (!p.isActive) return false;
    if (category !== 'All' && p.category !== category) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSelectTable = (table: number) => {
    setSelectedTable(table);
    dispatch(startNewOrder(table));
    setShowTablePicker(false);
  };

  const handleAddItem = (product: { id: string; name: string; price: number }) => {
    if (!currentOrder && !selectedTable) {
      setShowTablePicker(true);
      return;
    }
    if (!currentOrder && selectedTable) {
      dispatch(startNewOrder(selectedTable));
    }
    dispatch(addItemToOrder({ product }));
  };

  const handleSubmit = () => {
    if (!currentOrder || currentOrder.items.length === 0) return;
    dispatch(submitOrder(user?.id || ''));
    setSelectedTable(null);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-7rem)] animate-fade-in">
      {/* Product Catalog */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Search & Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch className="w-4 h-4 text-[hsl(var(--muted-foreground))] absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..." className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <Button key={c} onClick={() => setCategory(c)}
                variant={category === c ? 'default' : 'outline'}
                size="sm"
              >{c}</Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 content-start pb-2">
          {filtered.map(product => (
            <button key={product.id} onClick={() => handleAddItem(product)}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 text-left hover:shadow-md hover:border-[hsl(var(--primary))]/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 px-2 py-0.5 rounded-full">{product.category}</span>
                {product.stockQuantity <= product.minStockLevel && (
                  <span className="text-[10px] font-bold text-[hsl(var(--destructive))]">LOW</span>
                )}
              </div>
              <h4 className="font-semibold text-sm mb-1 group-hover:text-[hsl(var(--primary))] transition-colors">{product.name}</h4>
              <p className="text-lg font-bold">{formatCurrency(product.price)}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{product.stockQuantity} in stock</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full flex items-center justify-center py-12 text-[hsl(var(--muted-foreground))]">
              No products found
            </div>
          )}
        </div>
      </div>

      {/* Order Cart */}
      <Card className="w-96 flex flex-col shrink-0">
        <CardHeader className="pb-3 border-b border-[hsl(var(--border))]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {currentOrder ? `Order — Table ${currentOrder.tableNumber}` : 'New Order'}
            </CardTitle>
            {!currentOrder && (
              <Button onClick={() => setShowTablePicker(true)} size="sm">
                Select Table
              </Button>
            )}
            {currentOrder && (
              <Button variant="ghost" size="icon" onClick={() => { dispatch(clearCurrentOrder()); setSelectedTable(null); }}
                className="hover:text-[hsl(var(--destructive))]">
                <IconX className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {(!currentOrder || currentOrder.items.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-full text-[hsl(var(--muted-foreground))]">
              <IconShoppingCart className="w-12 h-12 mb-2 opacity-30" />
              <p className="text-sm">Click a product to add to order</p>
            </div>
          ) : (
            currentOrder.items.map(item => (
              <div key={item.productId} className="flex items-center gap-3 bg-[hsl(var(--muted))] rounded-xl p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{item.name}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{formatCurrency(item.price)} each</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="w-7 h-7"
                    onClick={() => dispatch(updateItemQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}>
                    <IconMinus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="w-7 h-7"
                    onClick={() => dispatch(updateItemQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}>
                    <IconPlus className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-sm font-bold w-16 text-right">{formatCurrency(item.subtotal)}</p>
                <Button variant="ghost" size="icon" className="w-7 h-7 hover:text-[hsl(var(--destructive))]"
                  onClick={() => dispatch(removeItemFromOrder(item.productId))}>
                  <IconTrash className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Totals & Submit */}
        {currentOrder && currentOrder.items.length > 0 && (
          <div className="p-4 border-t border-[hsl(var(--border))] space-y-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
                <span>Subtotal</span><span>{formatCurrency(currentOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[hsl(var(--muted-foreground))]">
                <span>Tax (10%)</span><span>{formatCurrency(currentOrder.tax)}</span>
              </div>
              {currentOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span><span>-{formatCurrency(currentOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-[hsl(var(--border))]">
                <span>Total</span><span>{formatCurrency(currentOrder.total)}</span>
              </div>
            </div>
            <Button onClick={handleSubmit} id="submit-order-btn" variant="success" className="w-full gap-2">
              <IconSend className="w-4 h-4" /> Submit Order
            </Button>
          </div>
        )}
      </Card>

      {/* Table Picker Dialog */}
      <Dialog open={showTablePicker} onOpenChange={setShowTablePicker}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Select Table</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-5 gap-3">
            {TABLES.map(t => (
              <button key={t} onClick={() => handleSelectTable(t)}
                className="h-14 rounded-xl border-2 border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10
                  font-bold hover:text-[hsl(var(--primary))] transition-all text-lg">
                {t}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function IconShoppingCart({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  );
}
