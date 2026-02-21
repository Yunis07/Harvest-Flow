import React from 'react';
import type { OrderStatus } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'CREATED', label: 'Placed' },
  { status: 'TRANSPORT_ASSIGNED', label: 'Transport Assigned' },
  { status: 'PICKED_UP', label: 'Picked Up' },
  { status: 'IN_TRANSIT', label: 'In Transit' },
  { status: 'DELIVERED', label: 'Delivered' },
  { status: 'COMPLETED', label: 'Completed' },
];

const STATUS_ORDER = STEPS.map((s) => s.status);

interface OrderStatusBarProps {
  currentStatus: OrderStatus;
}

export function OrderStatusBar({ currentStatus }: OrderStatusBarProps) {
  if (currentStatus === 'CANCELLED') {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 rounded-xl">
        <span className="text-sm font-medium text-destructive">Order Cancelled</span>
      </div>
    );
  }

  const currentIdx = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
      {STEPS.map((step, i) => {
        const isDone = i < currentIdx;
        const isCurrent = i === currentIdx;

        return (
          <React.Fragment key={step.status}>
            {i > 0 && (
              <div
                className={cn(
                  'flex-shrink-0 w-6 h-0.5 rounded',
                  isDone ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-primary" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground/40" />
              )}
              <span
                className={cn(
                  'text-xs font-medium whitespace-nowrap',
                  isDone && 'text-primary',
                  isCurrent && 'text-foreground',
                  !isDone && !isCurrent && 'text-muted-foreground/50'
                )}
              >
                {step.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
