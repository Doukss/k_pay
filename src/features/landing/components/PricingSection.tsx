import { motion, type Variants } from 'motion/react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  quota: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

const PLANS: Plan[] = [
  {
    id: 'essai',
    name: 'Essai',
    price: '0',
    period: 'FCFA / 14 jours',
    description: 'Pour tester la plateforme sans engagement.',
    quota: "Jusqu'à 10 locataires",
    features: [
      'Relances SMS & WhatsApp',
      'Paiement Wave & Orange Money',
      'Dashboard agent complet',
      'Support par email',
    ],
    cta: "Démarrer l'essai",
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '25 000',
    period: 'FCFA / mois',
    description: 'Pour les agences en pleine croissance.',
    quota: "Jusqu'à 100 locataires",
    features: [
      'Tout le plan Essai',
      'Scénarios de relance personnalisables',
      'Rapports comptables exportables',
      'Quittances PDF automatiques',
      'Support prioritaire',
    ],
    highlighted: true,
    cta: 'Choisir Standard',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '60 000',
    period: 'FCFA / mois',
    description: 'Pour les agences multi-biens à fort volume.',
    quota: 'Locataires illimités',
    features: [
      'Tout le plan Standard',
      'Multi-agences / multi-utilisateurs',
      'Statistiques avancées',
      'Accès API',
      'Accompagnement dédié',
    ],
    cta: 'Choisir Pro',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function PricingSection() {
  return (
    <section id="tarifs" className="bg-muted/30 py-20 md:py-28">
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
            Des tarifs adaptés à la taille de votre agence
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Commencez gratuitement, évoluez selon votre nombre de locataires.
            Sans engagement.
          </p>
        </motion.div>

        {/* Grille des plans */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid gap-6 md:grid-cols-3 md:items-start"
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              variants={cardVariants}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-card p-8',
                plan.highlighted
                  ? 'border-primary shadow-xl md:-translate-y-4'
                  : 'shadow-sm'
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Le plus populaire
                </span>
              )}

              <h3 className="text-lg font-semibold text-foreground">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>

              <span className="mt-3 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {plan.quota}
              </span>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-foreground/80"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link to="/inscription" className="mt-8 block w-full">
                <Button
                  size="lg"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Réassurance sous la grille */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 text-center text-sm text-muted-foreground"
        >
          Besoin d'un plan sur-mesure pour un grand groupe immobilier ?{' '}
          <a href="#" className="font-medium text-primary hover:underline">
            Contactez-nous
          </a>
        </motion.p>
      </div>
    </section>
  );
}