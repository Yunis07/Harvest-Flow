import React, { useState, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppState } from '@/contexts/AppStateContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CATEGORY_CONFIG } from '@/data/mockData';
import { Product, ProductCategory } from '@/types';
import { cn } from '@/lib/utils';
import { Package, Plus, Pencil, Trash2, X, Search, ImagePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'grains', label: 'Grains' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'pulses', label: 'Pulses' },
  { value: 'spices', label: 'Spices' },
  { value: 'other', label: 'Other' },
];

interface ProductForm {
  name: string;
  category: ProductCategory;
  pricePerKg: number;
  availableQuantity: number;
  freshnessDays: number;
  isOrganic: boolean;
  isUgly: boolean;
  imageUrl: string;
}

const EMPTY_FORM: ProductForm = {
  name: '', category: 'vegetables', pricePerKg: 0, availableQuantity: 0,
  freshnessDays: 7, isOrganic: false, isUgly: false, imageUrl: '',
};

export function SellerInventoryPage() {
  const { t } = useLanguage();
  const { products, addProduct, updateProduct, removeProduct } = useAppState();

  const sellerProducts = products.filter(p => p.sellerId === 'seller-demo-001');
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = sellerProducts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setIsFormOpen(true); };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name, category: p.category, pricePerKg: p.pricePerKg,
      availableQuantity: p.availableQuantity, freshnessDays: p.freshnessDays,
      isOrganic: p.isOrganic, isUgly: p.isUgly ?? false, imageUrl: p.imageUrl || '',
    });
    setEditingId(p.id);
    setIsFormOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(f => ({ ...f, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name.trim() || form.pricePerKg <= 0) return;
    if (editingId) {
      updateProduct(editingId, { ...form, isUgly: form.isUgly, imageUrl: form.imageUrl || undefined });
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...form,
        imageUrl: form.imageUrl || undefined,
        unit: 'kg',
        sellerId: 'seller-demo-001',
        sellerName: 'Priya Sharma',
        sellerRating: 4.8,
        location: { lat: 28.5355, lng: 77.391, address: 'Noida, UP' },
        createdAt: new Date(),
      };
      addProduct(newProduct);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => removeProduct(id);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold">{t('manageInventory')}</h1>
            <p className="text-muted-foreground text-sm">{t('addEditRemove')}</p>
          </div>
          <Button variant="forest" onClick={openAdd}>
            <Plus className="w-4 h-4 mr-2" />
            {t('addProduct')}
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder={t('searchProducts')} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => {
            const cat = CATEGORY_CONFIG[product.category];
            return (
              <motion.div key={product.id} layout className="card-elevated p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        cat?.emoji || '📦'
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{cat?.label} • {product.availableQuantity} {product.unit}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(product)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">₹{product.pricePerKg}/{product.unit}</span>
                  <div className="flex gap-2">
                    {product.isOrganic && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">{t('organic')}</span>
                    )}
                    {product.isUgly && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">{t('uglyProduceToggle')}</span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{t('freshnessDays')}: {product.freshnessDays}</div>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>{t('noProductsFound')}</p>
            </div>
          )}
        </div>

        {/* Add/Edit Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsFormOpen(false)} className="fixed inset-0 bg-black/50 z-40" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-x-4 top-[10%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg bg-card rounded-2xl border border-border p-6 z-50 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold">{editingId ? t('editProduct') : t('addProduct')}</h2>
                  <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-muted rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Image Upload */}
                  <div>
                    <Label>Product Image</Label>
                    <div className="mt-1 flex items-center gap-4">
                      <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-border cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}>
                        {form.imageUrl ? (
                          <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImagePlus className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      <div className="text-sm text-muted-foreground">
                        <p>Click to upload</p>
                        <p className="text-xs">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>{t('productName')}</Label>
                    <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Organic Tomatoes" />
                  </div>

                  <div>
                    <Label>{t('category')}</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {CATEGORIES.map(c => (
                        <button key={c.value} onClick={() => setForm(f => ({ ...f, category: c.value }))}
                          className={cn("px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                            form.category === c.value ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80')}>
                          {CATEGORY_CONFIG[c.value]?.emoji} {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>{t('pricePerKg')}</Label>
                      <Input type="number" min={1} value={form.pricePerKg || ''}
                        onChange={(e) => setForm(f => ({ ...f, pricePerKg: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <Label>{t('availableKg')}</Label>
                      <Input type="number" min={1} value={form.availableQuantity || ''}
                        onChange={(e) => setForm(f => ({ ...f, availableQuantity: Number(e.target.value) }))} />
                    </div>
                  </div>

                  <div>
                    <Label>{t('freshnessDays')}</Label>
                    <Input type="number" min={1} value={form.freshnessDays || ''}
                      onChange={(e) => setForm(f => ({ ...f, freshnessDays: Number(e.target.value) }))} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>{t('organic')}</Label>
                    <Switch checked={form.isOrganic} onCheckedChange={(v) => setForm(f => ({ ...f, isOrganic: v }))} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>{t('uglyProduceToggle')}</Label>
                    <Switch checked={form.isUgly} onCheckedChange={(v) => setForm(f => ({ ...f, isUgly: v }))} />
                  </div>

                  <Button variant="forest" className="w-full" onClick={handleSave}>
                    {editingId ? t('saveChanges') : t('addProduct')}
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
