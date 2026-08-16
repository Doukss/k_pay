import { motion, type Variants } from 'motion/react';
import { TrendingDown, Clock3, Smile } from 'lucide-react';

interface Outcome {
  icon: typeof TrendingDown;
  value: string;
  label: string;
}

const OUTCOMES: Outcome[] = [
  {
    icon: TrendingDown,
    value: '-30%',
    label: 'de retards de paiement projetés',
  },
  {
    icon: Clock3,
    value: '3h',
    label: 'gagnées par semaine sur les relances',
  },
  {
    icon: Smile,
    value: '0',
    label: 'déplacement pour encaisser un loyer',
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

export function UseCaseSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Un cas concret : une agence de 50 logements à Dakar
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mt-14 rounded-2xl border bg-card p-8 md:p-12"
        >
          <p className="text-base leading-relaxed text-foreground/80 md:text-lg">
            Une agence immobilière basée à Dakar gère{' '}
            <span className="font-semibold text-foreground">50 logements</span>{' '}
            répartis dans plusieurs quartiers. Avant KeurGui Pay, l'agent
            passait plusieurs heures par semaine à appeler individuellement
            chaque locataire en retard, et devait parfois se déplacer pour
            récupérer le loyer en espèces — avec le risque de perte ou de vol
            que ça implique.
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/80 md:text-lg">
            Avec KeurGui Pay, l'agence configure un scénario de relance
            automatique : un rappel amical 3 jours avant l'échéance, puis des
            relances progressives en cas de retard. Chaque locataire reçoit un
            lien de paiement par SMS et WhatsApp, et règle directement via
            Wave ou Orange Money. L'agent suit tout depuis un seul tableau de
            bord, sans plus jamais avoir à courir après un paiement en
            personne.
          </p>

          {/* Résultats projetés */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="mt-10 grid gap-6 border-t pt-8 sm:grid-cols-3"
          >
            {OUTCOMES.map((outcome) => {
              const Icon = outcome.icon;
              return (
                <motion.div
                  key={outcome.label}
                  variants={itemVariants}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="mt-3 text-2xl font-bold text-foreground">
                    {outcome.value}
                  </span>
                  <span className="mt-1 text-sm text-muted-foreground">
                    {outcome.label}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Résultats projetés sur la base des scénarios de relance configurés
            — pas encore de données clients réelles.
          </p>
        </motion.div>
      </div>
    </section>
  );
}