import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  ShoppingCart, 
  Store, 
  Truck, 
  Settings,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

interface RoleSwitcherProps {
  className?: string;
}

const ROLE_CONFIG: Record<UserRole, { 
  label: string; 
  icon: typeof ShoppingCart; 
  color: string;
  bgColor: string;
  description: string;
}> = {
  buyer: {
    label: 'Buyer',
    icon: ShoppingCart,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Browse & purchase produce',
  },
  seller: {
    label: 'Seller',
    icon: Store,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    description: 'Manage inventory & orders',
  },
  transporter: {
    label: 'Transporter',
    icon: Truck,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    description: 'Deliver orders & earn',
  },
};

export function RoleSwitcher({ className }: RoleSwitcherProps) {
  const { user, switchRole } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const currentRole = user?.role || 'buyer';
  const CurrentIcon = ROLE_CONFIG[currentRole].icon;

  return (
    <div className={cn("relative", className)}>
      {/* Admin Demo Badge */}
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Admin Demo Mode
        </span>
      </div>
      
      {/* Role Selector */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200",
          "hover:border-primary/50 hover:shadow-md",
          isOpen ? "border-primary shadow-md" : "border-border"
        )}
      >
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          ROLE_CONFIG[currentRole].bgColor
        )}>
          <CurrentIcon className={cn("w-5 h-5", ROLE_CONFIG[currentRole].color)} />
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-sm">{ROLE_CONFIG[currentRole].label}</p>
          <p className="text-xs text-muted-foreground">{ROLE_CONFIG[currentRole].description}</p>
        </div>
        <ChevronDown className={cn(
          "w-5 h-5 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border border-border shadow-xl z-50 overflow-hidden"
        >
          {(Object.keys(ROLE_CONFIG) as UserRole[]).map((role) => {
            const config = ROLE_CONFIG[role];
            const Icon = config.icon;
            const isActive = role === currentRole;
            
            return (
              <button
                key={role}
                onClick={() => {
                  switchRole(role);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 p-3 transition-colors",
                  isActive 
                    ? "bg-primary/5" 
                    : "hover:bg-muted"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  config.bgColor
                )}>
                  <Icon className={cn("w-5 h-5", config.color)} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">{config.label}</p>
                  <p className="text-xs text-muted-foreground">{config.description}</p>
                </div>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
