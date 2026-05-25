import { useState } from 'react';
import { IconPlus, IconEdit, IconTrash, IconX } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addUser, updateUserInList, deleteUserFromList } from '../../store/slices/authSlice';
import type { User } from '../../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const ROLES = ['admin', 'manager', 'cashier', 'kitchen'] as const;
const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  manager: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  cashier: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  kitchen: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export default function UserManagement() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector(s => s.auth);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'cashier' as User['role'] });

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditing(null); setForm({ username: '', email: '', password: '', role: 'cashier' }); setShowForm(true); };
  const openEdit = (u: User) => { setEditing(u); setForm({ username: u.username, email: u.email, password: '', role: u.role }); setShowForm(true); };

  const handleSave = () => {
    if (!form.username || !form.email) return;
    if (editing) {
      dispatch(updateUserInList({ ...editing, username: form.username, email: form.email, role: form.role, updatedAt: new Date().toISOString() }));
    } else {
      dispatch(addUser({
        id: 'user-' + Date.now(), username: form.username, email: form.email,
        role: form.role, permissions: [], isActive: true,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      }));
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search users..." className="max-w-xs" />
        <Button onClick={openAdd} className="gap-2" size="sm">
          <IconPlus className="w-4 h-4" /> Add User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead><tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/50">
              <th className="table-header">User</th><th className="table-header">Role</th>
              <th className="table-header">Status</th><th className="table-header">Last Login</th>
              <th className="table-header text-right">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/50 transition-colors">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center text-sm font-bold text-[hsl(var(--primary))]">
                        {u.username.charAt(0)}
                      </div>
                      <div><p className="font-semibold">{u.username}</p><p className="text-xs text-[hsl(var(--muted-foreground))]">{u.email}</p></div>
                    </div>
                  </td>
                  <td className="table-cell"><span className={`badge ${ROLE_COLORS[u.role]}`}>{u.role}</span></td>
                  <td className="table-cell"><span className={`badge ${u.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="table-cell text-xs text-[hsl(var(--muted-foreground))]">{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}</td>
                  <td className="table-cell text-right">
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEdit(u)}><IconEdit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-[hsl(var(--destructive))]" onClick={() => dispatch(deleteUserFromList(u.id))}><IconTrash className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit User' : 'Add User'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Username</Label><Input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            {!editing && <div><Label>Password</Label><Input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>}
            <div><Label>Role</Label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as User['role'] })} className="input-field">
                {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Save' : 'Add User'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
