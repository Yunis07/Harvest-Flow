import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppState } from '@/contexts/AppStateContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { MapComponent, MapMarker } from '@/components/shared/MapComponent';
import { CATEGORY_CONFIG } from '@/data/mockData';
import { Product } from '@/types';
import { haversineDistance } from '@/lib/geo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, Grid3X3, Map, ShoppingCart, X, Minus, Plus, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type ViewMode = 'grid' | 'map';

export function MarketplacePage() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const { t } = useLanguage();
  const { products, cart, addToCart, updateCartQuantity, removeFromCart, clearCart, placeOrder } = useAppState();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const buyerLat = user?.location?.lat ?? 28.6139;
  const buyerLng = user?.location?.lng ?? 77.2090;

  // Only show non-ugly products in marketplace (ugly ones go to On-Demand Picks)
  const marketplaceProducts = products.filter(p => !p.isUgly);

  const filteredProducts = marketplaceProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const dist = haversineDistance(buyerLat, buyerLng, product.location.lat, product.location.lng);
    return matchesSearch && matchesCategory && dist <= 50;
  }).sort((a, b) => {
    const distA = haversineDistance(buyerLat, buyerLng, a.location.lat, a.location.lng);
    const distB = haversineDistance(buyerLat, buyerLng, b.location.lat, b.location.lng);
    return distA - distB;
  });

  const mapMarkers: MapMarker[] = filteredProducts.map((product) => ({
    id: product.id,
    position: [product.location.lat, product.location.lng],
    type: 'seller',
    title: product.name,
    description: `₹${product.pricePerKg}/kg • ${product.sellerName}`,
    data: product,
  }));

  const cartTotal = cart.reduce((sum, item) => sum + item.product.pricePerKg * item.quantity, 0);
  const avgCartDistance = cart.length > 0
    ? cart.reduce((sum, item) => sum + haversineDistance(buyerLat, buyerLng, item.product.location.lat, item.product.location.lng), 0) / cart.length
    : 0;
  const deliveryFee = cart.length > 0 ? Math.max(30, Math.round(avgCartDistance * 10)) : 0;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    addNotification({ type: 'order', title: 'Added to Cart', message: `${quantity}kg of ${product.name} added` });
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const sellerId = cart[0].product.sellerId;
    const sellerName = cart[0].product.sellerName;
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;

    placeOrder({
      id: orderId,
      buyerId: user?.id || 'buyer-demo-001',
      buyerName: user?.name || 'Rajesh Kumar',
      sellerId,
      sellerName,
      items: cart.map(item => ({
        productName: item.product.name,
        quantity: item.quantity,
        pricePerKg: item.product.pricePerKg,
      })),
      totalAmount: cartTotal,
      deliveryFee,
      status: 'PENDING',
      pickupAddress: cart[0].product.location.address,
      deliveryAddress: 'Buyer Location',
      createdAt: new Date(),
    });

    clearCart();
    setIsCartOpen(false);
    toast.success('Order placed successfully! Waiting for transporter.');
    addNotification({ type: 'order', title: 'Order Placed', message: `Order ${orderId} placed with ${sellerName}` });
  };

  return (
    <AppLayout>
      <div className="relative">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">{t('marketplace')}</h1>
          <p className="text-muted-foreground">{t('browseFreshProduce')}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input placeholder={t('searchProductsSellers')} value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
            <button onClick={() => setSelectedCategory(null)}
              className={cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                !selectedCategory ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80")}>
              {t('all')}
            </button>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <button key={key} onClick={() => setSelectedCategory(key)}
                className={cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
                  selectedCategory === key ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80")}>
                <span>{config.emoji}</span>
                <span>{config.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded-md transition-colors", viewMode === 'grid' ? "bg-card shadow-sm" : "hover:bg-card/50")}>
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode('map')}
              className={cn("p-2 rounded-md transition-colors", viewMode === 'map' ? "bg-card shadow-sm" : "hover:bg-card/50")}>
              <Map className="w-5 h-5" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>No products found</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-[calc(100vh-280px)] lg:h-[calc(100vh-200px)] rounded-2xl overflow-hidden border border-border">
              <MapComponent markers={mapMarkers} showCurrentLocation
                onMarkerClick={(marker) => console.log('Marker clicked:', marker)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Cart Button */}
        {cart.length > 0 && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 z-30 flex items-center gap-3 px-6 py-4 bg-gradient-forest text-white rounded-2xl shadow-xl">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-semibold">₹{cartTotal.toLocaleString()}</span>
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-sm">{cartItemCount} {t('items')}</span>
          </motion.button>
        )}

        {/* Cart Drawer */}
        <AnimatePresence>
          {isCartOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/50 z-40" />
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-card z-50 flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="text-lg font-semibold">{t('yourCart')}</h2>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4 p-3 bg-muted rounded-xl">
                      <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center">
                        {item.product.imageUrl ? (
                          <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="text-2xl">{CATEGORY_CONFIG[item.product.category]?.emoji || '📦'}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">₹{item.product.pricePerKg}/kg</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCartQuantity(item.product.id, -1)}
                          className="w-8 h-8 flex items-center justify-center bg-background rounded-lg hover:bg-card transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.product.id, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-background rounded-lg hover:bg-card transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('subtotal')}</span>
                    <span className="font-semibold">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('deliveryFee')}</span>
                    <span className="font-semibold">₹{deliveryFee}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-semibold">{t('total')}</span>
                    <span className="font-bold text-primary">₹{(cartTotal + deliveryFee).toLocaleString()}</span>
                  </div>
                  <Button variant="forest" size="lg" className="w-full" onClick={handlePlaceOrder}>
                    {t('proceedToCheckout')}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
