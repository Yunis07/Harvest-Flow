import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AppLayout } from '@/components/layout/AppLayout';
import { useLocationTracking, EntityLocation } from '@/hooks/useLocationTracking';
import { useOsrmRoutes } from '@/hooks/useOsrmRoutes';
import { useOrderSystem, OrderEntity } from '@/hooks/useOrderSystem';
import { useGroupChat } from '@/hooks/useGroupChat';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { OrderChat } from '@/components/order/OrderChat';
import { OrderStatusBar } from '@/components/order/OrderStatusBar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { haversineDistance } from '@/lib/geo';
import {
  MapPin,
  Navigation,
  Truck,
  Store,
  ShoppingCart,
  Route,
  Loader2,
  Signal,
  SignalZero,
  MessageCircle,
  X,
  Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Marker Factories ─── */
function createEntityIcon(color: string, label: string) {
  return L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="width:36px;height:36px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-weight:700;font-size:14px;">${label}</span>
        </div>
        <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${color};margin-top:-2px;"></div>
      </div>
    `,
    className: 'entity-marker',
    iconSize: [36, 48],
    iconAnchor: [18, 48],
    popupAnchor: [0, -48],
  });
}

const BUYER_ICON = createEntityIcon('#ef4444', 'B');
const SELLER_ICON = createEntityIcon('#3b82f6', 'S');
const TRANSPORT_ICON = createEntityIcon('#10b981', 'T');

const ROUTE_COLORS = {
  buyerToSeller: '#3b82f6',
  sellerToTransport: '#f59e0b',
  buyerToTransport: '#10b981',
};

/* ─── Default entity for pre-ready state ─── */
const FALLBACK_LOC: EntityLocation = {
  id: 'fallback',
  role: 'buyer',
  name: '',
  lat: 0,
  lng: 0,
  timestamp: 0,
};

/* ─── Page Component ─── */
export function LiveTrackingPage() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  // Map refs
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{
    buyer: L.Marker | null;
    seller: L.Marker | null;
    transport: L.Marker | null;
  }>({ buyer: null, seller: null, transport: null });
  const routeLayersRef = useRef<L.Polyline[]>([]);
  const hasZoomedRef = useRef(false);

  // Chat panel
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Tracking
  const {
    buyerLocation,
    sellerLocation,
    transportLocation,
    isTracking,
    buyerLocationReady,
    error: trackingError,
    startTracking,
    stopTracking,
  } = useLocationTracking();

  // Use safe values for computation
  const safeBuyer = buyerLocation || FALLBACK_LOC;
  const safeSeller = sellerLocation || FALLBACK_LOC;
  const safeTransport = transportLocation || FALLBACK_LOC;

  // Order system
  const {
    activeOrder,
    error: orderError,
    createOrder,
    transitionOrder,
    assignTransporter,
    cancelOrder,
    clearOrder,
  } = useOrderSystem();

  // Chat
  const { messages, addSystemMessage, sendMessage, clearChat } = useGroupChat(
    activeOrder?.chatId ?? null
  );

  // Routes (only when tracking)
  const isLiveTracking =
    activeOrder !== null &&
    activeOrder.status !== 'CREATED' &&
    activeOrder.status !== 'CANCELLED' &&
    activeOrder.status !== 'COMPLETED';

  const { routes, loading: routesLoading } = useOsrmRoutes(
    safeBuyer,
    safeSeller,
    safeTransport,
    isLiveTracking && activeOrder?.transporter !== null && buyerLocationReady
  );

  // Distances
  const buyerSellerDist = buyerLocationReady
    ? haversineDistance(safeBuyer.lat, safeBuyer.lng, safeSeller.lat, safeSeller.lng)
    : 0;

  /* ─── Map Init ─── */
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629], // India center, will zoom to buyer when ready
      zoom: 5,
      zoomControl: true,
      attributionControl: false,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);
    L.control
      .attribution({ position: 'bottomright', prefix: '© OpenStreetMap' })
      .addTo(map);
    mapInstanceRef.current = map;
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  /* ─── Auto-zoom to buyer when location is ready ─── */
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !buyerLocationReady || !buyerLocation || hasZoomedRef.current) return;
    hasZoomedRef.current = true;
    map.setView([buyerLocation.lat, buyerLocation.lng], 13, { animate: true });

    // Add buyer marker immediately
    if (!markersRef.current.buyer) {
      markersRef.current.buyer = L.marker([buyerLocation.lat, buyerLocation.lng], { icon: BUYER_ICON })
        .addTo(map)
        .bindPopup(
          `<div style="padding:4px"><strong>${buyerLocation.name}</strong><br/>Buyer<br/><small>${buyerLocation.lat.toFixed(4)}, ${buyerLocation.lng.toFixed(4)}</small></div>`
        );
    }
  }, [buyerLocationReady, buyerLocation]);

  /* ─── Marker Updates ─── */
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeOrder || !buyerLocationReady) return;

    const updateMarker = (
      key: 'buyer' | 'seller' | 'transport',
      loc: EntityLocation,
      icon: L.DivIcon
    ) => {
      if (markersRef.current[key]) {
        markersRef.current[key]!.setLatLng([loc.lat, loc.lng]);
      } else {
        markersRef.current[key] = L.marker([loc.lat, loc.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="padding:4px"><strong>${loc.name}</strong><br/><span style="text-transform:capitalize">${loc.role}</span><br/><small>${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}</small></div>`
          );
      }
    };

    updateMarker('buyer', safeBuyer, BUYER_ICON);
    updateMarker('seller', safeSeller, SELLER_ICON);

    if (activeOrder.transporter) {
      updateMarker('transport', safeTransport, TRANSPORT_ICON);
    }
  }, [safeBuyer, safeSeller, safeTransport, activeOrder, buyerLocationReady]);

  /* ─── Route Updates ─── */
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    routeLayersRef.current.forEach((l) => l.remove());
    routeLayersRef.current = [];

    if (!isLiveTracking || !activeOrder?.transporter) return;

    const drawRoute = (
      coords: [number, number][] | undefined,
      color: string,
      dash?: string
    ) => {
      if (!coords?.length) return;
      const polyline = L.polyline(coords, {
        color,
        weight: 4,
        opacity: 0.8,
        dashArray: dash,
      }).addTo(map);
      routeLayersRef.current.push(polyline);
    };

    drawRoute(routes.buyerToSeller?.coordinates, ROUTE_COLORS.buyerToSeller, '10, 6');
    drawRoute(routes.sellerToTransport?.coordinates, ROUTE_COLORS.sellerToTransport, '8, 8');
    drawRoute(routes.buyerToTransport?.coordinates, ROUTE_COLORS.buyerToTransport);

    const allCoords: [number, number][] = [
      [safeBuyer.lat, safeBuyer.lng],
      [safeSeller.lat, safeSeller.lng],
      [safeTransport.lat, safeTransport.lng],
    ];
    map.fitBounds(allCoords, { padding: [60, 60] });
  }, [routes, isLiveTracking, activeOrder]);

  /* ─── Order Actions ─── */
  const handlePlaceOrder = useCallback(() => {
    if (!buyerLocationReady || !buyerLocation || !sellerLocation || !transportLocation) return;

    const buyer: OrderEntity = {
      id: user?.id || safeBuyer.id,
      role: 'buyer',
      name: user?.name || safeBuyer.name,
      lat: safeBuyer.lat,
      lng: safeBuyer.lng,
      onlineStatus: true,
      lastUpdated: Date.now(),
    };
    const seller: OrderEntity = {
      id: safeSeller.id,
      role: 'seller',
      name: safeSeller.name,
      lat: safeSeller.lat,
      lng: safeSeller.lng,
      onlineStatus: true,
      lastUpdated: Date.now(),
    };
    const items = [
      { name: 'Organic Tomatoes', quantity: 20, pricePerKg: 45 },
      { name: 'Green Chilies', quantity: 5, pricePerKg: 80 },
    ];

    const order = createOrder(buyer, seller, items);
    if (!order) return;

    startTracking();
    addNotification({
      type: 'order',
      title: 'Order Placed',
      message: `Order ${order.id} placed with ${seller.name}`,
    });

    // Demo: auto-assign transporter after 2s
    setTimeout(() => {
      const transporter: OrderEntity = {
        id: safeTransport.id,
        role: 'transport',
        name: safeTransport.name,
        lat: safeTransport.lat,
        lng: safeTransport.lng,
        onlineStatus: true,
        lastUpdated: Date.now(),
      };
      assignTransporter(transporter);
      addSystemMessage(`Order accepted by ${transporter.name}`);
      addSystemMessage('Live tracking started');
      addNotification({
        type: 'delivery',
        title: 'Transport Assigned',
        message: `${transporter.name} accepted your delivery`,
      });

      // Auto-transition to PICKED_UP after 3s
      setTimeout(() => {
        transitionOrder('PICKED_UP');
        addSystemMessage('Order picked up from seller');
      }, 3000);
    }, 2000);
  }, [user, buyerLocationReady, buyerLocation, sellerLocation, transportLocation, safeBuyer, safeSeller, safeTransport, createOrder, startTracking, assignTransporter, addSystemMessage, addNotification, transitionOrder]);

  const handleAdvanceStatus = useCallback(() => {
    if (!activeOrder) return;
    const { status } = activeOrder;
    if (status === 'PICKED_UP') {
      transitionOrder('IN_TRANSIT');
      addSystemMessage('Order is now in transit');
    } else if (status === 'IN_TRANSIT') {
      transitionOrder('DELIVERED');
      addSystemMessage('Order delivered successfully!');
      addNotification({
        type: 'delivery',
        title: 'Order Delivered',
        message: 'Your order has been delivered',
      });
    } else if (status === 'DELIVERED') {
      transitionOrder('COMPLETED');
      addSystemMessage('Order completed. Chat will close.');
      stopTracking();
    }
  }, [activeOrder, transitionOrder, addSystemMessage, addNotification, stopTracking]);

  const handleStop = useCallback(() => {
    cancelOrder();
    stopTracking();
    clearChat();
    Object.values(markersRef.current).forEach((m) => m?.remove());
    markersRef.current = { buyer: null, seller: null, transport: null };
    routeLayersRef.current.forEach((l) => l.remove());
    routeLayersRef.current = [];
    setTimeout(() => clearOrder(), 300);
  }, [cancelOrder, stopTracking, clearChat, clearOrder]);

  const error = trackingError || orderError;

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold">
              Order & Tracking
            </h1>
            <p className="text-muted-foreground text-sm">
              Place orders, track deliveries, and chat — all in one place
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!buyerLocationReady ? (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Locating…
              </span>
            ) : isTracking ? (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                <Signal className="w-3.5 h-3.5" />
                Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                <SignalZero className="w-3.5 h-3.5" />
                Ready
              </span>
            )}
          </div>
        </div>

        {/* Status Bar */}
        {activeOrder && (
          <div className="card-elevated p-3">
            <OrderStatusBar currentStatus={activeOrder.status} />
          </div>
        )}

        {/* Map + Chat split */}
        <div className="flex gap-4 relative">
          {/* Map */}
          <div className="flex-1 relative rounded-2xl overflow-hidden border border-border">
            <div
              ref={mapRef}
              className="w-full h-[calc(100vh-380px)] lg:h-[calc(100vh-300px)] min-h-[300px]"
            />

            {/* Legend */}
            {activeOrder && (
              <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-xl border border-border p-3 space-y-2 z-[1000]">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Entities
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span>Buyer ({buyerSellerDist} km)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Seller</span>
                </div>
                {activeOrder.transporter && (
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>Transport</span>
                  </div>
                )}
                {isLiveTracking && (
                  <>
                    <div className="border-t border-border pt-2 mt-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Routes
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-5 h-0.5" style={{ background: ROUTE_COLORS.buyerToSeller }} />
                      <span>Buyer → Seller</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-5 h-0.5" style={{ background: ROUTE_COLORS.sellerToTransport }} />
                      <span>Seller → Transport</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-5 h-0.5" style={{ background: ROUTE_COLORS.buyerToTransport }} />
                      <span>Buyer → Transport</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {routesLoading && (
              <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm rounded-lg border border-border px-3 py-2 flex items-center gap-2 text-xs z-[1000]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Calculating routes…
              </div>
            )}

            {/* Chat toggle FAB */}
            {activeOrder?.chatId && (
              <button
                onClick={() => setIsChatOpen((v) => !v)}
                className="absolute bottom-3 right-3 z-[1000] w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isChatOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
              </button>
            )}
          </div>

          {/* Chat Panel (desktop) */}
          <AnimatePresence>
            {isChatOpen && activeOrder?.chatId && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 340, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="hidden lg:flex flex-col card-elevated overflow-hidden flex-shrink-0"
                style={{ height: 'calc(100vh - 300px)', minHeight: 300 }}
              >
                <OrderChat
                  messages={messages}
                  currentUserId={user?.id || 'buyer-demo-001'}
                  currentUserName={user?.name || 'Rajesh Kumar'}
                  currentUserRole={(user?.role as 'buyer' | 'seller' | 'transporter') || 'buyer'}
                  onSend={sendMessage}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Chat Drawer */}
        <AnimatePresence>
          {isChatOpen && activeOrder?.chatId && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-card border-t border-border rounded-t-2xl"
              style={{ height: '60vh' }}
            >
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
              </div>
              <OrderChat
                messages={messages}
                currentUserId={user?.id || 'buyer-demo-001'}
                currentUserName={user?.name || 'Rajesh Kumar'}
                currentUserRole={(user?.role as 'buyer' | 'seller' | 'transporter') || 'buyer'}
                onSend={sendMessage}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Action Card */}
          <div className="card-elevated p-5 flex flex-col gap-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary" />
              Order Control
            </h3>
            {!activeOrder ? (
              <Button
                variant="forest"
                onClick={handlePlaceOrder}
                className="w-full"
                disabled={!buyerLocationReady}
              >
                {!buyerLocationReady ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Waiting for GPS…
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4 mr-2" />
                    Place Demo Order
                  </>
                )}
              </Button>
            ) : activeOrder.status === 'COMPLETED' || activeOrder.status === 'CANCELLED' ? (
              <Button variant="outline" onClick={handleStop} className="w-full">
                Clear & Start New
              </Button>
            ) : (
              <div className="space-y-2">
                {(activeOrder.status === 'PICKED_UP' ||
                  activeOrder.status === 'IN_TRANSIT' ||
                  activeOrder.status === 'DELIVERED') && (
                  <Button variant="forest" onClick={handleAdvanceStatus} className="w-full">
                    {activeOrder.status === 'PICKED_UP' && 'Mark In Transit'}
                    {activeOrder.status === 'IN_TRANSIT' && 'Mark Delivered'}
                    {activeOrder.status === 'DELIVERED' && 'Complete Order'}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleStop}
                  className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  Cancel Order
                </Button>
              </div>
            )}
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          {/* Route Info */}
          {isLiveTracking && routes.buyerToSeller && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-elevated p-5 space-y-3"
            >
              <h3 className="font-semibold flex items-center gap-2 text-sm">
                <Route className="w-4 h-4" style={{ color: ROUTE_COLORS.buyerToSeller }} />
                Buyer → Seller
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Distance</span>
                <span className="font-medium">{routes.buyerToSeller.distance} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ETA</span>
                <span className="font-medium">{routes.buyerToSeller.duration} min</span>
              </div>
            </motion.div>
          )}

          {isLiveTracking && routes.sellerToTransport && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-elevated p-5 space-y-3"
            >
              <h3 className="font-semibold flex items-center gap-2 text-sm">
                <Route className="w-4 h-4" style={{ color: ROUTE_COLORS.sellerToTransport }} />
                Seller → Transport
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Distance</span>
                <span className="font-medium">{routes.sellerToTransport.distance} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ETA</span>
                <span className="font-medium">{routes.sellerToTransport.duration} min</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Entity Cards */}
        {activeOrder && buyerLocationReady && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <EntityCard
              icon={<ShoppingCart className="w-5 h-5" />}
              color="bg-red-100 text-red-600"
              label="Buyer"
              name={safeBuyer.name}
              lat={safeBuyer.lat}
              lng={safeBuyer.lng}
              live={isTracking}
            />
            <EntityCard
              icon={<Store className="w-5 h-5" />}
              color="bg-blue-100 text-blue-600"
              label="Seller"
              name={safeSeller.name}
              lat={safeSeller.lat}
              lng={safeSeller.lng}
              live={false}
              badge="Near you (Demo)"
            />
            {activeOrder.transporter && (
              <EntityCard
                icon={<Truck className="w-5 h-5" />}
                color="bg-emerald-100 text-emerald-600"
                label="Transport"
                name={safeTransport.name}
                lat={safeTransport.lat}
                lng={safeTransport.lng}
                live={isLiveTracking}
                badge={!isLiveTracking ? 'Assigned' : undefined}
              />
            )}
          </div>
        )}

        {/* Order summary */}
        {activeOrder && (
          <div className="card-elevated p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Order {activeOrder.id}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Items</p>
                <p className="font-medium">{activeOrder.items.map((i) => i.name).join(', ')}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Total</p>
                <p className="font-medium">₹{activeOrder.totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Delivery Fee</p>
                <p className="font-medium">₹{activeOrder.deliveryFee}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Distance</p>
                <p className="font-medium">{buyerSellerDist} km</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

/* ─── Entity Card ─── */
function EntityCard({
  icon,
  color,
  label,
  name,
  lat,
  lng,
  live,
  badge,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  name: string;
  lat: number;
  lng: number;
  live: boolean;
  badge?: string;
}) {
  return (
    <div className="card-elevated p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', color)}>
            {icon}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-semibold text-sm">{name}</p>
          </div>
        </div>
        {live ? (
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        ) : badge ? (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="w-3 h-3" />
        <span>{lat.toFixed(4)}, {lng.toFixed(4)}</span>
      </div>
    </div>
  );
}
