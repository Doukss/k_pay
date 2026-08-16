import { motion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Panneau branding — masqué sur mobile */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground md:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_white_0%,_transparent_45%)] opacity-10" />

        <a href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span>KeurGui</span>
          <span className="opacity-80">Pay</span>
        </a>

        <div>
          <p className="text-2xl font-semibold leading-snug">
            Automatisez le recouvrement de vos loyers, sans déplacement.
          </p>
          <p className="mt-4 text-sm text-primary-foreground/80">
            Relances SMS/WhatsApp automatiques · Paiement Wave & Orange Money
            · Quittances instantanées.
          </p>
        </div>

        <p className="text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} KeurGui Pay · Fait à Dakar 🇸🇳
        </p>
      </div>

      {/* Formulaire */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-sm"
        >
          {/* Logo mobile uniquement */}
          <a
            href="/"
            className="mb-8 flex items-center gap-2 text-lg font-semibold md:hidden"
          >
            <span className="text-primary">KeurGui</span>
            <span>Pay</span>
          </a>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}