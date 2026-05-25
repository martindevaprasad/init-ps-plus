import { useState } from 'react';
import { IconSearch, IconPlus, IconEdit, IconTrash, IconX, IconPackage, IconAlertTriangle } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addProduct, updateProduct, deleteProduct } from '../../store/slices/inventorySlice';
import { formatCurrency } from '../../utils/formatters';
import type { Product } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function InventoryManagement() {
  const dispatch = useAppDispatch();
  const { products, inventoryLogs } = useAppSelector(s => s.inventory);
  const { categories: allCategories } = useAppSelector(s => s.categories);

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', category: '', price: '', cost: '', sku: '', barcode: '', stockQuantity: '', minStockLevel: '10', description: '', isBakeryItem: false });

  const activeCategories = allCategories.filter(c => c.isActive);
  const categoriesList = ['All', ...activeCategories.map(c => c.name)];
  const filtered = products.filter(p => {
    if (!p.isActive && !editing) return false;
    
    // Check if category matches by name or ID
    const productCatName = typeof p.category === 'object' ? p.category.name : p.category;
    if (catFilter !== 'All' && productCatName !== catFilter) return false;
    
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  const getStockBadge = (p: Product) => {
    if (p.stockQuantity === 0) return <span className="badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Out of Stock</span>;
    if (p.stockQuantity <= p.minStockLevel) return <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Low Stock</span>;
    return <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">In Stock</span>;
  };

  const getCatName = (c: any) => typeof c === 'object' ? c.name : c;

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', category: activeCategories[0]?.name || '', price: '', cost: '', sku: '', barcode: '', stockQuantity: '', minStockLevel: '10', description: '', isBakeryItem: false });
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, category: getCatName(p.category), price: String(p.price), cost: String(p.cost), sku: p.sku, barcode: p.barcode, stockQuantity: String(p.stockQuantity), minStockLevel: String(p.minStockLevel), description: p.description, isBakeryItem: p.isBakeryItem });
    setShowForm(true);
  };

  const handleSave = () => {
    // Find the category object to map
    const catObj = activeCategories.find(c => c.name === form.category) || { id: form.category, name: form.category } as any;
    
    const product: Product = {
      id: editing?.id || 'p-' + Date.now(),
      name: form.name, category: catObj,
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
        <div className="relative min-w-[260px]">
          <IconSearch className="w-4 h-4 text-[hsl(var(--muted-foreground))] absolute left-3 top-1/2 -translate-y-1/2" />
          <Input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or SKU..." className="pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categoriesList.map(c => (
            <Button key={c} onClick={() => setCatFilter(c)}
              variant={catFilter === c ? 'default' : 'outline'} size="sm"
            >{c}</Button>
          ))}
        </div>
        <Button onClick={openAdd} id="add-product-btn" className="gap-2" size="sm">
          <IconPlus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50">
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
                  <tr key={p.id} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/50 transition-colors">
                    <td className="table-cell">
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">SKU: {p.sku}</p>
                      </div>
                    </td>
                    <td className="table-cell text-[hsl(var(--muted-foreground))]">{getCatName(p.category)}</td>
                    <td className="table-cell font-semibold">{formatCurrency(p.price)}</td>
                    <td className="table-cell text-[hsl(var(--muted-foreground))]">{formatCurrency(p.cost)}</td>
                    <td className="table-cell font-semibold">{p.stockQuantity}</td>
                    <td className="table-cell">{getStockBadge(p)}</td>
                    <td className="table-cell text-right">
                      <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEdit(p)}>
                        <IconEdit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-[hsl(var(--destructive))]" onClick={() => dispatch(deleteProduct(p.id))}>
                        <IconTrash className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconPackage className="w-5 h-5 text-[hsl(var(--muted-foreground))]" stroke={1.5} />
            Recent Inventory Changes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {inventoryLogs.slice(0, 5).map(log => {
              const product = products.find(p => p.id === log.productId);
              return (
                <div key={log.id} className="flex items-center justify-between p-3 bg-[hsl(var(--muted))] rounded-xl text-sm">
                  <div>
                    <span className="font-semibold">{product?.name || log.productId}</span>
                    <span className="text-[hsl(var(--muted-foreground))] ml-2">— {log.reason}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${log.changeType === 'purchase' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : log.changeType === 'waste' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {log.changeType}
                    </span>
                    <span className={`font-bold ${log.changeType === 'waste' || log.changeType === 'sale' ? 'text-[hsl(var(--destructive))]' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {log.changeType === 'waste' || log.changeType === 'sale' ? '-' : '+'}{log.quantity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm ring-offset-[hsl(var(--background))] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  {activeCategories.map(c => <option key={c.id || c._id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <Label>SKU</Label>
                <Input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} placeholder="SKU-001" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Price ($)</Label>
                <Input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <Label>Cost ($)</Label>
                <Input type="number" step="0.01" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Stock Quantity</Label>
                <Input type="number" value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: e.target.value })} />
              </div>
              <div>
                <Label>Min Stock Level</Label>
                <Input type="number" value={form.minStockLevel} onChange={e => setForm({ ...form, minStockLevel: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isBakeryItem} onChange={e => setForm({ ...form, isBakeryItem: e.target.checked })} className="w-4 h-4 rounded" />
              <span className="text-sm">Bakery item (recipe-based)</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Save Changes' : 'Add Product'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
