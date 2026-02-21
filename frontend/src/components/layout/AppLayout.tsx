import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { RoleSwitcher } from '@/components/shared/RoleSwitcher';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { 
  Home, ShoppingBag, MapPin, Heart, Package, BarChart3, Star, Truck,
  DollarSign, Bell, Menu, X, LogOut, Leaf, Navigation, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  labelKey: string;
  path: string;
  icon: typeof Home;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  buyer: [
    { labelKey: 'marketplace', path: '/marketplace', icon: ShoppingBag },
    { labelKey: 'orderAndTrack', path: '/live-tracking', icon: Navigation },
    { labelKey: 'trendingHarvest', path: '/ugly-produce', icon: Heart },
    { labelKey: 'nearbyContacts', path: '/nearby-contacts', icon: Users },
    { labelKey: 'myOrders', path: '/orders', icon: Package },
  ],
  seller: [
    { labelKey: 'dashboard', path: '/dashboard', icon: Home },
    { labelKey: 'inventory', path: '/inventory', icon: Package },
    { labelKey: 'orders', path: '/orders', icon: ShoppingBag },
    { labelKey: 'nearbyContacts', path: '/nearby-contacts', icon: Users },
    { labelKey: 'analytics', path: '/analytics', icon: BarChart3 },
  ],
  transporter: [
    { labelKey: 'dashboard', path: '/dashboard', icon: Home },
    { labelKey: 'activeRide', path: '/active-ride', icon: MapPin },
    { labelKey: 'earnings', path: '/earnings', icon: DollarSign },
  ],
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const { t } = useLanguage();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  const currentRole = user?.role || 'buyer';
  const navItems = NAV_ITEMS[currentRole];

  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40 px-4 flex items-center justify-between">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg">Harvest-Flow</span>
        </div>
        <Link to="/notifications" className="p-2 hover:bg-muted rounded-lg transition-colors relative">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)} className="lg:hidden fixed inset-0 bg-black/50 z-40" />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-card z-50 flex flex-col">
              <SidebarContent navItems={navItems} currentPath={location.pathname}
                onClose={() => setIsSidebarOpen(false)} user={user} logout={logout} t={t} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-[280px] bg-card border-r border-border z-30 flex-col">
        <SidebarContent navItems={navItems} currentPath={location.pathname} user={user} logout={logout} t={t} />
      </aside>

      {/* Main Content */}
      <main className="lg:ml-[280px] pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}

interface SidebarContentProps {
  navItems: NavItem[];
  currentPath: string;
  onClose?: () => void;
  user: ReturnType<typeof useAuth>['user'];
  logout: () => void;
  t: (key: string) => string;
}

function SidebarContent({ navItems, currentPath, onClose, user, logout, t }: SidebarContentProps) {
  return (
    <>
      <div className="h-16 lg:h-20 px-4 lg:px-6 flex items-center justify-between border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-forest rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-lg">Harvest-Flow</span>
            <p className="text-xs text-muted-foreground truncate">{t('agriFintech')}</p>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="px-4 lg:px-6 py-4 border-b border-border">
        <RoleSwitcher />
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <li key={item.path}>
                <Link to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 truncate",
                    isActive ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{t(item.labelKey)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 py-2 border-t border-border">
        <LanguageSwitcher />
      </div>

      <div className="p-4 lg:p-6 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
          <LogOut className="w-4 h-4" />
          <span>{t('logout')}</span>
        </button>
      </div>
    </>
  );
}
