import { motion, type Variants } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Fond décoratif */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_60%)] opacity-[0.08]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="mx-auto max-w-3xl px-4 text-center md:px-6"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Prêt à digitaliser votre recouvrement de loyers ?
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          Rejoignez les agences immobilières qui font confiance à KeurGui Pay
          pour automatiser leurs relances et sécuriser leurs paiements.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/inscription">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Essayer gratuitement
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <Button size="lg" variant="outline">
            Contacter l'équipe
          </Button>
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          Sans carte bancaire · Configuration en 5 minutes · Résiliable à
          tout moment
        </p>
      </motion.div>
    </section>
  );
}