import { useState } from 'react';
import { IconPlus, IconEdit, IconTrash, IconSearch, IconTags } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addCategory, updateCategory, deleteCategory } from '../../store/slices/categorySlice';
import type { Category } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function CategoryMaster() {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector(s => s.categories);

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', parentCategory: '', description: '' });

  const activeCategories = categories.filter(c => c.isActive);
  const rootCategories = activeCategories.filter(c => !c.parentCategory);

  const filtered = activeCategories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', parentCategory: '', description: '' });
    setShowForm(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, parentCategory: (c.parentCategory as string) || '', description: c.description || '' });
    setShowForm(true);
  };

  const handleSave = () => {
    const category: Category = {
      id: editing?.id || 'c-' + Date.now(),
      _id: editing?._id || 'c-' + Date.now(),
      name: form.name,
      parentCategory: form.parentCategory || null,
      description: form.description,
      isActive: true,
      createdAt: editing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (editing) dispatch(updateCategory(category));
    else dispatch(addCategory(category));
    setShowForm(false);
  };

  const getCategoryName = (id: string | Category | null) => {
    if (!id) return '-';
    if (typeof id === 'string') {
      return activeCategories.find(c => c.id === id || c._id === id)?.name || id;
    }
    return id.name;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative min-w-[260px]">
          <IconSearch className="w-4 h-4 text-[hsl(var(--muted-foreground))] absolute left-3 top-1/2 -translate-y-1/2" />
          <Input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search categories..." className="pl-9" />
        </div>
        <Button onClick={openAdd} className="gap-2" size="sm">
          <IconPlus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      {/* Categories Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50">
                  <th className="table-header">Category Name</th>
                  <th className="table-header">Parent Category</th>
                  <th className="table-header">Description</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id || c._id} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/50 transition-colors">
                    <td className="table-cell font-semibold">
                      <div className="flex items-center gap-2">
                        <IconTags className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                        {c.name}
                      </div>
                    </td>
                    <td className="table-cell text-[hsl(var(--muted-foreground))]">
                      {getCategoryName(c.parentCategory)}
                    </td>
                    <td className="table-cell text-[hsl(var(--muted-foreground))]">{c.description || '-'}</td>
                    <td className="table-cell text-right">
                      <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEdit(c)}>
                        <IconEdit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-[hsl(var(--destructive))]" onClick={() => dispatch(deleteCategory((c.id || c._id) as string))}>
                        <IconTrash className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[hsl(var(--muted-foreground))]">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category Name *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Starters, Beverages" />
            </div>
            <div>
              <Label>Parent Category</Label>
              <select 
                value={form.parentCategory} 
                onChange={e => setForm({ ...form, parentCategory: e.target.value })} 
                className="flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm ring-offset-[hsl(var(--background))] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">-- None (Root Category) --</option>
                {rootCategories.filter(rc => rc.id !== editing?.id).map(rc => (
                  <option key={rc.id || rc._id} value={rc.id || rc._id}>{rc.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Description</Label>
              <textarea 
                value={form.description} 
                onChange={e => setForm({ ...form, description: e.target.value })} 
                className="flex min-h-[80px] w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2 text-sm ring-offset-[hsl(var(--background))] placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={3} 
                placeholder="Optional description..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()}>{editing ? 'Save Changes' : 'Add Category'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
