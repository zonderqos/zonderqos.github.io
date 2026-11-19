import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, ExternalLink, Menu, Moon, Sun, X } from 'lucide-react';
import { ZonderqLogo } from '@/assets/ZonderqLogo';
import { Button } from '@/components/ui/Button';
import { uiText } from '@/data/i18n';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import type { Theme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import type { NavSectionId } from '@/types/site';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

const NAV_ORDER: NavSectionId[] = [
  'home',
  'features',
  'screenshots',
  'roadmap',
  'downloads',
  'virtual-machines',
  'installation',
  'development',
  'faq',
];

export function Navbar({ theme, onToggleTheme }: NavbarProps): React.ReactElement {
  const activeSection = useActiveSection();
  const scrollProgress = useScrollProgress();
  const reducedMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const scrollToSection = (id: NavSectionId) => {
    setMobileOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        isScrolled
          ? 'zq-glass shadow-lg shadow-black/25'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      {/* Page Scroll Progress Indicator */}
      <div
        role="progressbar"
        aria-label={uiText.nav.scrollProgressAria}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(scrollProgress)}
        className="h-0.5 w-full bg-slate-800/40"
      >
        <div
          className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] transition-[width] duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('home');
          }}
          className="group flex items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]"
        >
          <ZonderqLogo className="transition-transform duration-200 group-hover:scale-105" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="zq-text-primary text-base font-extrabold tracking-tight">
                Zonderq<span className="text-[#3B82F6]">OS</span>
              </span>
              <span className="hidden items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-300 sm:inline-flex">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Alpha Completed
              </span>
            </div>
            <span className="zq-text-muted font-mono text-[10px] leading-none">
              Gen3 • Cosmos 3.0.97
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav aria-label="Main navigation" className="hidden items-center gap-0.5 xl:flex">
          {NAV_ORDER.map((id) => {
            const isActive = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(id);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]',
                  isActive
                    ? 'zq-text-primary font-semibold'
                    : 'zq-text-secondary hover:zq-text-primary',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId={reducedMotion ? undefined : 'navbar-active-pill'}
                    className="absolute inset-0 -z-10 rounded-xl border border-blue-500/40 bg-gradient-to-r from-[#3B82F6]/20 to-[#8B5CF6]/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {uiText.nav.items[id]}
              </a>
            );
          })}
        </nav>

        {/* Actions: Theme Toggle, GitHub, Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle (Dark Default / Light Optional) */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? uiText.nav.themeToggleLight : uiText.nav.themeToggleDark}
            title={theme === 'dark' ? uiText.nav.themeToggleLight : uiText.nav.themeToggleDark}
            className="zq-surface-elevated zq-text-secondary hover:zq-text-primary inline-flex h-9 w-9 items-center justify-center rounded-lg transition hover:border-blue-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-blue-600" />
            )}
          </button>

          {/* GitHub Button */}
          <Button
            href="https://github.com/dwierzbicki11/ZOnderqOS"
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <span>{uiText.nav.github}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            aria-label={uiText.nav.mobileMenuToggle}
            className="zq-surface-elevated zq-text-primary inline-flex h-9 w-9 items-center justify-center rounded-lg xl:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav-menu"
            aria-label="Mobile navigation"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="zq-glass overflow-hidden border-t xl:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {NAV_ORDER.map((id) => {
                const isActive = activeSection === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(id);
                    }}
                    className={cn(
                      'block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'border border-blue-500/40 bg-blue-500/15 zq-text-primary font-semibold'
                        : 'zq-text-secondary hover:bg-slate-500/10 hover:zq-text-primary',
                    )}
                  >
                    {uiText.nav.items[id]}
                  </a>
                );
              })}

              <div className="pt-2">
                <Button
                  href="https://github.com/dwierzbicki11/ZOnderqOS"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="sm"
                  className="w-full"
                >
                  <span>{uiText.nav.github} Repository</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
