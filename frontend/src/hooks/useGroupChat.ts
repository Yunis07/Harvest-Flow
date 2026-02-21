import { useState, useCallback, useRef } from 'react';
import type { ChatMessage } from '@/types';

const MAX_MESSAGES = 200;
const FLOOD_INTERVAL_MS = 500;

export function useGroupChat(orderId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const lastSendRef = useRef(0);

  const addSystemMessage = useCallback(
    (content: string) => {
      if (!orderId) return;
      const msg: ChatMessage = {
        id: `sys-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        orderId,
        senderId: 'system',
        senderName: 'System',
        senderRole: 'system',
        content,
        timestamp: new Date(),
        type: 'system',
      };
      setMessages((prev) => [...prev.slice(-(MAX_MESSAGES - 1)), msg]);
    },
    [orderId]
  );

  const sendMessage = useCallback(
    (
      senderId: string,
      senderName: string,
      senderRole: 'buyer' | 'seller' | 'transporter',
      content: string
    ) => {
      if (!orderId) return false;

      // Flood protection
      const now = Date.now();
      if (now - lastSendRef.current < FLOOD_INTERVAL_MS) return false;
      lastSendRef.current = now;

      // Sanitize
      const sanitized = content.trim().slice(0, 500);
      if (!sanitized) return false;

      const msg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        orderId,
        senderId,
        senderName,
        senderRole,
        content: sanitized,
        timestamp: new Date(),
        type: 'text',
      };
      setMessages((prev) => [...prev.slice(-(MAX_MESSAGES - 1)), msg]);
      return true;
    },
    [orderId]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, addSystemMessage, sendMessage, clearChat };
}
