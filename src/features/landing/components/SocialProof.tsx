import { motion, type Variants } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 50, suffix: '+', label: 'Agences immobilières visées' },
  { value: 30, suffix: '%', label: 'Réduction projetée des impayés' },
  { value: 5, suffix: ' min', label: 'Pour configurer son agence' },
  { value: 100, suffix: '%', label: 'Paiements traçables' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

// Hook local à la feature : anime un chiffre de 0 vers sa valeur cible
function useCountUp(target: number, isInView: boolean, duration = 1200) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isInView) return;

    let frameId: number;

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(eased * target));

      if (progress < 1) frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, target, duration]);

  return value;
}

function StatItem({ stat, isInView }: { stat: Stat; isInView: boolean }) {
  const animatedValue = useCountUp(stat.value, isInView);

  return (
    <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
      <span className="text-3xl font-bold text-foreground md:text-4xl">
        {animatedValue}
        {stat.suffix}
      </span>
      <span className="mt-2 text-sm text-muted-foreground">{stat.label}</span>
    </motion.div>
  );
}

export function SocialProof() {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // ne joue qu'une fois
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="border-y bg-muted/30 py-14">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center text-sm font-medium uppercase tracking-wide text-muted-foreground"
        >
          Objectifs de la première année · KeurGui Pay
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} isInView={isInView} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}