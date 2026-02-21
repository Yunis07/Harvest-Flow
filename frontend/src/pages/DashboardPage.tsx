import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppState } from '@/contexts/AppStateContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { SAMPLE_ORDERS, ORDER_STATUS_CONFIG, SAMPLE_TRANSPORT_REQUESTS } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { 
  Package, TrendingUp, Star, DollarSign, Clock, CheckCircle2,
  Truck, MapPin, ArrowRight, Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role || 'buyer';

  if (role === 'buyer') return <BuyerDashboard />;
  if (role === 'seller') return <SellerDashboard />;
  return <TransporterDashboard />;
}

function BuyerDashboard() {
  const { t } = useLanguage();
  const { orders } = useAppState();
  const recentOrders = orders.length > 0 ? orders.slice(0, 3) : SAMPLE_ORDERS.slice(0, 3);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">{t('welcomeBackDash')}</h1>
          <p className="text-muted-foreground">{t('trackOrdersDiscover')}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/marketplace" className="card-interactive p-4">
            <Package className="w-8 h-8 text-primary mb-3" />
            <p className="font-semibold truncate">{t('browseMarket')}</p>
            <p className="text-sm text-muted-foreground truncate">{t('findFreshProduce')}</p>
          </Link>
          <Link to="/live-tracking" className="card-interactive p-4">
            <MapPin className="w-8 h-8 text-primary mb-3" />
            <p className="font-semibold truncate">{t('orderAndTrack')}</p>
            <p className="text-sm text-muted-foreground truncate">{t('liveDeliveryTracking')}</p>
          </Link>
          <Link to="/ugly-produce" className="card-interactive p-4">
            <TrendingUp className="w-8 h-8 text-primary mb-3" />
            <p className="font-semibold truncate">{t('saveFood')}</p>
            <p className="text-sm text-muted-foreground truncate">{t('uglyProduceDeals')}</p>
          </Link>
          <Link to="/orders" className="card-interactive p-4">
            <Clock className="w-8 h-8 text-primary mb-3" />
            <p className="font-semibold truncate">{t('myOrders')}</p>
            <p className="text-sm text-muted-foreground truncate">{t('trackDeliveries')}</p>
          </Link>
        </div>

        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t('recentOrders')}</h2>
            <Link to="/orders" className="text-sm text-primary font-medium flex items-center gap-1">
              {t('viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order: any) => {
              const statusConfig = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG] || ORDER_STATUS_CONFIG.CREATED;
              return (
                <div key={order.id} className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                  <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {order.items?.map((i: any) => i.productName || i.name).join(', ')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.sellerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{(order.totalAmount || 0).toLocaleString()}</p>
                    <span className={cn("inline-block px-2 py-0.5 rounded-full text-xs font-medium", statusConfig.bgColor, statusConfig.color)}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function SellerDashboard() {
  const { t } = useLanguage();
  const { products, orders } = useAppState();
  const sellerProducts = products.filter(p => p.sellerId === 'seller-demo-001');
  const sellerOrders = orders.filter(o => o.sellerId === 'seller-demo-001');

  const stats = [
    { label: t('totalProducts'), value: String(sellerProducts.length), icon: Package, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: t('activeOrders'), value: String(sellerOrders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100' },
    { label: t('revenueMtd'), value: `₹${sellerOrders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { label: t('avgRating'), value: '4.8★', icon: Star, color: 'text-purple-500', bg: 'bg-purple-100' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">{t('sellerDashboard')}</h1>
          <p className="text-muted-foreground">{t('manageInventoryTrack')}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }} className="card-elevated p-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
                  <Icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground truncate">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Link to="/inventory" className="card-interactive p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-lg">{t('manageInventory')}</p>
                <p className="text-muted-foreground truncate">{t('addEditRemove')}</p>
              </div>
            </div>
          </Link>
          <Link to="/orders" className="card-interactive p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="font-semibold text-lg">{t('pendingOrders')}</p>
                <p className="text-muted-foreground truncate">{sellerOrders.filter(o => o.status === 'PENDING').length} {t('ordersAwaitingAction')}</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="card-elevated p-6">
          <h2 className="text-lg font-semibold mb-4">{t('recentActivity')}</h2>
          <div className="space-y-4">
            {[
              { text: 'New order received for 50kg Tomatoes', time: '5 min ago', type: 'order' },
              { text: 'Order #HRV-2024-089 delivered successfully', time: '1 hour ago', type: 'success' },
              { text: 'New rating received: 5 stars ⭐', time: '3 hours ago', type: 'rating' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-muted rounded-xl">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center",
                  activity.type === 'order' && "bg-blue-100",
                  activity.type === 'success' && "bg-emerald-100",
                  activity.type === 'rating' && "bg-purple-100"
                )}>
                  {activity.type === 'order' && <Package className="w-5 h-5 text-blue-500" />}
                  {activity.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  {activity.type === 'rating' && <Star className="w-5 h-5 text-purple-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function TransporterDashboard() {
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const { orders, updateOrderStatus, setAcceptedOrderId } = useAppState();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());

  // Combine shared orders (PENDING) with sample requests
  const pendingOrders = orders.filter(o => o.status === 'PENDING' && !dismissed.has(o.id));
  const sampleRequests = SAMPLE_TRANSPORT_REQUESTS.filter(r => !dismissed.has(r.id));

  const stats = [
    { label: t('totalDeliveries'), value: '156', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-100' },
    { label: t('distanceKm'), value: '2,340', icon: MapPin, color: 'text-amber-500', bg: 'bg-amber-100' },
    { label: t('earningsMtd'), value: '₹28,450', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { label: t('avgRating'), value: '4.9★', icon: Star, color: 'text-purple-500', bg: 'bg-purple-100' },
  ];

  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'ACCEPTED', 'Amit Singh');
    setAcceptedOrderId(orderId);
    addNotification({ type: 'delivery', title: 'Request Accepted', message: `You accepted delivery for order ${orderId}` });
    navigate('/active-ride');
  };

  const handleAcceptSample = (request: typeof SAMPLE_TRANSPORT_REQUESTS[0]) => {
    addNotification({ type: 'delivery', title: 'Request Accepted', message: `You accepted delivery for ${request.items.join(', ')}` });
    setAcceptedOrderId(request.id);
    navigate('/active-ride');
  };

  const handleReject = (id: string) => {
    setDismissed(prev => new Set(prev).add(id));
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">{t('transporterDashboard')}</h1>
          <p className="text-muted-foreground">{t('acceptDeliveriesMaximize')}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }} className="card-elevated p-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
                  <Icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground truncate">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="card-elevated p-6">
          <h2 className="text-lg font-semibold mb-4">{t('nearbyRequests')}</h2>
          <div className="space-y-4">
            {/* Real orders from buyers */}
            {pendingOrders.map(order => (
              <div key={order.id} className="p-4 bg-muted rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{order.items.map(i => i.productName).join(', ')}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.reduce((s, i) => s + i.quantity, 0)}kg • {order.buyerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₹{order.deliveryFee}</p>
                    <p className="text-xs text-muted-foreground">{t('estEarnings')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm mb-4">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span className="truncate">{order.pickupAddress}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="truncate">{order.deliveryAddress}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleReject(order.id)}>
                    {t('reject')}
                  </Button>
                  <Button variant="forest" size="sm" className="flex-1" onClick={() => handleAcceptOrder(order.id)}>
                    {t('accept')}
                  </Button>
                </div>
              </div>
            ))}

            {/* Sample requests */}
            {sampleRequests.map(request => (
              <div key={request.id} className="p-4 bg-muted rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{request.items.join(', ')}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.totalWeight}kg • {request.distance.toFixed(1)} km
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">₹{request.estimatedEarnings}</p>
                    <p className="text-xs text-muted-foreground">{t('estEarnings')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm mb-4">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span className="truncate">{request.pickupLocation.address}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="truncate">{request.deliveryLocation.address}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleReject(request.id)}>
                    {t('reject')}
                  </Button>
                  <Button variant="forest" size="sm" className="flex-1" onClick={() => handleAcceptSample(request)}>
                    {t('accept')}
                  </Button>
                </div>
              </div>
            ))}

            {pendingOrders.length === 0 && sampleRequests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Truck className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>{t('noNearbyRequests')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
