import { motion, type Variants } from 'motion/react';
import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
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
  trialBadge?: string;
  highlighted?: boolean;
  cta: string;
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '15 000',
    period: 'FCFA / mois',
    description: 'Pour les agences démarrant la digitalisation de leurs biens.',
    quota: "Jusqu'à 50 locataires max",
    trialBadge: '30 jours d\'essai gratuit',
    features: [
      "Jusqu'à 50 locataires gérés",
      'Passerelles Wave & Orange Money',
      'Relances WhatsApp & SMS',
      'Quittances PDF certifiées',
      'Tableau de bord & suivi temps réel',
      'Support réactif par WhatsApp & Email',
    ],
    cta: "Démarrer l'essai (30j gratuits)",
  },
  {
    id: 'business',
    name: 'Business',
    price: '25 000',
    period: 'FCFA / mois',
    description: 'Pour les agences en pleine croissance avec un parc locatif actif.',
    quota: "Jusqu'à 100 locataires max",
    trialBadge: '30 jours d\'essai gratuit',
    features: [
      'Tout le plan Starter',
      "Jusqu'à 100 locataires gérés",
      'Scénarios de relance personnalisables',
      'Rapports comptables & exports Excel',
      'Relances automatiques par lots',
      'Support prioritaire 7j/7',
    ],
    highlighted: true,
    cta: "Démarrer l'essai (30j gratuits)",
  },
  {
    id: 'pro',
    name: 'Plan Pro',
    price: '60 000',
    period: 'FCFA / mois',
    description: 'Pour les grands cabinets et patrimoines multi-biens à fort volume.',
    quota: 'Locataires illimités',
    features: [
      'Tout le plan Business',
      'Locataires & logements illimités',
      'Multi-agences & agents multiples',
      'Statistiques de recouvrement avancées',
      'Passerelles dédiées & accès API',
      'Accompagnement & gestionnaire dédié',
    ],
    cta: 'Choisir Plan Pro',
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

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {plan.quota}
                </span>
                {plan.trialBadge && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="h-3 w-3" />
                    {plan.trialBadge}
                  </span>
                )}
              </div>

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

        {/* Encadré explicatif Essai 30 Jours & Règle d'usage unique */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 rounded-2xl border border-primary/20 bg-card p-6 shadow-sm max-w-3xl mx-auto text-center space-y-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Conditions Essai Gratuit 30 Jours
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed font-medium">
            Bénéficiez de <strong>30 jours d'essai 100% gratuit</strong> sur les forfaits <strong>15 000 FCFA</strong> (50 locataires) et <strong>25 000 FCFA</strong> (100 locataires), sans saisie de carte bancaire.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            À l'échéance des 30 jours, la plateforme vous invite à activer votre forfait. Par la suite, chaque agence renouvelle son abonnement après chaque mois (cycle de 30 jours) directement par <strong>Wave</strong> ou <strong>Orange Money</strong> avec génération de quittance certifiée.
            <span className="block mt-1 font-semibold text-amber-600 dark:text-[#E5B842]">
              ⚠️ Règle d'usage : chaque agence a droit à un seul essai gratuit de 30 jours (non reconductible).
            </span>
          </p>
        </motion.div>

        {/* Réassurance sous la grille */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 text-center text-sm text-muted-foreground"
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