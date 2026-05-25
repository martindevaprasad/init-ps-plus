import { useState } from 'react';
import { Plus, Edit3, Trash2, X, Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addUser, updateUserInList, deleteUserFromList } from '../../store/slices/authSlice';
import type { User } from '../../types';

const ROLES = ['admin', 'manager', 'cashier', 'kitchen'] as const;
const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-100 text-red-700', manager: 'bg-blue-100 text-blue-700',
  cashier: 'bg-emerald-100 text-emerald-700', kitchen: 'bg-amber-100 text-amber-700',
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
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search users..." className="input-field max-w-xs" />
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-surface-200 bg-surface-50/50">
            <th className="table-header">User</th><th className="table-header">Role</th>
            <th className="table-header">Status</th><th className="table-header">Last Login</th>
            <th className="table-header text-right">Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-surface-100 hover:bg-surface-50/50 transition-colors">
                <td className="table-cell">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-600">
                      {u.username.charAt(0)}
                    </div>
                    <div><p className="font-semibold text-surface-800">{u.username}</p><p className="text-xs text-surface-500">{u.email}</p></div>
                  </div>
                </td>
                <td className="table-cell"><span className={`badge ${ROLE_COLORS[u.role]}`}>{u.role}</span></td>
                <td className="table-cell"><span className={`badge ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="table-cell text-xs text-surface-500">{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}</td>
                <td className="table-cell text-right">
                  <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-blue-600"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => dispatch(deleteUserFromList(u.id))} className="p-1.5 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-500 ml-1"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="glass-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">{editing ? 'Edit User' : 'Add User'}</h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-surface-100"><X className="w-5 h-5 text-surface-400" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-surface-700 mb-1">Username</label>
                <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="input-field" /></div>
              <div><label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field" /></div>
              {!editing && <div><label className="block text-sm font-medium text-surface-700 mb-1">Password</label>
                <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-field" /></div>}
              <div><label className="block text-sm font-medium text-surface-700 mb-1">Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as User['role'] })} className="input-field">
                  {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={handleSave} className="btn-primary text-sm">{editing ? 'Save' : 'Add User'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
