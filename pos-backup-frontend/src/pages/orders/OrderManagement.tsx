import { useState } from 'react';
import { Search, Plus, Minus, Trash2, Send, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import {
  startNewOrder, addItemToOrder, removeItemFromOrder,
  updateItemQuantity, submitOrder, clearCurrentOrder, setDiscount,
} from '../../store/slices/orderSlice';
import { formatCurrency } from '../../utils/formatters';

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
          <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-surface-200 flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-surface-400" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..." className="bg-transparent text-sm focus:outline-none w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${category === c ? 'bg-brand-500 text-white shadow-sm' : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'}`}
              >{c}</button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 content-start pb-2">
          {filtered.map(product => (
            <button key={product.id} onClick={() => handleAddItem(product)}
              className="glass-card p-4 text-left hover:shadow-md hover:border-brand-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">{product.category}</span>
                {product.stockQuantity <= product.minStockLevel && (
                  <span className="text-[10px] font-bold text-red-500">LOW</span>
                )}
              </div>
              <h4 className="font-semibold text-surface-800 text-sm mb-1 group-hover:text-brand-600 transition-colors">{product.name}</h4>
              <p className="text-lg font-bold text-surface-900">{formatCurrency(product.price)}</p>
              <p className="text-xs text-surface-400 mt-1">{product.stockQuantity} in stock</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full flex items-center justify-center py-12 text-surface-400">
              No products found
            </div>
          )}
        </div>
      </div>

      {/* Order Cart */}
      <div className="w-96 glass-card flex flex-col shrink-0">
        <div className="p-4 border-b border-surface-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-surface-900">
              {currentOrder ? `Order — Table ${currentOrder.tableNumber}` : 'New Order'}
            </h3>
            {!currentOrder && (
              <button onClick={() => setShowTablePicker(true)} className="btn-primary text-sm !px-3 !py-1.5">
                Select Table
              </button>
            )}
            {currentOrder && (
              <button onClick={() => { dispatch(clearCurrentOrder()); setSelectedTable(null); }}
                className="p-1.5 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {(!currentOrder || currentOrder.items.length === 0) ? (
            <div className="flex flex-col items-center justify-center h-full text-surface-400">
              <ShoppingCartIcon className="w-12 h-12 mb-2 opacity-30" />
              <p className="text-sm">Click a product to add to order</p>
            </div>
          ) : (
            currentOrder.items.map(item => (
              <div key={item.productId} className="flex items-center gap-3 bg-surface-50 rounded-xl p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-800 truncate">{item.name}</p>
                  <p className="text-xs text-surface-500">{formatCurrency(item.price)} each</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => dispatch(updateItemQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
                    className="w-7 h-7 rounded-lg bg-white border border-surface-200 flex items-center justify-center hover:bg-surface-100">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                  <button onClick={() => dispatch(updateItemQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                    className="w-7 h-7 rounded-lg bg-white border border-surface-200 flex items-center justify-center hover:bg-surface-100">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-sm font-bold text-surface-800 w-16 text-right">{formatCurrency(item.subtotal)}</p>
                <button onClick={() => dispatch(removeItemFromOrder(item.productId))}
                  className="p-1 rounded-lg hover:bg-red-50 text-surface-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Totals & Submit */}
        {currentOrder && currentOrder.items.length > 0 && (
          <div className="p-4 border-t border-surface-200 space-y-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-surface-600">
                <span>Subtotal</span><span>{formatCurrency(currentOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-surface-600">
                <span>Tax (10%)</span><span>{formatCurrency(currentOrder.tax)}</span>
              </div>
              {currentOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span><span>-{formatCurrency(currentOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-surface-900 pt-2 border-t border-surface-200">
                <span>Total</span><span>{formatCurrency(currentOrder.total)}</span>
              </div>
            </div>
            <button onClick={handleSubmit} id="submit-order-btn"
              className="btn-success w-full flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Submit Order
            </button>
          </div>
        )}
      </div>

      {/* Table Picker Modal */}
      {showTablePicker && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="glass-card p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-surface-900">Select Table</h3>
              <button onClick={() => setShowTablePicker(false)} className="p-1 rounded-lg hover:bg-surface-100">
                <X className="w-5 h-5 text-surface-400" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {TABLES.map(t => (
                <button key={t} onClick={() => handleSelectTable(t)}
                  className="h-14 rounded-xl border-2 border-surface-200 hover:border-brand-400 hover:bg-brand-50
                    font-bold text-surface-700 hover:text-brand-600 transition-all text-lg">
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShoppingCartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  );
}
