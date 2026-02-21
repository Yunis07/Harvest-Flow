import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Leaf, ShoppingCart, Store, Truck, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import authBg from '@/assets/auth-bg.png';

export function AuthPage() {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = React.useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<UserRole>('buyer');
  const [formData, setFormData] = React.useState({ name: '', email: '', password: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') await login(formData.email, formData.password);
    else await register({ name: formData.name, email: formData.email, password: formData.password, phone: formData.phone, role: selectedRole });
    navigate('/marketplace');
  };

  const handleQuickDemo = async (role: UserRole) => {
    await login('demo@harvestlog.in', 'demo123');
    navigate('/marketplace');
  };

  const ROLE_OPTIONS: { role: UserRole; label: string; icon: typeof ShoppingCart; description: string }[] = [
    { role: 'buyer', label: t('buyer'), icon: ShoppingCart, description: t('purchaseProduce') },
    { role: 'seller', label: t('seller'), icon: Store, description: t('sellYourHarvest') },
    { role: 'transporter', label: t('transporter'), icon: Truck, description: t('deliverAndEarn') },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-amber blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-white">Harvest-Flow</h1>
                <p className="text-white/70 text-sm">{t('agriFintech')}</p>
              </div>
            </div>
            <h2 className="text-4xl xl:text-5xl font-display font-bold text-white leading-tight mb-6">
              {t('connectingFarms')}<br />{t('toMarkets')}<br />
              <span className="text-amber-light">{t('intelligently')}</span>
            </h2>
            <p className="text-lg text-white/80 max-w-md mb-8">{t('platformDesc')}</p>
            <div className="flex flex-wrap gap-4">
              {[t('realTimeGps'), t('smartRoutes'), t('riskEngine'), t('liveChat')].map(feature => (
                <div key={feature} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                  <Check className="w-4 h-4 text-amber-light" />
                  <span className="text-sm text-white font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${authBg})` }}>
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ position: 'relative', zIndex: 10 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-forest rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl">Harvest-Flow</span>
          </div>

          <div className="flex bg-muted rounded-xl p-1 mb-8">
            <button onClick={() => setMode('login')}
              className={cn("flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
                mode === 'login' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
              {t('signIn')}
            </button>
            <button onClick={() => setMode('register')}
              className={cn("flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
                mode === 'register' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
              {t('createAccount')}
            </button>
          </div>

          <h2 className="text-2xl font-display font-bold mb-2">
            {mode === 'login' ? t('welcomeBack') : t('joinHarvestLog')}
          </h2>
          <p className="text-muted-foreground mb-6">
            {mode === 'login' ? t('enterCredentials') : t('createAccountDesc')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <Label htmlFor="name">{t('fullName')}</Label>
                  <Input id="name" type="text" placeholder={t('enterYourName')} value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1.5" required />
                </div>
                <div>
                  <Label htmlFor="phone">{t('phoneNumber')}</Label>
                  <Input id="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1.5" required />
                </div>
                <div>
                  <Label>{t('iWantTo')}</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1.5">
                    {ROLE_OPTIONS.map(({ role, label, icon: Icon }) => (
                      <button key={role} type="button" onClick={() => setSelectedRole(role)}
                        className={cn("flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all",
                          selectedRole === role ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                        <Icon className={cn("w-5 h-5", selectedRole === role ? "text-primary" : "text-muted-foreground")} />
                        <span className={cn("text-xs font-medium truncate", selectedRole === role ? "text-primary" : "text-muted-foreground")}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="mt-1.5" required />
            </div>
            <div>
              <Label htmlFor="password">{t('password')}</Label>
              <div className="relative mt-1.5">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder={t('enterPassword')} value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="pr-10" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="forest" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? <span className="animate-pulse">{t('loading')}</span> : (
                <>{mode === 'login' ? t('signIn') : t('createAccount')}<ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">{t('orTryDemo')}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {ROLE_OPTIONS.map(({ role, label, icon: Icon }) => (
              <Button key={role} type="button" variant="outline" onClick={() => handleQuickDemo(role)}
                className="flex flex-col items-center gap-1 h-auto py-3">
                <Icon className="w-5 h-5 text-primary" />
                <span className="text-xs truncate">{label}</span>
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
