import { useState } from 'react';
import { 
  X, 
  User, 
  MapPin, 
  CheckCircle2, 
  Smartphone,
  CreditCard,
  AlertTriangle,
  Sparkles,
  Calendar,
  Check,
  RefreshCw
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import type { AgencyDetail } from '../types';
import { toast } from 'sonner';

interface AgencyDetailModalProps {
  agency: AgencyDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleStatus: (agencyId: string | number) => void;
  onRenewSubscription?: (agencyId: string | number) => void;
}

export function AgencyDetailModal({
  agency,
  isOpen,
  onClose,
  onToggleStatus,
  onRenewSubscription,
}: AgencyDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'apercu' | 'abonnement' | 'passerelles' | 'locataires'>('apercu');

  if (!isOpen || !agency) return null;

  const quotaPercent = Math.min(Math.round((agency.locataires / agency.quota) * 100), 100);

  const handleContactWhatsApp = () => {
    const rawDigits = agency.phone.replace(/\D/g, '');
    const cleanPhone = rawDigits.startsWith('221') ? rawDigits : `221${rawDigits.slice(-9)}`;
    const text = encodeURIComponent(`Bonjour ${agency.responsable}, nous vous contactons depuis l'administration de KeurGui Pay au sujet de votre agence "${agency.name}".`);
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    toast.success(`Ouverture de la discussion WhatsApp avec ${agency.responsable}`);
  };

  const handleContactWhatsAppRenew = () => {
    const rawDigits = agency.phone.replace(/\D/g, '');
    const cleanPhone = rawDigits.startsWith('221') ? rawDigits : `221${rawDigits.slice(-9)}`;
    const text = encodeURIComponent(
      `Bonjour ${agency.responsable}, administration KeurGui Pay. L'abonnement mensuel de votre agence "${agency.name}" (${agency.plan} - ${agency.subscriptionPrice.toLocaleString()} FCFA/mois) est arrivé à terme le ${agency.nextRenewalDate}. Merci de procéder au renouvellement via Wave ou Orange Money pour maintenir l'encaissement actif.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    toast.success(`Relance d'abonnement préparée pour ${agency.responsable}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />
      
      <Card className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#121318] border border-white/10 text-white shadow-2xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header with Agency Branding */}
        <CardHeader className="p-5 border-b border-white/5 bg-gradient-to-r from-rose-500/10 via-[#14151B] to-transparent shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center font-bold text-white text-lg shadow-lg border border-rose-400/20 shrink-0">
                {agency.shortName}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <CardTitle className="text-xl font-bold text-white">{agency.name}</CardTitle>
                  
                  {/* Subscription Compliance Badge */}
                  {agency.subscriptionStatus === 'en_regle' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" /> Abonnement En règle
                    </span>
                  ) : agency.subscriptionStatus === 'essai' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E5B842] bg-[#E5B842]/10 border border-[#E5B842]/20 px-2.5 py-0.5 rounded-full">
                      <Sparkles className="h-3 w-3" /> Essai 30j ({agency.trialDaysRemaining ?? 30}j)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full animate-pulse">
                      <AlertTriangle className="h-3 w-3" /> Renouvellement requis
                    </span>
                  )}

                  {/* Agency Status Badge */}
                  {agency.status === 'active' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Actif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Suspendu
                    </span>
                  )}

                  {/* Plan Badge */}
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                    agency.plan === 'Entreprise' 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                      : agency.plan === 'Plan Pro' || agency.plan === 'Business'
                      ? 'bg-[#E5B842]/10 text-[#E5B842] border-[#E5B842]/20' 
                      : 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                  }`}>
                    {agency.plan}
                  </span>
                </div>
                <CardDescription className="text-xs text-neutral-400 mt-1 flex items-center gap-3 flex-wrap">
                  <span>NINEA : <strong className="text-neutral-300 font-mono">{agency.ninea}</strong></span>
                  <span>•</span>
                  <span>Adhérent depuis le <strong className="text-neutral-300">{agency.dateAdhesion}</strong></span>
                </CardDescription>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="self-end sm:self-auto rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-2 border-t border-white/5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('apercu')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'apercu' 
                  ? 'bg-rose-500 text-white shadow-md' 
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('abonnement')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'abonnement' 
                  ? 'bg-rose-500 text-white shadow-md' 
                  : agency.subscriptionStatus === 'retard'
                  ? 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CreditCard className="h-3.5 w-3.5" /> Abonnement & Échéance
              {agency.subscriptionStatus === 'retard' && (
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('passerelles')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'passerelles' 
                  ? 'bg-rose-500 text-white shadow-md' 
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Passerelles Mobile Money
            </button>
            <button
              onClick={() => setActiveTab('locataires')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'locataires' 
                  ? 'bg-rose-500 text-white shadow-md' 
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Portefeuille Locataires ({agency.locatairesList.length})
            </button>
          </div>
        </CardHeader>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'apercu' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Subscription Status Highlight Banner */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                agency.subscriptionStatus === 'en_regle'
                  ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                  : agency.subscriptionStatus === 'essai'
                  ? 'bg-[#E5B842]/10 border-[#E5B842]/20 text-[#E5B842]'
                  : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center gap-2.5">
                  {agency.subscriptionStatus === 'en_regle' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : agency.subscriptionStatus === 'essai' ? (
                    <Sparkles className="h-4 w-4 text-[#E5B842] shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 animate-pulse" />
                  )}
                  <div>
                    <span className="font-bold text-white">
                      {agency.subscriptionStatus === 'en_regle' && 'Abonnement Mensuel En Règle'}
                      {agency.subscriptionStatus === 'essai' && `Essai Gratuit 30 Jours Actif (${agency.trialDaysRemaining ?? 30} jours restants)`}
                      {agency.subscriptionStatus === 'retard' && 'Renouvellement Mensuel Requis (Échéance Dépassée)'}
                    </span>
                    <span className="text-neutral-400 ml-2">
                      · {agency.subscriptionPrice.toLocaleString()} FCFA/mois (Forfait {agency.plan}) · Échéance : {agency.nextRenewalDate}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('abonnement')}
                  className="text-xs font-semibold underline text-neutral-300 hover:text-white shrink-0"
                >
                  Gérer l'abonnement →
                </button>
              </div>

              {/* Top 4 KPI Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <p className="text-[11px] text-neutral-400 font-medium">Volume Mensuel Géré</p>
                  <p className="text-lg font-bold font-mono text-[#E5B842]">
                    {agency.volumeMensuel.toLocaleString()} F
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <p className="text-[11px] text-neutral-400 font-medium">Taux de Recouvrement</p>
                  <p className="text-lg font-bold font-mono text-emerald-400">
                    {agency.tauxRecouvrement}%
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <p className="text-[11px] text-neutral-400 font-medium">Commissions Plateforme</p>
                  <p className="text-lg font-bold font-mono text-rose-400">
                    {agency.commissionsTotal.toLocaleString()} F
                  </p>
                  <p className="text-[9px] text-neutral-500 font-mono">Taux : {agency.commissionRate}%</p>
                </div>
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <p className="text-[11px] text-neutral-400 font-medium">Quota Locataires</p>
                  <p className="text-lg font-bold font-mono text-white">
                    {agency.locataires} <span className="text-xs text-neutral-500 font-normal">/ {agency.quota}</span>
                  </p>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                    <div 
                      className={`h-full rounded-full ${quotaPercent > 90 ? 'bg-rose-500' : 'bg-[#E5B842]'}`} 
                      style={{ width: `${quotaPercent}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Legal & Contact Info Section */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-rose-400" /> Direction & Contact
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Responsable légal :</span>
                      <span className="font-semibold text-white">{agency.responsable}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Téléphone pro :</span>
                      <span className="font-mono text-neutral-200">{agency.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Email professionnel :</span>
                      <span className="text-neutral-300 truncate max-w-[180px]">{agency.email}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-rose-400" /> Implantation Géographique
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Ville / Région :</span>
                      <span className="font-semibold text-white">{agency.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Adresse du siège :</span>
                      <span className="text-neutral-300 text-right">{agency.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Statut juridique :</span>
                      <span className="text-neutral-300">Agence Immobilière Agréée</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'abonnement' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Compliance status banner */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                agency.subscriptionStatus === 'en_regle'
                  ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                  : agency.subscriptionStatus === 'essai'
                  ? 'bg-[#E5B842]/10 border-[#E5B842]/20 text-[#E5B842]'
                  : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    agency.subscriptionStatus === 'en_regle'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : agency.subscriptionStatus === 'essai'
                      ? 'bg-[#E5B842]/20 text-[#E5B842]'
                      : 'bg-rose-500/20 text-rose-400 animate-pulse'
                  }`}>
                    {agency.subscriptionStatus === 'en_regle' ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : agency.subscriptionStatus === 'essai' ? (
                      <Sparkles className="h-6 w-6" />
                    ) : (
                      <AlertTriangle className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {agency.subscriptionStatus === 'en_regle' && 'Abonnement En Règle (À jour)'}
                      {agency.subscriptionStatus === 'essai' && `Période d'Essai Gratuite (30 jours)`}
                      {agency.subscriptionStatus === 'retard' && 'Renouvellement Mensuel Requis (Échéance Échue)'}
                    </h4>
                    <p className="text-xs text-neutral-300 mt-1">
                      {agency.subscriptionStatus === 'en_regle' && 
                        `L'agence a réglé son forfait mensuel de ${agency.subscriptionPrice.toLocaleString()} FCFA. Toutes les automatisations de relances et d'encaissements sont actives.`}
                      {agency.subscriptionStatus === 'essai' && 
                        `Il reste ${agency.trialDaysRemaining ?? 30} jours d'essai gratuit sur les 30 offerts. À l'issue, un premier paiement de ${agency.subscriptionPrice.toLocaleString()} FCFA sera requis pour continuer.`}
                      {agency.subscriptionStatus === 'retard' && 
                        `L'échéance mensuelle de ${agency.subscriptionPrice.toLocaleString()} FCFA est dépassée depuis le ${agency.nextRenewalDate}. Les services de relance automatique sont temporairement en attente.`}
                    </p>
                  </div>
                </div>

                {/* Direct Action for Admin */}
                <div className="flex sm:flex-col items-center gap-2 shrink-0">
                  {agency.subscriptionStatus !== 'en_regle' ? (
                    <Button
                      type="button"
                      onClick={() => onRenewSubscription?.(agency.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-3 w-full gap-1.5 shadow-sm"
                    >
                      <Check className="h-3.5 w-3.5" /> Valider Paiement (+30j)
                    </Button>
                  ) : (
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                      Cotisation validée
                    </span>
                  )}
                  {agency.subscriptionStatus === 'retard' && (
                    <Button
                      type="button"
                      onClick={handleContactWhatsAppRenew}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs h-9 px-3 w-full gap-1.5 shadow-sm"
                    >
                      <Smartphone className="h-3.5 w-3.5" /> Relancer WhatsApp
                    </Button>
                  )}
                </div>
              </div>

              {/* Subscription Details Grid */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <p className="text-[11px] text-neutral-400 font-medium">Forfait Souscrit</p>
                  <p className="text-base font-bold text-white flex items-center justify-between">
                    <span>{agency.plan}</span>
                    <span className="text-xs font-mono text-[#E5B842]">{agency.subscriptionPrice.toLocaleString()} F/m</span>
                  </p>
                  <p className="text-[10px] text-neutral-500">Plafond : {agency.quota} locataires</p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <p className="text-[11px] text-neutral-400 font-medium">Prochaine Échéance</p>
                  <p className="text-base font-bold font-mono text-white flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-rose-400" />
                    {agency.nextRenewalDate}
                  </p>
                  <p className="text-[10px] text-neutral-500">Renouvellement chaque mois</p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <p className="text-[11px] text-neutral-400 font-medium">Dernier Règlement Enregistré</p>
                  <p className="text-base font-bold font-mono text-white">
                    {agency.lastPaymentDate || 'Période d\'essai en cours'}
                  </p>
                  <p className="text-[10px] text-neutral-500 flex items-center gap-1">
                    Passerelle : <span className="font-semibold text-neutral-300">{agency.paymentGateway || (agency.subscriptionStatus === 'essai' ? 'Essai gratuit 30j' : 'Mobile Money')}</span>
                  </p>
                </div>
              </div>

              {/* Subscription Rules Notice */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-xs text-neutral-400 space-y-2">
                <h5 className="font-semibold text-white flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5 text-neutral-400" /> Règles de Conformité des Abonnements
                </h5>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-neutral-400">
                  <li>Chaque agence cliente doit renouveler son forfait tous les mois pour maintenir l'encaissement actif.</li>
                  <li>L'essai gratuit de 30 jours est strictement réservé aux 30 premiers jours d'adhésion : une agence ayant déjà consommé son essai ne peut plus en bénéficier.</li>
                  <li>En tant que Super Administrateur, vous pouvez à tout moment enregistrer une régularisation de paiement manuel ou relancer l'agence par WhatsApp.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'passerelles' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <p className="text-xs text-neutral-400">
                État des passerelles de recouvrement automatique configurées par cette agence :
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                {/* Wave Gateway */}
                <div className="p-4 rounded-xl bg-black/40 border border-[#1da1f2]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-8 rounded-lg bg-[#1da1f2]/20 flex items-center justify-center text-[#1da1f2] font-black text-sm">
                      W
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" /> Opérationnel
                    </span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">Wave Sénégal</h5>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Recouvrement 1-Clic direct</p>
                  </div>
                  <div className="pt-2 border-t border-white/5 text-[11px] space-y-1">
                    <div className="flex justify-between text-neutral-400">
                      <span>ID Marchand :</span>
                      <span className="font-mono text-neutral-200">{agency.gateways.wave.merchantId || 'WV-DKR-892'}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Webhook :</span>
                      <span className="text-emerald-400 font-semibold">Synchronisé</span>
                    </div>
                  </div>
                </div>

                {/* Orange Money Gateway */}
                <div className="p-4 rounded-xl bg-black/40 border border-[#ff7900]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-8 rounded-lg bg-[#ff7900]/20 flex items-center justify-center text-[#ff7900] font-black text-sm">
                      OM
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" /> Opérationnel
                    </span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">Orange Money</h5>
                    <p className="text-[11px] text-neutral-400 mt-0.5">USSD #144# & App Maxit</p>
                  </div>
                  <div className="pt-2 border-t border-white/5 text-[11px] space-y-1">
                    <div className="flex justify-between text-neutral-400">
                      <span>Compte OM :</span>
                      <span className="font-mono text-neutral-200">{agency.gateways.orangeMoney.merchantNumber || '+221 77 000 00 00'}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Agrément OM :</span>
                      <span className="text-emerald-400 font-semibold">Certifié</span>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Cloud Gateway */}
                <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-sm">
                      WA
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" /> Connecté
                    </span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">WhatsApp Business</h5>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Relances automatiques</p>
                  </div>
                  <div className="pt-2 border-t border-white/5 text-[11px] space-y-1">
                    <div className="flex justify-between text-neutral-400">
                      <span>Expéditeur :</span>
                      <span className="font-mono text-neutral-200">{agency.phone}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Lien Mobile :</span>
                      <span className="text-emerald-400 font-semibold">Actif</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'locataires' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Échantillon des locataires gérés par {agency.name} :</span>
                <span className="font-semibold text-white font-mono">{agency.locatairesList.length} résidents enregistrés</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/30">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-neutral-400 font-medium bg-black/40">
                      <th className="p-3">Locataire</th>
                      <th className="p-3">Logement</th>
                      <th className="p-3">Loyer mensuel</th>
                      <th className="p-3">Téléphone</th>
                      <th className="p-3 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {agency.locatairesList.map((tenant) => (
                      <tr key={tenant.id} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-semibold text-white">{tenant.name}</td>
                        <td className="p-3 text-neutral-300">{tenant.property}</td>
                        <td className="p-3 font-mono text-[#E5B842] font-semibold">{tenant.rentVal.toLocaleString()} F</td>
                        <td className="p-3 font-mono text-neutral-400">{tenant.phone}</td>
                        <td className="p-3 text-right">
                          {tenant.status === 'paid' ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                              À jour
                            </span>
                          ) : tenant.status === 'pending' ? (
                            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-[#E5B842]">
                              En attente
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400">
                              En retard
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 border-t border-white/5 bg-black/30 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              onClick={handleContactWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-3 gap-1.5 shadow-sm w-full sm:w-auto"
            >
              <Smartphone className="h-3.5 w-3.5" /> WhatsApp
            </Button>
            {agency.subscriptionStatus !== 'en_regle' && onRenewSubscription && (
              <Button
                type="button"
                onClick={() => onRenewSubscription(agency.id)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs h-9 px-3 gap-1.5 shadow-sm w-full sm:w-auto"
              >
                <Check className="h-3.5 w-3.5" /> Régulariser Abonnement (+30j)
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => onToggleStatus(agency.id)}
              className={agency.status === 'active' 
                ? "bg-rose-950/20 border-rose-500/20 text-rose-400 hover:bg-rose-950/40 text-xs h-9 px-3 w-full sm:w-auto"
                : "bg-emerald-950/20 border-emerald-500/20 text-emerald-400 hover:bg-emerald-950/40 text-xs h-9 px-3 w-full sm:w-auto"
              }
            >
              {agency.status === 'active' ? 'Suspendre' : 'Réactiver'}
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-black/40 border-white/10 text-neutral-300 hover:bg-neutral-800 text-xs h-9 px-4 w-full sm:w-auto"
          >
            Fermer
          </Button>
        </div>
      </Card>
    </div>
  );
}
