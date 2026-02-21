import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';
import { Send, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface OrderChatProps {
  messages: ChatMessage[];
  currentUserId: string;
  currentUserName: string;
  currentUserRole: 'buyer' | 'seller' | 'transporter';
  onSend: (
    senderId: string,
    senderName: string,
    senderRole: 'buyer' | 'seller' | 'transporter',
    content: string
  ) => boolean;
}

const ROLE_COLORS: Record<string, string> = {
  buyer: 'text-red-600',
  seller: 'text-blue-600',
  transporter: 'text-emerald-600',
  system: 'text-muted-foreground',
};

export function OrderChat({
  messages,
  currentUserId,
  currentUserName,
  currentUserRole,
  onSend,
}: OrderChatProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    const ok = onSend(currentUserId, currentUserName, currentUserRole, input);
    if (ok) setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <MessageCircle className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm">Order Chat</h3>
        <span className="text-xs text-muted-foreground ml-auto">
          {messages.length} messages
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
        {messages.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-8">
            Chat will appear here when the order is accepted.
          </p>
        )}
        {messages.map((msg) => {
          if (msg.type === 'system') {
            return (
              <div
                key={msg.id}
                className="flex justify-center"
              >
                <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {msg.content}
                </span>
              </div>
            );
          }

          const isOwn = msg.senderId === currentUserId;

          return (
            <div
              key={msg.id}
              className={cn('flex flex-col max-w-[80%]', isOwn ? 'ml-auto items-end' : 'items-start')}
            >
              {!isOwn && (
                <span className={cn('text-xs font-medium mb-0.5', ROLE_COLORS[msg.senderRole])}>
                  {msg.senderName}
                </span>
              )}
              <div
                className={cn(
                  'px-3 py-2 rounded-xl text-sm',
                  isOwn
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted rounded-bl-sm'
                )}
              >
                {msg.content}
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1"
          maxLength={500}
        />
        <Button
          variant="forest"
          size="icon"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
