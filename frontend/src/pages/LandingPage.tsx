import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Leaf, TrendingUp, Shield, Zap, MapPin, ArrowRight, Check, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  React.useEffect(() => {
    if (isAuthenticated) navigate('/marketplace');
  }, [isAuthenticated, navigate]);

  const features = [
    { icon: MapPin, title: t('realTimeGps'), description: 'Track deliveries live with precise location updates.' },
    { icon: TrendingUp, title: t('riskEngine'), description: 'AI-powered agricultural credit assessment.' },
    { icon: Zap, title: t('smartRoutes'), description: 'Optimal pickup-to-market route optimization.' },
    { icon: Shield, title: t('liveChat'), description: 'Secure real-time communications.' },
  ];

  const stats = [
    { value: '10K+', label: t('activeFarmers') },
    { value: '₹50Cr+', label: t('tradeVolume') },
    { value: '98%', label: t('deliveryRate') },
    { value: '4.8★', label: t('userRating') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-forest rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl">Harvest-Log</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild><Link to="/auth">{t('signIn')}</Link></Button>
            <Button variant="forest" asChild><Link to="/auth">{t('startTrading')}</Link></Button>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
                <Zap className="w-4 h-4" />{t('agriFinTechLogistics')}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
                {t('heroTitle')} <span className="text-gradient-forest">{t('intelligently')}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">{t('heroSubtitle')}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="forest" size="xl" asChild>
                  <Link to="/auth">{t('startTrading')}<ArrowRight className="w-5 h-5" /></Link>
                </Button>
                <Button variant="outline" size="xl"><Play className="w-5 h-5" />{t('watchDemo')}</Button>
              </div>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="text-center p-6 rounded-2xl bg-card border border-border shadow-card">
                <p className="text-3xl lg:text-4xl font-display font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground truncate">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">{t('poweredByInnovation')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('poweredDesc')}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 bg-card rounded-2xl border border-border shadow-card hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">{t('onePlatformThreeRoles')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('rolesDesc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { title: t('farmersAndSellers'), description: 'List produce, manage inventory, connect with buyers.', features: ['Real-time inventory', 'Price intelligence', 'Rating system', 'Order management'] },
              { title: t('buyers'), description: 'Browse fresh produce, compare prices, doorstep delivery.', features: ['Smart marketplace', 'Map-based search', 'Save food deals', 'Live tracking'] },
              { title: t('transporters'), description: 'Accept delivery requests, optimize routes, maximize earnings.', features: ['Nearby requests', 'Route optimization', 'Earnings dashboard', 'Live navigation'] },
            ].map((role, index) => (
              <motion.div key={role.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-card rounded-2xl border border-border shadow-card">
                <h3 className="font-display font-semibold text-xl mb-2">{role.title}</h3>
                <p className="text-muted-foreground mb-4">{role.description}</p>
                <ul className="space-y-2">
                  {role.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-primary" />{f}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">{t('readyToTransform')}</h2>
            <p className="text-lg text-white/80 mb-8">{t('ctaDesc')}</p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/auth">{t('getStartedFree')}<ArrowRight className="w-5 h-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="font-display font-bold">Harvest-Log</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 Harvest-Log. Built for the future of agriculture.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
