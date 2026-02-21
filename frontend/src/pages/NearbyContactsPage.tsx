import React, { useState, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAppState, UserContact } from '@/contexts/AppStateContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  Phone, MessageCircle, Star, StarOff, Plus, X, Search, Users, Clock,
  UserPlus, Eye, EyeOff, History,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function NearbyContactsPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { contacts, addContact, updateContact, removeContact, favorites, toggleFavorite, dealHistory } = useAppState();
  const currentRole = user?.role || 'buyer';

  // Buyers see sellers, sellers see buyers
  const visibleRole = currentRole === 'buyer' ? 'seller' : 'buyer';
  const visibleContacts = contacts.filter(c => c.role === visibleRole && c.isPublic);

  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'contacts' | 'favorites' | 'history' | 'my'>('contacts');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', whatsapp: '', address: '', isPublic: true });

  const filtered = visibleContacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase())
  );

  const favoriteContacts = visibleContacts.filter(c => favorites.includes(c.id));
  const myContacts = contacts.filter(c => c.role === currentRole);

  const handleCall = (phone: string) => {
    window.open(`tel:${phone.replace(/\s/g, '')}`, '_self');
  };

  const handleWhatsApp = (whatsapp: string) => {
    const num = whatsapp.replace(/[\s+]/g, '');
    window.open(`https://wa.me/${num}`, '_blank');
  };

  const handleAddContact = () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    const newContact: UserContact = {
      id: `contact-${Date.now()}`,
      userId: user?.id || 'unknown',
      name: form.name.trim(),
      role: currentRole as 'buyer' | 'seller',
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim() || undefined,
      address: form.address.trim(),
      isPublic: form.isPublic,
      createdAt: new Date(),
    };
    addContact(newContact);
    setIsFormOpen(false);
    setForm({ name: '', phone: '', whatsapp: '', address: '', isPublic: true });
    toast.success(t('contactAdded'));
  };

  const pageTitle = currentRole === 'buyer' ? t('nearbySellers') : t('nearbyBuyers');
  const pageDesc = currentRole === 'buyer' ? t('nearbySellersDesc') : t('nearbyBuyersDesc');

  const tabs = [
    { key: 'contacts' as const, label: t('allContacts'), icon: Users },
    { key: 'favorites' as const, label: t('favoritesLabel'), icon: Star },
    { key: 'history' as const, label: t('dealHistoryLabel'), icon: History },
    { key: 'my' as const, label: t('myContact'), icon: Eye },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold">{pageTitle}</h1>
            <p className="text-muted-foreground text-sm">{pageDesc}</p>
          </div>
          <Button variant="forest" onClick={() => setIsFormOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            {t('addMyContact')}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {tabs.map(tb => {
            const Icon = tb.icon;
            return (
              <button key={tb.key} onClick={() => setTab(tb.key)}
                className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  tab === tb.key ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80")}>
                <Icon className="w-4 h-4" />
                <span className="truncate">{tb.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        {tab === 'contacts' && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder={t('searchContacts')} value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
        )}

        {/* Contact Cards */}
        {tab === 'contacts' && (
          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>{t('noContactsFound')}</p>
              </div>
            )}
            {filtered.map(contact => (
              <ContactCard key={contact.id} contact={contact} isFavorite={favorites.includes(contact.id)}
                onToggleFavorite={() => toggleFavorite(contact.id)} onCall={handleCall} onWhatsApp={handleWhatsApp} t={t} />
            ))}
          </div>
        )}

        {tab === 'favorites' && (
          <div className="space-y-3">
            {favoriteContacts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>{t('noFavorites')}</p>
              </div>
            )}
            {favoriteContacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} isFavorite onToggleFavorite={() => toggleFavorite(contact.id)}
                onCall={handleCall} onWhatsApp={handleWhatsApp} t={t} />
            ))}
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-3">
            {dealHistory.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>{t('noDealHistory')}</p>
              </div>
            )}
            {dealHistory.map(deal => (
              <div key={deal.id} className="card-elevated p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{deal.contactName}</p>
                  <p className="text-xs text-muted-foreground">{deal.contactRole === 'seller' ? '🌾' : '🛒'} {t('order')}: {deal.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{deal.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{deal.date.toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'my' && (
          <div className="space-y-3">
            {myContacts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>{t('noMyContact')}</p>
              </div>
            )}
            {myContacts.map(contact => (
              <div key={contact.id} className="card-elevated p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">{contact.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateContact(contact.id, { isPublic: !contact.isPublic })}
                      className={cn("p-2 rounded-lg transition-colors", contact.isPublic ? "text-emerald-500 hover:bg-emerald-50" : "text-muted-foreground hover:bg-muted")}>
                      {contact.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => removeContact(contact.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                    contact.isPublic ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground")}>
                    {contact.isPublic ? t('publicContact') : t('privateContact')}
                  </span>
                  <span className="text-xs text-muted-foreground">{contact.address}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Contact Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsFormOpen(false)} className="fixed inset-0 bg-black/50 z-40" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-x-4 top-[15%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md bg-card rounded-2xl border border-border p-6 z-50">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold">{t('addMyContact')}</h2>
                  <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>{t('fullName')}</Label>
                    <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t('enterYourName')} />
                  </div>
                  <div>
                    <Label>{t('phoneNumber')}</Label>
                    <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <Label>WhatsApp ({t('optional')})</Label>
                    <Input value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="+919876543210" />
                  </div>
                  <div>
                    <Label>{t('addressLabel')}</Label>
                    <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="City, State" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>{t('makePublic')}</Label>
                    <Switch checked={form.isPublic} onCheckedChange={v => setForm(f => ({ ...f, isPublic: v }))} />
                  </div>
                  <Button variant="forest" className="w-full" onClick={handleAddContact}>{t('addMyContact')}</Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}

function ContactCard({ contact, isFavorite, onToggleFavorite, onCall, onWhatsApp, t }: {
  contact: UserContact; isFavorite: boolean;
  onToggleFavorite: () => void; onCall: (p: string) => void; onWhatsApp: (w: string) => void; t: (k: string) => string;
}) {
  return (
    <motion.div layout className="card-elevated p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-semibold text-primary">{contact.name.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold truncate">{contact.name}</p>
            <span className="text-xs px-2 py-0.5 bg-muted rounded-full font-medium capitalize flex-shrink-0">
              {contact.role === 'seller' ? '🌾 ' : '🛒 '}{t(contact.role)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{contact.address}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onToggleFavorite}
            className={cn("p-2 rounded-lg transition-colors", isFavorite ? "text-amber-500" : "text-muted-foreground hover:text-amber-500")}>
            {isFavorite ? <Star className="w-5 h-5 fill-current" /> : <StarOff className="w-5 h-5" />}
          </button>
          <button onClick={() => onCall(contact.phone)}
            className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          {contact.whatsapp && (
            <button onClick={() => onWhatsApp(contact.whatsapp!)}
              className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
