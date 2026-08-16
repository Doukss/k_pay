import { motion, type Variants } from 'motion/react';
import { ShieldCheck, Zap, WalletCards } from 'lucide-react';

interface Guarantee {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
}

const GUARANTEES: Guarantee[] = [
  {
    icon: ShieldCheck,
    title: 'Paiement sécurisé',
    description:
      'Chaque transaction passe directement par les gateways officielles Wave et Orange Money, sans stockage de données sensibles.',
  },
  {
    icon: Zap,
    title: 'Confirmation instantanée',
    description:
      "Dès le paiement validé, l'agence et le locataire reçoivent une confirmation immédiate, sans délai de traitement.",
  },
  {
    icon: WalletCards,
    title: 'Zéro cash à manipuler',
    description:
      'Plus besoin de déplacement ni de gestion d\'espèces — tout transite de manière traçable et digitale.',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function MobileMoneyShowcase() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Fond décoratif subtil, cohérent avec le Hero */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_var(--primary)_0%,_transparent_50%)] opacity-[0.05]" />

      <div className="mx-auto max-w-5xl px-4 md:px-6">
        {/* En-tête de section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Compatible avec les paiements que vos locataires utilisent déjà
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Pas de nouvelle application à installer, pas de carte bancaire —
            juste Wave et Orange Money.
          </p>
        </motion.div>

        {/* Logos Wave / Orange Money */}
        <motion.div
          variants={logoVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6"
        >
          <div className="flex h-20 w-48 items-center justify-center rounded-xl border bg-card shadow-sm">
            <img src="/images/logo-wave.svg" alt="Wave" className="h-8 w-auto" />
          </div>
          <div className="flex h-20 w-48 items-center justify-center rounded-xl border bg-card shadow-sm">
            <img
              src="/images/logo-orange-money.svg"
              alt="Orange Money"
              className="h-8 w-auto"
            />
          </div>
        </motion.div>

        {/* Garanties */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          {GUARANTEES.map((guarantee) => {
            const Icon = guarantee.icon;
            return (
              <motion.div
                key={guarantee.title}
                variants={itemVariants}
                className="rounded-xl border bg-card p-6 text-center"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {guarantee.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {guarantee.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}