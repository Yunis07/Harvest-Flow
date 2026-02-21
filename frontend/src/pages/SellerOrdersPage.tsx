import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppState } from '@/contexts/AppStateContext';
import { SAMPLE_ORDERS, ORDER_STATUS_CONFIG } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Package, MapPin, Clock, User } from 'lucide-react';

export function SellerOrdersPage() {
  const { t } = useLanguage();
  const { orders } = useAppState();

  // Show shared orders for seller + sample fallback
  const sellerOrders = orders.filter(o => o.sellerId === 'seller-demo-001');
  const allOrders = sellerOrders.length > 0 ? sellerOrders : SAMPLE_ORDERS;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">{t('sellerOrders')}</h1>
          <p className="text-muted-foreground text-sm">{t('trackManageBuyerOrders')}</p>
        </div>

        {allOrders.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>{t('noOrdersYet')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allOrders.map((order: any) => {
              const sc = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG] || ORDER_STATUS_CONFIG.CREATED;
              return (
                <div key={order.id} className="card-elevated p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm">{order.id}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <User className="w-3 h-3" />
                        {order.buyerName}
                      </p>
                    </div>
                    <span className={cn('px-3 py-1 rounded-full text-xs font-semibold', sc.bgColor, sc.color)}>
                      {sc.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">{t('itemsLabel') || 'Items'}</p>
                      <p className="font-medium">{order.items?.map((i: any) => i.productName || i.name).join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('totalLabel') || 'Total'}</p>
                      <p className="font-medium">₹{(order.totalAmount || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('delivery') || 'Delivery'}</p>
                      <p className="font-medium">₹{order.deliveryFee || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('transporterLabel') || 'Transporter'}</p>
                      <p className="font-medium">{order.transporterName || '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {order.pickupAddress || order.pickupLocation?.address}
                    </span>
                    <span>→</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {order.deliveryAddress || order.deliveryLocation?.address}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {t('placed') || 'Placed'} {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
