import { motion, type Variants } from 'motion/react';
import { Clock, Banknote, MessageCircleWarning } from 'lucide-react';

interface Pain {
  icon: typeof Clock;
  title: string;
  description: string;
}

const PAINS: Pain[] = [
  {
    icon: Clock,
    title: 'Relances manuelles et chronophages',
    description:
      "Appels, passages sur le terrain, messages envoyés un par un — les agences perdent un temps précieux à relancer chaque locataire individuellement, sans garantie de résultat.",
  },
  {
    icon: Banknote,
    title: 'Cash et déplacements risqués',
    description:
      "Collecter le loyer en espèces impose des déplacements, expose à des pertes ou vols, et complique le suivi comptable en temps réel.",
  },
  {
    icon: MessageCircleWarning,
    title: 'Retards de paiement mal anticipés',
    description:
      "Sans scénario de relance structuré (avant/après échéance), les retards s'accumulent et deviennent des impayés difficiles à recouvrer.",
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
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ProblemStatement() {
  return (
    <section className="py-20 md:py-28">
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
            La gestion locative reste bloquée dans le passé
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Au Sénégal, la plupart des agences immobilières gèrent encore leurs
            loyers avec des méthodes manuelles — au détriment du temps et de la
            trésorerie.
          </p>
        </motion.div>

        {/* Grille des constats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {PAINS.map((pain) => {
            const Icon = pain.icon;
            return (
              <motion.div
                key={pain.title}
                variants={itemVariants}
                className="group rounded-xl border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {pain.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {pain.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}