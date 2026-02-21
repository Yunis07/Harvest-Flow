import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppState } from '@/contexts/AppStateContext';
import { CATEGORY_CONFIG } from '@/data/mockData';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Heart, X, Leaf, Recycle, TrendingDown, ShoppingCart, Phone, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function UglyProducePage() {
  const { t } = useLanguage();
  const { products, addToCart, contacts } = useAppState();

  const uglyProducts = products.filter(p => p.isUgly);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [exitDirection, setExitDirection] = React.useState<'left' | 'right' | null>(null);
  const [likedProducts, setLikedProducts] = React.useState<Product[]>([]);

  const currentProduct = uglyProducts[currentIndex];
  const hasMore = currentIndex < uglyProducts.length;

  // Get seller contacts for liked products
  const recentSellerContacts = React.useMemo(() => {
    const sellerIds = [...new Set(likedProducts.map(p => p.sellerId))];
    return contacts.filter(c => c.role === 'seller' && c.isPublic && sellerIds.some(sid => c.userId === sid));
  }, [likedProducts, contacts]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentProduct) return;
    setExitDirection(direction);
    if (direction === 'right') {
      setLikedProducts(prev => [...prev, currentProduct]);
      addToCart(currentProduct, 1);
      toast.success(`${currentProduct.name} ${t('addedToCart')}`);
    }
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setExitDirection(null);
    }, 300);
  };

  const handleAddAllToCart = () => {
    likedProducts.forEach(p => addToCart(p, 1));
    toast.success(`${likedProducts.length} ${t('itemsAddedToCart')}`);
  };

  const stats = [
    { value: '30%', label: t('ofProduceWasted'), icon: Recycle },
    { value: '40%', label: t('priceSavings'), icon: TrendingDown },
    { value: '100%', label: t('equallyNutritious'), icon: Leaf },
  ];

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-display font-bold mb-2">{t('trendingHarvestTitle')}</h1>
          <p className="text-muted-foreground">{t('trendingHarvestDesc')}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center p-4 bg-muted rounded-2xl">
                <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="relative h-[450px] mb-6">
          <AnimatePresence mode="wait">
            {hasMore && currentProduct ? (
              <SwipeCard key={currentProduct.id} product={currentProduct} onSwipe={handleSwipe} exitDirection={exitDirection} t={t} />
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-muted rounded-3xl">
                <Heart className="w-16 h-16 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('youreAHero')}</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {likedProducts.length} {t('youLikedItems')}
                </p>
                {likedProducts.length > 0 && (
                  <Button variant="forest" onClick={handleAddAllToCart}>
                    <ShoppingCart className="w-4 h-4" />
                    {t('addItemsToCart')}
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {hasMore && (
          <div className="flex items-center justify-center gap-6">
            <button onClick={() => handleSwipe('left')}
              className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors">
              <X className="w-8 h-8 text-red-500" />
            </button>
            <button onClick={() => handleSwipe('right')}
              className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center hover:bg-emerald-200 transition-colors">
              <Heart className="w-10 h-10 text-emerald-500" />
            </button>
          </div>
        )}

        {/* Liked Products Strip */}
        {likedProducts.length > 0 && hasMore && (
          <div className="mt-8 p-4 bg-muted rounded-2xl">
            <p className="text-sm font-medium mb-3">{t('addedToCart')} ({likedProducts.length})</p>
            <div className="flex gap-2 overflow-x-auto scrollbar-thin">
              {likedProducts.map(product => (
                <div key={product.id} className="w-16 h-16 bg-background rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">{CATEGORY_CONFIG[product.category]?.emoji || '📦'}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Seller Contacts */}
        {recentSellerContacts.length > 0 && (
          <div className="mt-6 p-4 bg-muted rounded-2xl">
            <p className="text-sm font-medium mb-3">🌾 {t('sellerContacts')}</p>
            <div className="space-y-2">
              {recentSellerContacts.map(contact => (
                <div key={contact.id} className="flex items-center justify-between bg-background rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{contact.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => window.open(`tel:${contact.phone.replace(/\s/g, '')}`, '_self')}
                      className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                    {contact.whatsapp && (
                      <button onClick={() => window.open(`https://wa.me/${contact.whatsapp!.replace(/[\s+]/g, '')}`, '_blank')}
                        className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function SwipeCard({ product, onSwipe, exitDirection, t }: { product: Product; onSwipe: (d: 'left' | 'right') => void; exitDirection: 'left' | 'right' | null; t: (k: string) => string }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-20, 0, 20]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const categoryConfig = CATEGORY_CONFIG[product.category];

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) onSwipe('right');
    else if (info.offset.x < -100) onSwipe('left');
  };

  return (
    <motion.div style={{ x, rotate }} drag="x" dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, x: exitDirection === 'left' ? -400 : exitDirection === 'right' ? 400 : 0 }}
      exit={{ x: exitDirection === 'left' ? -400 : 400, opacity: 0, transition: { duration: 0.3 } }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing">
      <div className="h-full bg-card rounded-3xl border border-border shadow-xl overflow-hidden">
        <div className="relative h-[60%] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-8xl">{categoryConfig?.emoji || '📦'}</span>
          )}
          <motion.div style={{ opacity: likeOpacity }}
            className="absolute top-8 left-8 px-6 py-2 border-4 border-emerald-500 text-emerald-500 font-bold text-2xl rounded-xl rotate-[-20deg]">
            {t('addedToCart').toUpperCase()}
          </motion.div>
          <motion.div style={{ opacity: nopeOpacity }}
            className="absolute top-8 right-8 px-6 py-2 border-4 border-red-500 text-red-500 font-bold text-2xl rounded-xl rotate-[20deg]">
            NOPE
          </motion.div>
          <div className="absolute bottom-4 left-4 px-4 py-2 bg-amber-500 text-white font-semibold rounded-full text-sm">
            {t('priceSavings')} 🌍
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-muted-foreground">{product.sellerName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground line-through">₹{Math.round(product.pricePerKg * 1.67)}</p>
              <p className="text-2xl font-bold text-primary">₹{product.pricePerKg}/kg</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Leaf className="w-4 h-4 text-emerald-500" />
              <span>{product.isOrganic ? t('organic') : 'Farm Fresh'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Recycle className="w-4 h-4 text-blue-500" />
              <span>{product.availableQuantity}kg</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
