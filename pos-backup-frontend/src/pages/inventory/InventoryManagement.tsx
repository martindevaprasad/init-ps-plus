import { useState } from 'react';
import { Search, Plus, Edit3, Trash2, X, Package, AlertTriangle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addProduct, updateProduct, deleteProduct } from '../../store/slices/inventorySlice';
import { formatCurrency } from '../../utils/formatters';
import type { Product } from '../../types';

export default function InventoryManagement() {
  const dispatch = useAppDispatch();
  const { products, inventoryLogs } = useAppSelector(s => s.inventory);

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', category: 'Bakery', price: '', cost: '', sku: '', barcode: '', stockQuantity: '', minStockLevel: '10', description: '', isBakeryItem: false });

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filtered = products.filter(p => {
    if (!p.isActive && !editing) return false;
    if (catFilter !== 'All' && p.category !== catFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  const getStockBadge = (p: Product) => {
    if (p.stockQuantity === 0) return <span className="badge bg-red-100 text-red-700">Out of Stock</span>;
    if (p.stockQuantity <= p.minStockLevel) return <span className="badge bg-amber-100 text-amber-700">Low Stock</span>;
    return <span className="badge bg-emerald-100 text-emerald-700">In Stock</span>;
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', category: 'Bakery', price: '', cost: '', sku: '', barcode: '', stockQuantity: '', minStockLevel: '10', description: '', isBakeryItem: false });
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, category: p.category, price: String(p.price), cost: String(p.cost), sku: p.sku, barcode: p.barcode, stockQuantity: String(p.stockQuantity), minStockLevel: String(p.minStockLevel), description: p.description, isBakeryItem: p.isBakeryItem });
    setShowForm(true);
  };

  const handleSave = () => {
    const product: Product = {
      id: editing?.id || 'p-' + Date.now(),
      name: form.name, category: form.category,
      price: parseFloat(form.price) || 0, cost: parseFloat(form.cost) || 0,
      sku: form.sku || 'SKU-' + Date.now(), barcode: form.barcode || '',
      stockQuantity: parseInt(form.stockQuantity) || 0, minStockLevel: parseInt(form.minStockLevel) || 10,
      description: form.description, isActive: true, isBakeryItem: form.isBakeryItem,
      createdAt: editing?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    if (editing) dispatch(updateProduct(product));
    else dispatch(addProduct(product));
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-surface-200 min-w-[260px]">
          <Search className="w-4 h-4 text-surface-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or SKU..." className="bg-transparent text-sm focus:outline-none w-full" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${catFilter === c ? 'bg-brand-500 text-white' : 'bg-white text-surface-600 border border-surface-200 hover:bg-surface-50'}`}
            >{c}</button>
          ))}
        </div>
        <button onClick={openAdd} id="add-product-btn" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50/50">
                <th className="table-header">Product</th>
                <th className="table-header">Category</th>
                <th className="table-header">Price</th>
                <th className="table-header">Cost</th>
                <th className="table-header">Stock</th>
                <th className="table-header">Status</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-surface-100 hover:bg-surface-50/50 transition-colors">
                  <td className="table-cell">
                    <div>
                      <p className="font-semibold text-surface-800">{p.name}</p>
                      <p className="text-xs text-surface-400">SKU: {p.sku}</p>
                    </div>
                  </td>
                  <td className="table-cell text-surface-600">{p.category}</td>
                  <td className="table-cell font-semibold text-surface-800">{formatCurrency(p.price)}</td>
                  <td className="table-cell text-surface-500">{formatCurrency(p.cost)}</td>
                  <td className="table-cell font-semibold">{p.stockQuantity}</td>
                  <td className="table-cell">{getStockBadge(p)}</td>
                  <td className="table-cell text-right">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-blue-600 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => dispatch(deleteProduct(p.id))} className="p-1.5 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-500 transition-colors ml-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Logs */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-surface-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-surface-400" /> Recent Inventory Changes
        </h3>
        <div className="space-y-2">
          {inventoryLogs.slice(0, 5).map(log => {
            const product = products.find(p => p.id === log.productId);
            return (
              <div key={log.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl text-sm">
                <div>
                  <span className="font-semibold text-surface-800">{product?.name || log.productId}</span>
                  <span className="text-surface-500 ml-2">— {log.reason}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${log.changeType === 'purchase' ? 'bg-emerald-100 text-emerald-700' : log.changeType === 'waste' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {log.changeType}
                  </span>
                  <span className={`font-bold ${log.changeType === 'waste' || log.changeType === 'sale' ? 'text-red-600' : 'text-emerald-600'}`}>
                    {log.changeType === 'waste' || log.changeType === 'sale' ? '-' : '+'}{log.quantity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="glass-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-surface-900">{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-surface-100"><X className="w-5 h-5 text-surface-400" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Product name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                    <option>Bakery</option><option>Beverages</option><option>Food</option><option>Desserts</option><option>Snacks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">SKU</label>
                  <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} className="input-field" placeholder="SKU-001" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Price ($)</label>
                  <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Cost ($)</label>
                  <input type="number" step="0.01" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Stock Quantity</label>
                  <input type="number" value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Min Stock Level</label>
                  <input type="number" value={form.minStockLevel} onChange={e => setForm({ ...form, minStockLevel: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isBakeryItem} onChange={e => setForm({ ...form, isBakeryItem: e.target.checked })} className="w-4 h-4 rounded text-brand-500" />
                <span className="text-sm text-surface-700">Bakery item (recipe-based)</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleSave} className="btn-primary text-sm">{editing ? 'Save Changes' : 'Add Product'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
