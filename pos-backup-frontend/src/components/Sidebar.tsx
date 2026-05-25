import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, ChefHat, Package, CreditCard,
  Receipt, BarChart3, Users, Coffee,
} from 'lucide-react';
import { useAppSelector } from '../hooks/useAppDispatch';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/kitchen', label: 'Kitchen Display', icon: ChefHat },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/transactions', label: 'Transactions', icon: Receipt },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/users', label: 'Users', icon: Users, adminOnly: true },
];

export default function Sidebar() {
  const { user } = useAppSelector(s => s.auth);

  return (
    <aside className="glass-card-dark w-64 flex flex-col shrink-0 border-r border-surface-800">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-surface-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-glow">
          <Coffee className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">BakeryPOS</h1>
          <p className="text-[10px] text-surface-500 uppercase tracking-widest">Restaurant & Bakery</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, adminOnly }) => {
          if (adminOnly && user?.role !== 'admin' && user?.role !== 'manager') return null;
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
            </NavLink>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-surface-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-500/20 flex items-center justify-center text-sm font-bold text-brand-400">
            {user?.username?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.username}</p>
            <p className="text-[11px] text-surface-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
