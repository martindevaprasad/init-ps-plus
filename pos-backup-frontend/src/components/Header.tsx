import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Bell, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { logoutUser } from '../store/slices/authSlice';

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
    <header className="h-16 bg-white border-b border-surface-200 flex items-center justify-between px-6 shrink-0">
      <div>
        <h2 className="text-xl font-bold text-surface-900">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-surface-100 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-surface-700 placeholder-surface-400 focus:outline-none w-40"
          />
        </div>

        {/* Notifications */}
        <button id="header-notifications" className="relative p-2 rounded-xl hover:bg-surface-100 transition-colors">
          <Bell className="w-5 h-5 text-surface-500" />
          {activeOrders > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeOrders}
            </span>
          )}
        </button>

        {/* User + Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-surface-200">
          <span className="text-sm text-surface-600 hidden sm:block">
            {user?.username}
          </span>
          <button
            id="header-logout"
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-red-50 text-surface-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
