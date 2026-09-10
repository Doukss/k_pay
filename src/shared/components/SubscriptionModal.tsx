import { useState } from 'react';
import { X, Check, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useAgencyStore, type PlanTier } from '@/stores/agencyStore';
import waveLogo from '@/assets/wave.png';
import omLogo from '@/assets/om.png';
import { toast } from 'sonner';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlanId?: PlanTier;
}

export function SubscriptionModal({ isOpen, onClose, defaultPlanId = 'starter' }: SubscriptionModalProps) {
  const { subscription, paySubscription } = useAgencyStore();

  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(defaultPlanId);
  const [selectedMethod, setSelectedMethod] = useState<'Wave' | 'Orange Money'>('Wave');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const PLANS_INFO = [
    {
      id: 'starter' as PlanTier,
      name: 'Starter',
      price: 15000,
      quota: '50 locataires max',
      description: 'Idéal pour démarrer avec un portefeuille réduit.',
    },
    {
      id: 'business' as PlanTier,
      name: 'Business',
      price: 25000,
      quota: '100 locataires max',
      description: 'Pour agences actives avec exports et relances auto.',
      popular: true,
    },
    {
      id: 'pro' as PlanTier,
      name: 'Plan Pro',
      price: 60000,
      quota: 'Locataires illimités',
      description: 'Multi-agents, accès API et accompagnement dédié.',
    },
  ];

  const currentPlanConfig = PLANS_INFO.find((p) => p.id === selectedPlan) || PLANS_INFO[0];

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const res = paySubscription(selectedPlan, selectedMethod);
      if (res.success) {
        toast.success(res.message);
        onClose();
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-xl bg-[#121318] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E5B842] animate-pulse" />
            <div>
              <h2 className="text-base font-bold text-white leading-none">
                Abonnement Agence KërGuiPay
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Régularisation &amp; activation de votre forfait mensuel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Expiry Warning if applicable */}
          {subscription?.status === 'expired' && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <span className="font-bold">
                  {subscription?.monthlyRenewalDue ? 'Renouvellement mensuel requis' : 'Essai gratuit de 30 jours terminé'}
                </span>
                <p className="mt-0.5 text-rose-300/80">
                  {subscription?.monthlyRenewalDue
                    ? "Votre abonnement mensuel de 30 jours est arrivé à échéance. Validez votre paiement pour reconduire votre accès sans interruption."
                    : "Votre période d'essai est écoulée. Sélectionnez votre forfait ci-dessous pour continuer à utiliser la plateforme."}
                </p>
              </div>
            </div>
          )}

          {/* Plan Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              1. Choisissez votre forfait
            </label>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {PLANS_INFO.map((p) => {
                const isSelected = selectedPlan === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`relative p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#E5B842] bg-[#E5B842]/10 shadow-sm'
                        : 'border-white/10 bg-black/40 hover:border-white/20'
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-2 right-2 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-[#E5B842] text-black">
                        Populaire
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{p.name}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-[#E5B842]" />}
                    </div>
                    <p className="text-base font-bold font-mono text-[#E5B842] mt-1.5">
                      {p.price.toLocaleString()}{' '}
                      <span className="text-[10px] text-neutral-400 font-sans font-normal">F/mois</span>
                    </p>
                    <p className="text-[10px] text-neutral-300 font-medium mt-1">{p.quota}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Gateway Selection */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              2. Passerelle de règlement Mobile Money
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Wave */}
              <div
                onClick={() => setSelectedMethod('Wave')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedMethod === 'Wave'
                    ? 'border-sky-500 bg-sky-500/10 ring-1 ring-sky-500/40'
                    : 'border-white/10 bg-black/40 hover:border-white/20'
                }`}
              >
                <div className="h-10 w-10 rounded-lg overflow-hidden bg-[#1DA1F2] p-0.5 shrink-0 flex items-center justify-center">
                  <img src={waveLogo} alt="Wave" className="h-full w-full object-cover rounded-md" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Wave Sénégal</span>
                    {selectedMethod === 'Wave' && <Check className="h-3.5 w-3.5 text-sky-400" />}
                  </div>
                  <span className="text-[11px] text-neutral-400">Débit direct QR code</span>
                </div>
              </div>

              {/* Orange Money */}
              <div
                onClick={() => setSelectedMethod('Orange Money')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedMethod === 'Orange Money'
                    ? 'border-orange-500 bg-orange-500/10 ring-1 ring-orange-500/40'
                    : 'border-white/10 bg-black/40 hover:border-white/20'
                }`}
              >
                <div className="h-10 w-10 rounded-lg overflow-hidden bg-white p-1 shrink-0 flex items-center justify-center">
                  <img src={omLogo} alt="Orange Money" className="h-full w-full object-contain" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Orange Money</span>
                    {selectedMethod === 'Orange Money' && <Check className="h-3.5 w-3.5 text-orange-400" />}
                  </div>
                  <span className="text-[11px] text-neutral-400">Passerelle Webpay</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-neutral-400">
              <span>Forfait sélectionné</span>
              <span className="font-semibold text-white">{currentPlanConfig.name} ({currentPlanConfig.quota})</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Moyen de paiement</span>
              <span className="font-semibold text-white">{selectedMethod}</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Période</span>
              <span className="font-semibold text-white">30 jours</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-sm">
              <span className="font-bold text-white">Total à régler</span>
              <span className="font-bold font-mono text-base text-[#E5B842]">
                {currentPlanConfig.price.toLocaleString()} FCFA
              </span>
            </div>
          </div>

          {/* Security footnote */}
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Transaction cryptée et sécurisée directement par les API officielles {selectedMethod}.</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10 bg-black/40">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isProcessing}
            className="text-xs text-neutral-400 hover:text-white"
          >
            Annuler
          </Button>

          <Button
            size="sm"
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className="bg-[#E5B842] hover:bg-[#cdaf35] text-black font-bold text-xs gap-2 px-5 h-9 shadow-md"
          >
            {isProcessing ? (
              <span>Traitement sécurisé...</span>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Valider {currentPlanConfig.price.toLocaleString()} FCFA via {selectedMethod}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
