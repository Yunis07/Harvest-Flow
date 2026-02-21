import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
export type UserRole = 'buyer' | 'seller' | 'transporter';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUser: (data: Partial<User>) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}

// Demo users for each role
const DEMO_USERS: Record<UserRole, User> = {
  buyer: {
    id: 'buyer-demo-001',
    name: 'Rajesh Kumar',
    email: 'rajesh@harvestlog.in',
    phone: '+91 98765 43210',
    role: 'buyer',
    avatar: undefined,
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'New Delhi, India'
    },
    createdAt: new Date('2024-01-15'),
  },
  seller: {
    id: 'seller-demo-001',
    name: 'Priya Sharma',
    email: 'priya@harvestlog.in',
    phone: '+91 98765 43211',
    role: 'seller',
    avatar: undefined,
    location: {
      lat: 28.5355,
      lng: 77.3910,
      address: 'Noida, Uttar Pradesh'
    },
    createdAt: new Date('2024-02-01'),
  },
  transporter: {
    id: 'transporter-demo-001',
    name: 'Amit Singh',
    email: 'amit@harvestlog.in',
    phone: '+91 98765 43212',
    role: 'transporter',
    avatar: undefined,
    location: {
      lat: 28.4595,
      lng: 77.0266,
      address: 'Gurgaon, Haryana'
    },
    createdAt: new Date('2024-01-20'),
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo, any login works - default to buyer
    const user = DEMO_USERS.buyer;
    
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      createdAt: new Date(),
    };
    
    setState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    // Switch to demo user for that role
    const demoUser = DEMO_USERS[role];
    setState(prev => ({
      ...prev,
      user: demoUser,
    }));
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...data } : null,
    }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        switchRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { DEMO_USERS };
