import {
  motion,
  MotionConfig,
  useMotionValue,
  useTransform,
  useScroll,
  useSpring,
  animate,
  type Variants,
} from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  MessageCircle,
  CheckCheck,
  Wallet,
  Ban,
  Send,
  MousePointerClick,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import southero from '@/assets/southero.png';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const stageVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
  },
};

const stampVariants: Variants = {
  hidden: { opacity: 0, scale: 1.15, rotate: -18 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: -12,
    transition: { type: 'spring', stiffness: 220, damping: 20, delay: 0.95 },
  },
};

const chipVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

const BENEFITS = [
  { icon: Ban, value: 0, display: '0', label: 'Déplacement requis', color: 'var(--kg-emerald)' },
  { icon: Send, value: 24, display: '24/7', label: 'Relances automatiques', color: 'var(--kg-gold)' },
  { icon: MousePointerClick, value: 1, display: '1', label: 'Paiement en un clic', color: 'var(--kg-emerald)' },
];

function CountUpNumber({ value, display, delay }: { value: number; display: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isSimpleInt = /^\d+$/.test(display);

  useEffect(() => {
    const node = ref.current;
    if (!node || !isSimpleInt) return;
    const controls = animate(0, value, {
      duration: 0.9,
      delay,
      ease: 'easeOut',
      onUpdate(v) {
        node.textContent = Math.round(v).toString();
      },
    });
    return () => controls.stop();
  }, [value, delay, isSimpleInt]);

  return <span ref={ref}>{isSimpleInt ? 0 : display}</span>;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  // Tilt très léger — reste discret, pro
  const rotateX = useSpring(useTransform(cardY, [-80, 80], [3, -3]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(cardX, [-80, 80], [-3, 3]), { stiffness: 120, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const blobOneY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const blobTwoY = useTransform(scrollYProgress, [0, 1], [0, -35]);

  function handleCardMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    cardX.set(e.clientX - rect.left - rect.width / 2);
    cardY.set(e.clientY - rect.top - rect.height / 2);
  }
  function handleCardLeave() {
    cardX.set(0);
    cardY.set(0);
  }

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32"
        style={
          {
            '--kg-ink': '#141a2e',
            '--kg-gold': '#e3a542',
            '--kg-gold-soft': '#f2c877',
            '--kg-emerald': '#1c8c6e',
            '--kg-line': '#ddd0b4',
          } as React.CSSProperties
        }
      >
        {/* Background Image Hero */}
        <div
          className="pointer-events-none absolute inset-0 -z-30 bg-cover bg-center opacity-[0.25]"
          style={{
            backgroundImage: `url(${southero})`,
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 20%, black 40%, transparent 90%)',
          }}
        />

        {/* Fond quadrillé "registre comptable" */}
        <div
          className="pointer-events-none absolute inset-0 -z-20 opacity-[0.14]"
          style={{
            backgroundImage: 'radial-gradient(var(--kg-line) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 20%, black 40%, transparent 90%)',
          }}
        />

        {/* Halos ambiants — dérive lente + parallax au scroll */}
        <motion.div
          style={{ y: blobOneY, background: 'var(--kg-ink)' }}
          className="pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full opacity-[0.14] blur-3xl"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{ y: blobTwoY, background: 'var(--kg-gold)' }}
          className="pointer-events-none absolute -right-16 top-40 -z-10 h-80 w-80 rounded-full opacity-[0.14] blur-3xl"
          animate={{ x: [0, -8, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-4xl flex-col items-center px-4 text-center md:px-6"
        >
          {/* Badge de confiance */}
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-sm text-foreground/70 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Compatible Wave &amp; Orange Money
          </motion.div>

          {/* Titre — un seul fade-up net */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl font-bold leading-[1.08] tracking-tight text-foreground md:text-6xl"
          >
            Le loyer encaissé,{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, var(--kg-gold), var(--kg-gold-soft))' }}
            >
              sans un seul reçu papier
            </span>
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            KeurGui Pay relance automatiquement vos locataires par SMS et WhatsApp,
            et encaisse les loyers directement via Mobile Money — fini le cash et
            les retards.
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative">
              {/* Halo très discret, quasi invisible au repos */}
              <motion.span
                className="pointer-events-none absolute -inset-1.5 -z-10 rounded-full blur-lg"
                style={{ background: 'var(--kg-gold)' }}
                animate={{ opacity: [0.08, 0.16, 0.08] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <Link to="/inscription">
                <Button size="lg" className="group relative gap-2 overflow-hidden w-full sm:w-auto">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Essayer gratuitement
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span
                    className="absolute inset-0 -translate-x-full opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)' }}
                  />
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" variant="outline" className="gap-2">
                <PlayCircle className="h-4 w-4" />
                Voir la démo
              </Button>
            </motion.div>
          </motion.div>

          {/* Micro-texte de réassurance */}
          <motion.div
            variants={itemVariants}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" style={{ color: 'var(--kg-emerald)' }} />
              Sans carte bancaire
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" style={{ color: 'var(--kg-emerald)' }} />
              Configuration en 5 minutes
            </span>
          </motion.div>
        </motion.div>

        {/* Scène visuelle — reçu de loyer + notifications flottantes */}
        <motion.div
          variants={stageVariants}
          initial="hidden"
          animate="visible"
          className="relative mx-auto mt-20 flex max-w-3xl justify-center px-4 md:px-6"
        >
          <div className="relative w-full max-w-sm">
            {/* Le reçu — respiration très légère + tilt 3D discret au survol */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                onMouseMove={handleCardMove}
                onMouseLeave={handleCardLeave}
                style={{
                  rotateX,
                  rotateY,
                  rotateZ: -4,
                  transformPerspective: 900,
                  borderColor: 'var(--kg-line)',
                }}
                className="relative rounded-2xl border bg-card px-6 pb-7 pt-6 shadow-2xl"
              >
                {/* encoches façon billet perforé */}
                <span className="absolute -left-3 top-16 h-6 w-6 rounded-full bg-background" />
                <span className="absolute -right-3 top-16 h-6 w-6 rounded-full bg-background" />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-foreground/80">
                    KeurGui Pay
                  </span>
                  <span className="text-[11px] text-muted-foreground">Reçu de loyer</span>
                </div>

                <div className="mt-4 border-t border-dashed pt-4" style={{ borderColor: 'var(--kg-line)' }}>
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-muted-foreground">Locataire</span>
                    <span className="font-medium text-foreground">Awa Diop</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-muted-foreground">Logement</span>
                    <span className="font-medium text-foreground">Sacré-Cœur, Apt 3</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-muted-foreground">Échéance</span>
                    <span className="font-medium text-foreground">05 Août 2026</span>
                  </div>
                </div>

                <div className="mt-4 flex items-end justify-between border-t pt-4" style={{ borderColor: 'var(--kg-line)' }}>
                  <span className="text-xs text-muted-foreground">Montant réglé</span>
                  <span className="font-serif text-2xl font-bold text-foreground">
                    85 000 <span className="text-base font-normal">FCFA</span>
                  </span>
                </div>

                {/* Tampon PAYÉ — rebond doux, un seul mouvement */}
                <motion.div
                  variants={stampVariants}
                  className="pointer-events-none absolute right-5 top-24 select-none rounded-md border-[3px] bg-background/85 px-3 py-1 backdrop-blur-sm"
                  style={{ borderColor: 'var(--kg-emerald)', color: 'var(--kg-emerald)' }}
                >
                  <span className="text-lg font-black tracking-widest">PAYÉ</span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Bulle WhatsApp flottante — amplitude réduite */}
            <motion.div
              custom={0.85}
              variants={chipVariants}
              initial="hidden"
              animate="visible"
              className="absolute -right-3 -top-5 flex items-center gap-2 rounded-xl border bg-card px-3 py-2 shadow-lg sm:-right-6 md:-right-14"
              style={{ borderColor: 'var(--kg-line)' }}
            >
              <motion.span
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-7 w-7 items-center justify-center rounded-full"
                style={{ background: 'var(--kg-emerald)' }}
              >
                <MessageCircle className="h-4 w-4 text-white" />
              </motion.span>
              <div className="text-left leading-tight">
                <p className="text-xs font-medium text-foreground">Loyer d'Awa reçu</p>
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  via Wave <CheckCheck className="h-3 w-3" style={{ color: 'var(--kg-emerald)' }} />
                </p>
              </div>
            </motion.div>

            {/* Badge Mobile Money flottant — amplitude réduite */}
            <motion.div
              custom={1.05}
              variants={chipVariants}
              initial="hidden"
              animate="visible"
              className="absolute -bottom-5 -left-3 flex items-center gap-2 rounded-xl border bg-card px-3 py-2 shadow-lg sm:-left-6 md:-left-12"
              style={{ borderColor: 'var(--kg-line)' }}
            >
              <motion.span
                animate={{ y: [0, 2, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="flex h-7 w-7 items-center justify-center rounded-full"
                style={{ background: 'var(--kg-gold)' }}
              >
                <Wallet className="h-4 w-4 text-white" />
              </motion.span>
              <div className="text-left leading-tight">
                <p className="text-xs font-medium text-foreground">Encaissement auto</p>
                <p className="text-[11px] text-muted-foreground">Wave · Orange Money</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bandeau de bénéfices */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.2 }}
          className="relative z-10 mx-auto mt-20 grid max-w-2xl grid-cols-3 gap-4 border-t px-4 pt-8 text-center md:px-6"
          style={{ borderColor: 'var(--kg-line)' }}
        >
          {BENEFITS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex flex-col items-center gap-1.5">
                <Icon className="h-4 w-4" style={{ color: item.color }} />
                <span className="font-serif text-2xl font-bold" style={{ color: item.color }}>
                  <CountUpNumber value={item.value} display={item.display} delay={1.4 + i * 0.12} />
                </span>
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Indicateur de scroll — discret */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
        >
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground/50" />
          </motion.div>
        </motion.div>

        {/* Dégradé de transition */}
        <div className="pointer-events-none absolute inset-x-0 -bottom-1 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>
    </MotionConfig>
  );
}