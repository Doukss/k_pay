import { motion, type Variants } from 'motion/react';
import { Settings2, Send, Smartphone, FileCheck2 } from 'lucide-react';

interface Step {
  number: string;
  icon: typeof Settings2;
  title: string;
  description: string;
  accent: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    icon: Settings2,
    title: "L'agence configure",
    description:
      "Ajout des locataires, des loyers et des scénarios de relance (J-3, J-1, J+1, J+5) en français ou en wolof.",
    accent: 'var(--kg-ink)',
  },
  {
    number: '02',
    icon: Send,
    title: 'Le locataire reçoit une relance',
    description:
      'SMS et WhatsApp automatiques avec un lien de paiement sécurisé, envoyés selon le scénario configuré.',
    accent: 'var(--kg-gold)',
  },
  {
    number: '03',
    icon: Smartphone,
    title: 'Paiement via Mobile Money',
    description:
      'Le locataire règle en un clic avec Wave ou Orange Money, sans déplacement ni espèces.',
    accent: 'var(--kg-emerald)',
  },
  {
    number: '04',
    icon: FileCheck2,
    title: 'Quittance automatique',
    description:
      "Confirmation instantanée et quittance PDF générée automatiquement pour l'agence et le locataire.",
    accent: 'var(--kg-ink)',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -18 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 240, damping: 16 },
  },
};

const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
  },
};

const lineVariantsVertical: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
  },
};

export function HowItWorks() {
  return (
    <section
      id="comment-ca-marche"
      className="relative overflow-hidden bg-muted/30 py-20 md:py-28"
      style={
        {
          '--kg-ink': '#141a2e',
          '--kg-gold': '#e3a542',
          '--kg-emerald': '#1c8c6e',
          '--kg-line': '#ddd0b4',
        } as React.CSSProperties
      }
    >
      {/* Fond quadrillé, cohérent avec le hero */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.1]"
        style={{
          backgroundImage: 'radial-gradient(var(--kg-line) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage:
            'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 90%)',
        }}
      />

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* En-tête de section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span
            className="inline-flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] backdrop-blur"
            style={{ color: 'var(--kg-emerald)', borderColor: 'var(--kg-line)' }}
          >
            Le parcours en 4 étapes
          </span>
          <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Comment ça marche
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Quatre étapes suffisent pour digitaliser le recouvrement de vos
            loyers, de la relance à la quittance.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="relative mt-20"
        >
          {/* Ligne "cousue" — desktop */}
          <motion.div
            variants={lineVariants}
            style={{
              transformOrigin: 'left',
              backgroundImage:
                'repeating-linear-gradient(90deg, var(--kg-line) 0, var(--kg-line) 8px, transparent 8px, transparent 16px)',
            }}
            className="absolute left-[52px] right-[52px] top-[26px] hidden h-[2px] md:block"
          />

          {/* Ligne "cousue" — mobile */}
          <motion.div
            variants={lineVariantsVertical}
            style={{
              transformOrigin: 'top',
              backgroundImage:
                'repeating-linear-gradient(180deg, var(--kg-line) 0, var(--kg-line) 8px, transparent 8px, transparent 16px)',
            }}
            className="absolute left-[26px] top-[52px] bottom-[52px] w-[2px] md:hidden"
          />

          <div className="grid gap-12 md:grid-cols-4 md:gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={itemVariants}
                  className="group relative flex items-start gap-4 text-left md:flex-col md:items-start md:gap-0"
                >
                  {/* Pastille icône avec numéro fantôme */}
                  <motion.div
                    variants={badgeVariants}
                    whileHover={{ y: -3 }}
                    className="relative z-10 flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-2 bg-background shadow-sm transition-shadow duration-300 group-hover:shadow-md"
                    style={{ borderColor: step.accent, color: step.accent }}
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-2 -top-3 font-serif text-3xl font-bold opacity-[0.14] md:-right-1"
                      style={{ color: step.accent }}
                    >
                      {step.number}
                    </span>
                    <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  </motion.div>

                  <div className="md:mt-4">
                    <span
                      className="text-xs font-semibold tracking-wide"
                      style={{ color: step.accent }}
                    >
                      ÉTAPE {step.number}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>

                  {/* Connecteur mobile pour lier visuellement au trait vertical */}
                  {i < STEPS.length - 1 && (
                    <span className="absolute left-[26px] top-[52px] h-[calc(100%-32px)] w-[2px] md:hidden" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}