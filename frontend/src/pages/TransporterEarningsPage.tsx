import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { DollarSign, TrendingUp, Truck, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const EARNINGS_DATA = [
  { date: 'Today', trips: 3, distance: 42, amount: 620 },
  { date: 'Yesterday', trips: 5, distance: 78, amount: 1050 },
  { date: '2 days ago', trips: 4, distance: 55, amount: 830 },
  { date: '3 days ago', trips: 2, distance: 30, amount: 450 },
  { date: '4 days ago', trips: 6, distance: 92, amount: 1280 },
];

export function TransporterEarningsPage() {
  const { t } = useLanguage();
  const totalEarnings = EARNINGS_DATA.reduce((s, d) => s + d.amount, 0);

  const stats = [
    { label: t('thisWeek'), value: '₹4,230', icon: DollarSign, bg: 'bg-emerald-100', color: 'text-emerald-600' },
    { label: t('totalTrips'), value: '20', icon: Truck, bg: 'bg-blue-100', color: 'text-blue-600' },
    { label: t('totalDistance'), value: '297 km', icon: TrendingUp, bg: 'bg-amber-100', color: 'text-amber-600' },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold">{t('earningsTitle')}</h1>
          <p className="text-muted-foreground text-sm">{t('trackDeliveryIncome')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} className="card-elevated p-5">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', s.bg)}>
                  <Icon className={cn('w-5 h-5', s.color)} />
                </div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground truncate">{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="card-elevated p-5">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {t('recentTripHistory')}
          </h2>
          <div className="space-y-3">
            {EARNINGS_DATA.map(d => (
              <div key={d.date} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                <div>
                  <p className="font-medium text-sm">{d.date}</p>
                  <p className="text-xs text-muted-foreground">{d.trips} {t('trips')} • {d.distance} km</p>
                </div>
                <p className="font-bold text-primary">₹{d.amount}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t('total')} (5 days)</span>
            <span className="font-bold text-lg">₹{totalEarnings.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
