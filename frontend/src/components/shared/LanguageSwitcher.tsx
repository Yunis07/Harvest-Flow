import { useLanguage, LANGUAGE_OPTIONS } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LANGUAGE_OPTIONS.find((l) => l.code === language);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors w-full"
      >
        <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="truncate">{current?.nativeLabel || 'English'}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-1 w-48 bg-card border border-border rounded-xl shadow-xl z-50 py-1 max-h-64 overflow-y-auto">
          {LANGUAGE_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              onClick={() => {
                setLanguage(opt.code);
                setIsOpen(false);
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors',
                language === opt.code
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'hover:bg-muted text-foreground'
              )}
            >
              <span className="truncate">{opt.nativeLabel}</span>
              <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
