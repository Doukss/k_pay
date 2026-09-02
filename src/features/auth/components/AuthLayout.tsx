import { motion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';
import { MessageCircle, CheckCheck, TrendingUp } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const chipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 10 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

function LogoMark({ light }: { light?: boolean }) {
  return (
    <span
      className={
        light
          ? 'flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-sm font-black backdrop-blur-sm'
          : 'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-sm font-black text-primary-foreground shadow-sm'
      }
    >
      K
    </span>
  );
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Panneau branding — masqué sur mobile */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden p-10 text-primary-foreground md:flex"
        style={
          {
            '--kg-line': 'rgba(255,255,255,0.14)',
            background: 'linear-gradient(160deg, var(--kg-ink, #141a2e) 0%, #1c2444 55%, #141a2e 100%)',
          } as React.CSSProperties
        }
      >
        {/* Mesh gradient animé */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(circle at 15% 15%, var(--kg-emerald, #1c8c6e) 0%, transparent 42%),
              radial-gradient(circle at 85% 25%, var(--kg-gold, #e3a542) 0%, transparent 40%),
              radial-gradient(circle at 50% 90%, var(--kg-gold-soft, #f2c877) 0%, transparent 45%)
            `,
          }}
          animate={{ backgroundPosition: ['0% 0%', '8% 4%', '0% 0%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Grille subtile */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 30% 30%, black 30%, transparent 85%)',
          }}
        />

        {/* Halos qui dérivent */}
        <motion.div
          className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"
          animate={{ x: [0, 16, 0], y: [0, -10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl"
          animate={{ x: [0, -14, 0], y: [0, 12, 0] }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        {/* Vignette pour la lisibilité du texte */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        <motion.a
          href="/"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex items-center gap-2.5 text-lg font-semibold"
        >
          <LogoMark light />
          <span className="flex items-baseline">
            <span>KeurGui</span>
            <span className="opacity-70">Pay</span>
          </span>
        </motion.a>

        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="max-w-sm text-2xl font-semibold leading-snug"
          >
            Automatisez le recouvrement de vos loyers, sans déplacement.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="mt-4 max-w-sm text-sm text-primary-foreground/70"
          >
            Relances SMS/WhatsApp automatiques · Paiement Wave & Orange Money
            · Quittances instantanées.
          </motion.p>

          {/* Cartes flottantes en verre — le produit "en action" */}
          <div className="relative mt-10 h-32">
            <motion.div
              custom={0.5}
              variants={chipVariants}
              initial="hidden"
              animate="visible"
              className="absolute left-0 top-0 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/10 px-3.5 py-2.5 shadow-lg backdrop-blur-md"
            >
              <motion.span
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/90"
              >
                <MessageCircle className="h-3.5 w-3.5 text-white" />
              </motion.span>
              <div className="leading-tight">
                <p className="text-xs font-medium">142 relances envoyées</p>
                <p className="flex items-center gap-1 text-[11px] text-primary-foreground/60">
                  Cette semaine <CheckCheck className="h-3 w-3 text-emerald-300" />
                </p>
              </div>
            </motion.div>

            <motion.div
              custom={0.75}
              variants={chipVariants}
              initial="hidden"
              animate="visible"
              className="absolute left-8 top-16 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/10 px-3.5 py-2.5 shadow-lg backdrop-blur-md"
            >
              <motion.span
                animate={{ y: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-300/90"
              >
                <TrendingUp className="h-3.5 w-3.5 text-white" />
              </motion.span>
              <div className="leading-tight">
                <p className="text-xs font-medium">2,4M FCFA encaissés</p>
                <p className="text-[11px] text-primary-foreground/60">Ce mois-ci</p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative z-10 text-xs text-primary-foreground/50"
        >
          © {new Date().getFullYear()} KeurGui Pay · Fait à Dakar 🇸🇳
        </motion.p>
      </div>

      {/* Formulaire */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm"
        >
          {/* Logo mobile uniquement */}
          <motion.a
            variants={itemVariants}
            href="/"
            className="mb-8 flex items-center gap-2.5 text-lg font-semibold md:hidden"
          >
            <LogoMark />
            <span className="flex items-baseline">
              <span className="text-foreground">KeurGui</span>
              <span className="text-primary">Pay</span>
            </span>
          </motion.a>

          <motion.h1 variants={itemVariants} className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-2 text-sm text-muted-foreground">
            {subtitle}
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8">
            {children}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}