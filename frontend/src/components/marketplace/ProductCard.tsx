import React from 'react';
import { Product, ProductCategory } from '@/types';
import { CATEGORY_CONFIG } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Star, MapPin, Clock, Leaf, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
  className?: string;
}

export function ProductCard({ product, onAddToCart, className }: ProductCardProps) {
  const [quantity, setQuantity] = React.useState(1);
  const categoryConfig = CATEGORY_CONFIG[product.category];

  const handleQuantityChange = (delta: number) => {
    const newQty = Math.max(1, Math.min(quantity + delta, product.availableQuantity));
    setQuantity(newQty);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      {/* Product Image */}
      <div className="relative h-40 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl">{categoryConfig?.emoji || '📦'}</span>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {product.isOrganic && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
              <Leaf className="w-3 h-3" />
              Organic
            </span>
          )}
          {product.isUgly && (
            <span className="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
              Save Food
            </span>
          )}
        </div>
        
        {/* Freshness */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            {product.freshnessDays}d fresh
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{categoryConfig?.label}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-lg text-primary">₹{product.pricePerKg}</p>
            <p className="text-xs text-muted-foreground">per kg</p>
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between py-2 border-t border-b border-border my-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">
                {product.sellerName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{product.sellerName}</p>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {product.location.address}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber fill-amber" />
            <span className="text-sm font-semibold">{product.sellerRating}</span>
          </div>
        </div>

        {/* Stock */}
        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-muted-foreground">Available</span>
          <span className="font-medium">{product.availableQuantity} kg</span>
        </div>

        {/* Quantity & Add to Cart */}
        {onAddToCart && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity} kg</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-background transition-colors"
                disabled={quantity >= product.availableQuantity}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <Button 
              onClick={() => onAddToCart(product, quantity)}
              className="flex-1"
              size="sm"
            >
              Add ₹{(product.pricePerKg * quantity).toLocaleString()}
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
