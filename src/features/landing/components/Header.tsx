// features/landing/components/Header.tsx
import { motion, AnimatePresence, useScroll, type Variants } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { MobileNav } from './MobileNav';
import { useScrollHeader } from '../hooks/useScrollHeader';
import type { NavLink } from '../types';

const NAV_LINKS: NavLink[] = [
  { label: 'Fonctionnalités', href: '#fonctionnalites' },
  { label: 'Comment ça marche', href: '#comment-ca-marche' },
  { label: 'Tarifs', href: '#tarifs' },
  { label: 'FAQ', href: '#faq' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export function Header() {
  const isScrolled = useScrollHeader();
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Barre de progression de scroll */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="absolute top-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-primary via-primary/70 to-primary/30"
      />

      <div
        className={cn(
          'mx-auto px-4 transition-[padding] duration-500 ease-out md:px-6',
          isScrolled ? 'max-w-5xl pt-3' : 'max-w-6xl pt-0'
        )}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            'flex h-16 items-center justify-between transition-all duration-500 ease-out',
            isScrolled
              ? 'rounded-2xl border bg-background/70 px-4 shadow-[0_8px_30px_-8px_rgba(20,26,46,0.18)] backdrop-blur-xl md:px-5'
              : 'rounded-none border-transparent bg-transparent px-0 shadow-none'
          )}
        >
          {/* Logo */}
          <motion.a
            variants={itemVariants}
            href="/"
            className="group flex items-center gap-2.5"
          >
            <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary to-primary/60 shadow-sm">
              <span className="text-sm font-black text-primary-foreground">K</span>
              <motion.span
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
                animate={{ x: ['-100%', '220%'] }}
                transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
              />
            </span>
            <span className="flex items-baseline text-lg font-semibold tracking-tight">
              <span className="text-foreground">KeurGui</span>
              <span className="text-primary">Pay</span>
            </span>
          </motion.a>

          {/* Navigation desktop — highlight magnétique */}
          <nav
            onMouseLeave={() => setHovered(null)}
            className="hidden items-center gap-1 md:flex"
          >
            {NAV_LINKS.map((link) => (
              <motion.a
                key={link.href}
                variants={itemVariants}
                href={link.href}
                onMouseEnter={() => setHovered(link.href)}
                className="relative rounded-full px-3.5 py-1.5 text-sm font-medium text-foreground/65 transition-colors hover:text-foreground"
              >
                <AnimatePresence>
                  {hovered === link.href && (
                    <motion.span
                      layoutId="nav-highlight"
                      className="absolute inset-0 rounded-full bg-foreground/[0.06]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ layout: { duration: 0.28, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.15 } }}
                    />
                  )}
                </AnimatePresence>
                <span className="relative z-10">{link.label}</span>
              </motion.a>
            ))}
          </nav>

          {/* CTA desktop */}
          <motion.div variants={itemVariants} className="hidden items-center gap-2 md:flex">
            <Link to="/connexion">
              <Button variant="ghost" className="text-foreground/70 hover:text-foreground">
                Connexion
              </Button>
            </Link>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/inscription">
                <Button className="group relative gap-1.5 overflow-hidden bg-gradient-to-r from-primary to-primary/85 shadow-sm">
                  <span className="relative z-10 flex items-center gap-1.5">
                    Essai gratuit
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Nav mobile */}
          <motion.div variants={itemVariants}>
            <MobileNav links={NAV_LINKS} />
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
}