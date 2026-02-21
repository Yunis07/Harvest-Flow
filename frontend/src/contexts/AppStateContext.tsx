import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Product, CartItem } from '@/types';
import { SAMPLE_PRODUCTS, UGLY_PRODUCE, SAMPLE_TRANSPORT_REQUESTS } from '@/data/mockData';

/* ─── Order shared across roles ─── */
export interface SharedOrder {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  items: { productName: string; quantity: number; pricePerKg: number }[];
  totalAmount: number;
  deliveryFee: number;
  status: 'PENDING' | 'ACCEPTED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';
  transporterId?: string;
  transporterName?: string;
  pickupAddress: string;
  deliveryAddress: string;
  createdAt: Date;
}

/* ─── Contact shared across roles ─── */
export interface UserContact {
  id: string;
  userId: string;
  name: string;
  role: 'buyer' | 'seller';
  phone: string;
  whatsapp?: string;
  address: string;
  isPublic: boolean;
  createdAt: Date;
}

/* ─── Deal history ─── */
export interface DealRecord {
  id: string;
  contactId: string;
  contactName: string;
  contactRole: 'buyer' | 'seller';
  orderId: string;
  amount: number;
  date: Date;
}

interface AppStateContextType {
  /* Products */
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;

  /* Cart (buyer) */
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  /* Orders */
  orders: SharedOrder[];
  placeOrder: (order: SharedOrder) => void;
  updateOrderStatus: (orderId: string, status: SharedOrder['status'], transporterName?: string) => void;

  /* Transport requests accepted */
  acceptedOrderId: string | null;
  setAcceptedOrderId: (id: string | null) => void;

  /* Contacts */
  contacts: UserContact[];
  addContact: (c: UserContact) => void;
  updateContact: (id: string, updates: Partial<UserContact>) => void;
  removeContact: (id: string) => void;

  /* Favorites */
  favorites: string[]; // contact IDs
  toggleFavorite: (contactId: string) => void;

  /* Deal history */
  dealHistory: DealRecord[];
  addDeal: (d: DealRecord) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

const SAMPLE_CONTACTS: UserContact[] = [
  { id: 'contact-s1', userId: 'seller-demo-001', name: 'Priya Sharma', role: 'seller', phone: '+91 98765 43211', whatsapp: '+919876543211', address: 'Noida, UP', isPublic: true, createdAt: new Date() },
  { id: 'contact-s2', userId: 'seller-002', name: 'Mohan Patel', role: 'seller', phone: '+91 98765 43222', whatsapp: '+919876543222', address: 'Greater Noida, UP', isPublic: true, createdAt: new Date() },
  { id: 'contact-s3', userId: 'seller-003', name: 'Suresh Deshmukh', role: 'seller', phone: '+91 98765 43233', address: 'Delhi', isPublic: true, createdAt: new Date() },
  { id: 'contact-b1', userId: 'buyer-demo-001', name: 'Rajesh Kumar', role: 'buyer', phone: '+91 98765 43210', whatsapp: '+919876543210', address: 'New Delhi', isPublic: true, createdAt: new Date() },
  { id: 'contact-b2', userId: 'buyer-002', name: 'Vikram Mehta', role: 'buyer', phone: '+91 98765 43244', address: 'Gurgaon, Haryana', isPublic: true, createdAt: new Date() },
];

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([...SAMPLE_PRODUCTS, ...UGLY_PRODUCE]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<SharedOrder[]>([]);
  const [acceptedOrderId, setAcceptedOrderId] = useState<string | null>(null);
  const [contacts, setContacts] = useState<UserContact[]>(SAMPLE_CONTACTS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [dealHistory, setDealHistory] = useState<DealRecord[]>([]);

  const addProduct = useCallback((p: Product) => {
    setProducts(prev => [p, ...prev]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const addToCart = useCallback((product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const updateCartQuantity = useCallback((productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => item.product.id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
        .filter(item => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const placeOrder = useCallback((order: SharedOrder) => {
    setOrders(prev => [order, ...prev]);
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: SharedOrder['status'], transporterName?: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, ...(transporterName ? { transporterName } : {}) } : o));
  }, []);

  const addContact = useCallback((c: UserContact) => {
    setContacts(prev => [c, ...prev]);
  }, []);

  const updateContact = useCallback((id: string, updates: Partial<UserContact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const removeContact = useCallback((id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  }, []);

  const toggleFavorite = useCallback((contactId: string) => {
    setFavorites(prev => prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]);
  }, []);

  const addDeal = useCallback((d: DealRecord) => {
    setDealHistory(prev => [d, ...prev]);
  }, []);

  return (
    <AppStateContext.Provider value={{
      products, addProduct, updateProduct, removeProduct,
      cart, addToCart, updateCartQuantity, removeFromCart, clearCart,
      orders, placeOrder, updateOrderStatus,
      acceptedOrderId, setAcceptedOrderId,
      contacts, addContact, updateContact, removeContact,
      favorites, toggleFavorite,
      dealHistory, addDeal,
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
