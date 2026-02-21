import { useState, useCallback, useRef } from 'react';
import type { OrderStatus } from '@/types';

export interface OrderEntity {
  id: string;
  role: 'buyer' | 'seller' | 'transport';
  name: string;
  lat: number;
  lng: number;
  onlineStatus: boolean;
  lastUpdated: number;
}

export interface ActiveOrder {
  id: string;
  status: OrderStatus;
  buyer: OrderEntity;
  seller: OrderEntity;
  transporter: OrderEntity | null;
  items: { name: string; quantity: number; pricePerKg: number }[];
  totalAmount: number;
  deliveryFee: number;
  createdAt: number;
  updatedAt: number;
  chatId: string | null;
}

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  CREATED: ['TRANSPORT_ASSIGNED', 'CANCELLED'],
  TRANSPORT_ASSIGNED: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: ['IN_TRANSIT', 'CANCELLED'],
  IN_TRANSIT: ['DELIVERED'],
  DELIVERED: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
};

export function useOrderSystem() {
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lockRef = useRef(false); // Race-condition guard

  const createOrder = useCallback(
    (
      buyer: OrderEntity,
      seller: OrderEntity,
      items: ActiveOrder['items']
    ) => {
      if (activeOrder) {
        setError('An order is already active');
        return null;
      }

      const totalAmount = items.reduce(
        (sum, i) => sum + i.quantity * i.pricePerKg,
        0
      );
      const deliveryFee = Math.round(totalAmount * 0.1 + 50);
      const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

      const order: ActiveOrder = {
        id: orderId,
        status: 'CREATED',
        buyer,
        seller,
        transporter: null,
        items,
        totalAmount,
        deliveryFee,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        chatId: null,
      };

      setActiveOrder(order);
      setError(null);
      return order;
    },
    [activeOrder]
  );

  const transitionOrder = useCallback(
    (nextStatus: OrderStatus) => {
      if (lockRef.current) {
        setError('Order update in progress');
        return false;
      }

      lockRef.current = true;

      setActiveOrder((prev) => {
        if (!prev) {
          setError('No active order');
          lockRef.current = false;
          return prev;
        }

        const allowed = VALID_TRANSITIONS[prev.status];
        if (!allowed.includes(nextStatus)) {
          setError(
            `Cannot transition from ${prev.status} to ${nextStatus}`
          );
          lockRef.current = false;
          return prev;
        }

        lockRef.current = false;
        setError(null);
        return { ...prev, status: nextStatus, updatedAt: Date.now() };
      });

      return true;
    },
    []
  );

  const assignTransporter = useCallback(
    (transporter: OrderEntity) => {
      if (lockRef.current) {
        setError('Order update in progress');
        return false;
      }

      lockRef.current = true;

      setActiveOrder((prev) => {
        if (!prev) {
          lockRef.current = false;
          return prev;
        }
        if (prev.transporter) {
          setError('Transporter already assigned');
          lockRef.current = false;
          return prev;
        }
        if (prev.status !== 'CREATED') {
          setError('Order not in assignable state');
          lockRef.current = false;
          return prev;
        }

        lockRef.current = false;
        setError(null);
        return {
          ...prev,
          transporter,
          status: 'TRANSPORT_ASSIGNED' as OrderStatus,
          chatId: `chat-${prev.id}`,
          updatedAt: Date.now(),
        };
      });

      return true;
    },
    []
  );

  const cancelOrder = useCallback(() => {
    setActiveOrder((prev) => {
      if (!prev) return prev;
      if (prev.status === 'COMPLETED' || prev.status === 'CANCELLED') return prev;
      return { ...prev, status: 'CANCELLED', updatedAt: Date.now() };
    });
  }, []);

  const clearOrder = useCallback(() => {
    setActiveOrder(null);
    setError(null);
  }, []);

  return {
    activeOrder,
    error,
    createOrder,
    transitionOrder,
    assignTransporter,
    cancelOrder,
    clearOrder,
  };
}
