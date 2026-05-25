import { NavLink } from 'react-router-dom';
import {
  IconLayoutDashboard, IconShoppingCart, IconToolsKitchen2, IconPackage,
  IconCreditCard, IconReceipt, IconChartBar, IconUsers, IconCoffee, IconX,
} from '@tabler/icons-react';
import { useAppSelector } from '../hooks/useAppDispatch';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: IconLayoutDashboard },
  { to: '/orders', label: 'Orders', icon: IconShoppingCart },
  { to: '/kitchen', label: 'Kitchen Display', icon: IconToolsKitchen2 },
  { to: '/inventory', label: 'Inventory', icon: IconPackage },
  { to: '/payments', label: 'Payments', icon: IconCreditCard },
  { to: '/transactions', label: 'Transactions', icon: IconReceipt },
  { to: '/reports', label: 'Reports', icon: IconChartBar },
  { to: '/users', label: 'Users', icon: IconUsers, adminOnly: true },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { user } = useAppSelector(s => s.auth);

  return (
    <aside
      data-tour="sidebar"
      className="h-full w-64 flex flex-col shrink-0 border-r border-[hsl(var(--border))] bg-[hsl(var(--card))]"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[hsl(var(--border))]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary))]/70 flex items-center justify-center shadow-glow">
            <IconCoffee className="w-5 h-5 text-[hsl(var(--primary-foreground))]" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">BakeryPOS</h1>
            <p className="text-[10px] text-[hsl(var(--muted-foreground))] uppercase tracking-widest">Restaurant & Bakery</p>
          </div>
        </div>
        {/* Close button on mobile */}
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
          <IconX className="w-5 h-5" />
        </Button>
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
              onClick={onClose}
              className={({ isActive }) =>
                cn('sidebar-link', isActive && 'sidebar-link-active')
              }
            >
              <Icon className="w-[18px] h-[18px]" stroke={1.5} />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <Separator />

      {/* User info */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[hsl(var(--primary))]/20 flex items-center justify-center text-sm font-bold text-[hsl(var(--primary))]">
            {user?.username?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.username}</p>
            <p className="text-[11px] text-[hsl(var(--muted-foreground))] capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
