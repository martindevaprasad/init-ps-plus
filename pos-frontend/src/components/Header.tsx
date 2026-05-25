import { useNavigate, useLocation } from 'react-router-dom';
import { IconLogout, IconBell, IconSearch } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { logoutUser } from '../store/slices/authSlice';
import { ThemeSwitcher } from './theme/ThemeSwitcher';
import { ThemeCustomizer } from './theme/ThemeCustomizer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/orders': 'Order Management',
  '/kitchen': 'Kitchen Display',
  '/inventory': 'Inventory Management',
  '/payments': 'Payment Processing',
  '/transactions': 'Transaction History',
  '/reports': 'Reports & Analytics',
  '/users': 'User Management',
};

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAppSelector(s => s.auth);
  const { orders } = useAppSelector(s => s.order);

  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;
  const title = PAGE_TITLES[pathname] || 'BakeryPOS';

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6 hidden md:block" />
        <h2 className="text-base font-bold truncate">{title}</h2>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 relative" data-tour="header-search">
          <IconSearch className="w-4 h-4 text-[hsl(var(--muted-foreground))] absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-9 w-40 h-9 text-sm"
          />
        </div>

        {/* Theme Controls */}
        <ThemeSwitcher />
        <ThemeCustomizer />

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          id="header-notifications"
          data-tour="header-notifications"
          className="relative"
        >
          <IconBell className="w-5 h-5" />
          {activeOrders > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeOrders}
            </span>
          )}
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* User + Logout */}
        <span className="text-sm text-[hsl(var(--muted-foreground))] hidden sm:block">
          {user?.username}
        </span>
        <Button
          variant="ghost"
          size="icon"
          id="header-logout"
          data-tour="header-logout"
          onClick={handleLogout}
          className="hover:text-[hsl(var(--destructive))]"
          aria-label="Logout"
        >
          <IconLogout className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
