// features/landing/components/Header.tsx
import { motion, type Variants } from 'motion/react';
import { Link } from 'react-router-dom';
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
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export function Header() {
  const isScrolled = useScrollHeader();

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'transition-colors duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur border-b shadow-sm'
          : 'bg-transparent'
      )}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6"
      >
        {/* Logo */}
        <motion.a
          variants={itemVariants}
          href="/"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <span className="text-primary">KeurGui</span>
          <span>Pay</span>
        </motion.a>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <motion.a
              key={link.href}
              variants={itemVariants}
              href={link.href}
              className="group relative text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
        </nav>

        {/* CTA desktop */}
        <motion.div variants={itemVariants} className="hidden md:flex items-center gap-3">
          <Link to="/connexion">
            <Button variant="ghost">Connexion</Button>
          </Link>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link to="/inscription">
              <Button>Essai gratuit</Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Nav mobile */}
        <motion.div variants={itemVariants}>
          <MobileNav links={NAV_LINKS} />
        </motion.div>
      </motion.div>
    </motion.header>
  );
}