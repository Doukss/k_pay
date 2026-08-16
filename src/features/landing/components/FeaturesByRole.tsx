import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import {
  Building2,
  User,
  ShieldCheck,
  Check,
  TrendingUp,
  Wallet,
  CheckCheck,
  CircleDot,
} from 'lucide-react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/shared/components/ui/tabs';

interface RoleFeature {
  id: string;
  label: string;
  icon: typeof Building2;
  title: string;
  description: string;
  points: string[];
  accent: string;
}

const ROLES: RoleFeature[] = [
  {
    id: 'agent',
    label: 'Agent immobilier',
    icon: Building2,
    title: 'Pilotez votre recouvrement au quotidien',
    description:
      "Un tableau de bord complet pour suivre vos loyers, gérer vos locataires et automatiser vos relances.",
    points: [
      'Dashboard avec indicateurs clés : attendu, collecté, impayés, retards',
      "Gestion des locataires avec filtres et formulaire d'ajout par étapes",
      'Éditeur de scénarios de relance (J-3, J-1, J+1, J+5) en français ou wolof',
      'Enregistrement des paiements manuels et rapports comptables exportables',
    ],
    accent: 'var(--kg-ink)',
  },
  {
    id: 'locataire',
    label: 'Locataire',
    icon: User,
    title: 'Payez votre loyer en un clic, sans déplacement',
    description:
      'Un portail simple et mobile-first, accessible directement depuis un lien reçu par SMS ou WhatsApp.',
    points: [
      'Accès sécurisé via un lien unique, sans création de compte',
      "Visualisation instantanée du montant dû et de l'échéance",
      'Paiement via Wave ou Orange Money en quelques secondes',
      'Quittance de loyer téléchargeable en PDF et confirmation WhatsApp',
    ],
    accent: 'var(--kg-emerald)',
  },
  {
    id: 'admin',
    label: 'Super Admin',
    icon: ShieldCheck,
    title: 'Supervisez toute la plateforme',
    description:
      "Une vue d'ensemble complète sur les agences, la trésorerie globale et la santé technique du système.",
    points: [
      'Dashboard plateforme : MRR, agences actives, volume de loyers traités',
      'Gestion des tenants : statuts, formules d\'abonnement, quotas',
      'Monitoring technique : délivrabilité SMS, statut des gateways Mobile Money',
      'Éditeur des plans tarifaires et des quotas par agence',
    ],
    accent: 'var(--kg-gold)',
  },
];

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const pointVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

const barHeights: Record<string, number[]> = {
  agent: [40, 65, 50, 80, 60, 92],
  locataire: [],
  admin: [55, 70, 45, 85],
};

function AgentMockup({ accent }: { accent: string }) {
  return (
    <div className="relative flex h-full flex-col justify-between p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-foreground/70">
          Dashboard agence
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
              style={{ background: accent }}
            />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
          </span>
          En direct
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { label: 'Attendu', value: '4,2M', color: 'var(--kg-ink)' },
          { label: 'Collecté', value: '3,6M', color: 'var(--kg-emerald)' },
          { label: 'Impayés', value: '600K', color: 'var(--kg-gold)' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-background/60 p-3" style={{ borderColor: 'var(--kg-line)' }}>
            <p className="font-serif text-lg font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex h-24 items-end gap-2">
        {barHeights.agent.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 rounded-t-sm"
            style={{ background: i === barHeights.agent.length - 1 ? accent : 'var(--kg-line)' }}
          />
        ))}
      </div>
    </div>
  );
}

function LocataireMockup({ accent }: { accent: string }) {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div
        className="w-52 rounded-[1.75rem] border-4 bg-background/80 p-4 shadow-inner"
        style={{ borderColor: 'var(--kg-ink)' }}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-foreground/20" />
        <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          Loyer dû
        </p>
        <p className="mt-1 text-center font-serif text-2xl font-bold text-foreground">
          85 000 <span className="text-sm font-normal">FCFA</span>
        </p>
        <p className="text-center text-[11px] text-muted-foreground">Échéance : 05 Août</p>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-white"
          style={{ background: accent }}
        >
          <Wallet className="h-3.5 w-3.5" />
          Payer avec Wave
        </motion.button>

        <div
          className="mt-3 flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-[10px] text-muted-foreground"
          style={{ borderColor: 'var(--kg-line)' }}
        >
          <span>Reçu précédent</span>
          <span className="flex items-center gap-1" style={{ color: accent }}>
            Payé <CheckCheck className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

function AdminMockup({ accent }: { accent: string }) {
  const agencies = [
    { name: 'Teranga Immo', mrr: '1,2M', active: true },
    { name: 'Sahel Gestion', mrr: '860K', active: true },
    { name: 'Baobab Habitat', mrr: '410K', active: false },
  ];
  return (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-foreground/70">
          Plateforme
        </span>
        <span className="flex items-center gap-1 text-[11px]" style={{ color: accent }}>
          <TrendingUp className="h-3.5 w-3.5" />
          MRR 2,4M FCFA
        </span>
      </div>

      <div className="mt-5 space-y-2">
        {agencies.map((agency, i) => (
          <motion.div
            key={agency.name}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="flex items-center justify-between rounded-lg border bg-background/60 px-3 py-2"
            style={{ borderColor: 'var(--kg-line)' }}
          >
            <span className="flex items-center gap-2 text-xs text-foreground">
              <CircleDot
                className="h-3 w-3"
                style={{ color: agency.active ? 'var(--kg-emerald)' : 'var(--kg-line)' }}
              />
              {agency.name}
            </span>
            <span className="font-serif text-xs font-semibold text-foreground/80">
              {agency.mrr}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 h-16 items-end gap-2 flex">
        {barHeights.admin.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
            className="flex-1 rounded-t-sm"
            style={{ background: 'var(--kg-line)' }}
          />
        ))}
      </div>
    </div>
  );
}

const MOCKUPS: Record<string, typeof AgentMockup> = {
  agent: AgentMockup,
  locataire: LocataireMockup,
  admin: AdminMockup,
};

export function FeaturesByRole() {
  const [activeRole, setActiveRole] = useState('agent');

  return (
    <section
      id="fonctionnalites"
      className="relative overflow-hidden py-20 md:py-28"
      style={
        {
          '--kg-ink': '#141a2e',
          '--kg-gold': '#e3a542',
          '--kg-emerald': '#1c8c6e',
          '--kg-line': '#ddd0b4',
        } as React.CSSProperties
      }
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.1]"
        style={{
          backgroundImage: 'radial-gradient(var(--kg-line) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage:
            'radial-gradient(ellipse 75% 65% at 50% 40%, black 30%, transparent 90%)',
        }}
      />

      <div className="mx-auto max-w-5xl px-4 md:px-6">
        {/* En-tête de section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Une plateforme, trois expériences
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            KeurGui Pay s'adapte à chaque utilisateur, de l'agence au
            locataire jusqu'à la supervision globale de la plateforme.
          </p>
        </motion.div>

        {/* Onglets par rôle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mt-14"
        >
          <Tabs value={activeRole} onValueChange={setActiveRole} className="w-full">
            <TabsList className="mx-auto grid w-full max-w-xl grid-cols-3">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isActive = role.id === activeRole;
                return (
                  <TabsTrigger key={role.id} value={role.id} className="gap-2">
                    <Icon
                      className="h-4 w-4 transition-colors duration-300"
                      style={{ color: isActive ? role.accent : undefined }}
                    />
                    <span className="hidden sm:inline">{role.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <AnimatePresence mode="wait">
              {ROLES.map(
                (role) =>
                  role.id === activeRole && (
                    <TabsContent key={role.id} value={role.id}>
                      <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="mt-10 grid gap-10 md:grid-cols-2 md:items-center"
                      >
                        {/* Texte */}
                        <div>
                          <h3 className="text-2xl font-semibold text-foreground">
                            {role.title}
                          </h3>
                          <p className="mt-3 text-muted-foreground">
                            {role.description}
                          </p>

                          <motion.ul
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                            className="mt-6 space-y-3"
                          >
                            {role.points.map((point) => (
                              <motion.li
                                key={point}
                                variants={pointVariants}
                                className="flex items-start gap-3 text-sm text-foreground/80"
                              >
                                <Check
                                  className="mt-0.5 h-4 w-4 shrink-0"
                                  style={{ color: role.accent }}
                                />
                                {point}
                              </motion.li>
                            ))}
                          </motion.ul>
                        </div>

                        {/* Mockup dédié au rôle */}
                        <div
                          className="overflow-hidden rounded-xl border bg-card shadow-lg"
                          style={{ borderColor: 'var(--kg-line)' }}
                        >
                          {(() => {
                            const Mockup = MOCKUPS[role.id];
                            return <Mockup accent={role.accent} />;
                          })()}
                        </div>
                      </motion.div>
                    </TabsContent>
                  )
              )}
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}