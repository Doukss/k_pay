import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { 
  Building2, 
  CreditCard, 
  BellRing, 
  ShieldCheck, 
  Save, 
  Smartphone, 
  ToggleLeft, 
  ToggleRight,
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  Check,
  AlertCircle,
  RefreshCw,
  FileText,
  Download,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '@/shared/context/ThemeContext';
import { useAgencyStore, type PlanTier } from '@/stores/agencyStore';
import { SubscriptionModal } from '@/shared/components/SubscriptionModal';
import { toast } from 'sonner';

export default function ParametresPage() {
  const { theme, setTheme } = useTheme();
  const { 
    locataires, 
    subscription, 
    simulateTrialExpiry, 
    simulateMonthlyExpiry,
    resetTrialTo30Days, 
    renewSubscription,
    toggleAutoRenew,
    resetToDemoData 
  } = useAgencyStore();
  const [activeTab, setActiveTab] = useState<'profil' | 'paiement' | 'relances' | 'abonnement' | 'securite'>('profil');
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [selectedPlanToUpgrade, setSelectedPlanToUpgrade] = useState<PlanTier>('starter');

  // Agency profile state
  const [agencyName, setAgencyName] = useState('Cabinet Immobilier immo221');
  const [contactName, setContactName] = useState('Malick Mbodji');
  const [phone, setPhone] = useState('+221 33 821 44 00');
  const [email, setEmail] = useState('contact@immo221.sn');
  const [address, setAddress] = useState('24 Avenue Hassan II, Dakar Plateau');
  const [ninea, setNinea] = useState('008472910 2V3');

  // Gateways State
  const [waveActive, setWaveActive] = useState(true);
  const [omActive, setOmActive] = useState(true);
  const [feeBearer, setFeeBearer] = useState<'agency' | 'tenant'>('agency');

  // Reminder rules State
  const [remindJMinus3, setRemindJMinus3] = useState(true);
  const [remindJDay, setRemindJDay] = useState(true);
  const [remindJPlus3, setRemindJPlus3] = useState(true);
  const [remindLanguage, setRemindLanguage] = useState<'fr' | 'wo' | 'bilingual'>('bilingual');

  // Security state
  const [twoFactor, setTwoFactor] = useState(true);

  const handleSave = () => {
    toast.success('Paramètres enregistrés avec succès !', {
      description: 'Vos configurations sont immédiatement prises en compte.',
    });
  };

  return (
    <div className="space-y-8 bg-[#0A0A0C] text-neutral-200 min-h-screen">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5B842]">
            Configuration Agence
          </span>
          <h1 
            className="text-3xl md:text-4xl font-normal text-white mt-1"
            style={{ fontFamily: 'Georgia, ui-serif, serif' }}
          >
            Paramètres Généraux
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Personnalisez vos coordonnées, vos passerelles Mobile Money et vos scénarios d'alerte.
          </p>
        </div>

        <Button 
          onClick={handleSave}
          className="bg-[#E5B842] hover:bg-[#cdaf35] text-black font-bold gap-2 px-5 self-start md:self-auto shadow-md"
        >
          <Save className="h-4 w-4" /> Enregistrer les modifications
        </Button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto text-sm">
        <button
          onClick={() => setActiveTab('profil')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'profil' 
              ? 'bg-[#E5B842]/10 text-[#E5B842] border border-[#E5B842]/30 font-semibold' 
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Building2 className="h-4 w-4" /> Profil Agence
        </button>

        <button
          onClick={() => setActiveTab('paiement')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'paiement' 
              ? 'bg-[#E5B842]/10 text-[#E5B842] border border-[#E5B842]/30 font-semibold' 
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <CreditCard className="h-4 w-4" /> Passerelles de Paiement
        </button>

        <button
          onClick={() => setActiveTab('relances')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'relances' 
              ? 'bg-[#E5B842]/10 text-[#E5B842] border border-[#E5B842]/30 font-semibold' 
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BellRing className="h-4 w-4" /> Scénarios de Relances
        </button>

        <button
          onClick={() => setActiveTab('abonnement')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'abonnement' 
              ? 'bg-[#E5B842]/10 text-[#E5B842] border border-[#E5B842]/30 font-semibold' 
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="h-4 w-4" /> Abonnement &amp; Forfait
        </button>

        <button
          onClick={() => setActiveTab('securite')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'securite' 
              ? 'bg-[#E5B842]/10 text-[#E5B842] border border-[#E5B842]/30 font-semibold' 
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldCheck className="h-4 w-4" /> Sécurité &amp; Accès
        </button>
      </div>

      {/* Tab 1: Profil Agence */}
      {activeTab === 'profil' && (
        <Card className="bg-[#121318] border-white/5 text-white">
          <CardHeader>
            <CardTitle>Identité du Cabinet / Agence</CardTitle>
            <CardDescription className="text-neutral-400">
              Ces informations apparaîtront sur les quittances certifiées générées pour vos locataires.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Raison Sociale</label>
                <input 
                  type="text" 
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E5B842]/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Nom du Gérant / Responsable</label>
                <input 
                  type="text" 
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E5B842]/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Téléphone Professionnel</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E5B842]/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Email Administratif</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E5B842]/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Adresse du Siège</label>
                <input 
                  type="text" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E5B842]/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Numéro NINEA / RCCM</label>
                <input 
                  type="text" 
                  value={ninea}
                  onChange={(e) => setNinea(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E5B842]/40"
                />
              </div>
            </div>

            {/* Apparence du Thème */}
            <div className="pt-6 border-t border-white/5 space-y-3">
              <div>
                <p className="text-sm font-bold text-white">Apparence de l'interface (Thème)</p>
                <p className="text-xs text-neutral-400">Basculez entre le mode sombre or feutré et le mode clair lumineux.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md pt-1">
                {/* Sombre */}
                <div 
                  onClick={() => {
                    setTheme('dark');
                    toast.info('Mode sombre activé');
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                    theme === 'dark' 
                      ? 'border-[#E5B842] bg-[#E5B842]/10 ring-1 ring-[#E5B842]' 
                      : 'border-white/5 bg-black/30 hover:border-white/20'
                  }`}
                >
                  <div className="h-9 w-9 rounded-lg bg-black border border-white/10 flex items-center justify-center text-[#E5B842]">
                    <Moon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Mode Sombre</p>
                    <p className="text-[10px] text-neutral-400">Or feutré (Recommandé)</p>
                  </div>
                </div>

                {/* Clair */}
                <div 
                  onClick={() => {
                    setTheme('light');
                    toast.info('Mode clair activé');
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                    theme === 'light' 
                      ? 'border-[#E5B842] bg-[#E5B842]/10 ring-1 ring-[#E5B842]' 
                      : 'border-white/5 bg-black/30 hover:border-white/20'
                  }`}
                >
                  <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-amber-500">
                    <Sun className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Mode Clair</p>
                    <p className="text-[10px] text-neutral-400">Design épuré lumineux</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Passerelles de Paiement */}
      {activeTab === 'paiement' && (
        <div className="space-y-6">
          <Card className="bg-[#121318] border-white/5 text-white">
            <CardHeader>
              <CardTitle>Passerelles Mobile Money (Sénégal)</CardTitle>
              <CardDescription className="text-neutral-400">
                Activez les modes de règlements autorisés pour vos locataires.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Wave */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center font-bold text-sky-400">
                    W
                  </div>
                  <div>
                    <p className="font-semibold text-white">Wave Sénégal (Compte Marchand)</p>
                    <p className="text-xs text-neutral-400">Paiement instantané avec QR Code ou lien direct 1%</p>
                  </div>
                </div>
                <button 
                  onClick={() => setWaveActive(!waveActive)}
                  className="text-[#E5B842] hover:opacity-80 transition-opacity"
                >
                  {waveActive ? <ToggleRight className="h-8 w-8 text-[#E5B842]" /> : <ToggleLeft className="h-8 w-8 text-neutral-600" />}
                </button>
              </div>

              {/* Orange Money */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-bold text-orange-400">
                    OM
                  </div>
                  <div>
                    <p className="font-semibold text-white">Orange Money Sénégal (API Sonatel)</p>
                    <p className="text-xs text-neutral-400">Paiement via USSD #144# ou application Max it</p>
                  </div>
                </div>
                <button 
                  onClick={() => setOmActive(!omActive)}
                  className="text-[#E5B842] hover:opacity-80 transition-opacity"
                >
                  {omActive ? <ToggleRight className="h-8 w-8 text-[#E5B842]" /> : <ToggleLeft className="h-8 w-8 text-neutral-600" />}
                </button>
              </div>

              {/* Fee bearer */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Prise en charge des frais de transaction (1%) :</label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                    <input 
                      type="radio" 
                      name="feeBearer" 
                      checked={feeBearer === 'agency'} 
                      onChange={() => setFeeBearer('agency')}
                      className="accent-[#E5B842]"
                    />
                    Pris en charge par l'agence (Recommandé pour inciter au paiement en ligne)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                    <input 
                      type="radio" 
                      name="feeBearer" 
                      checked={feeBearer === 'tenant'} 
                      onChange={() => setFeeBearer('tenant')}
                      className="accent-[#E5B842]"
                    />
                    Facturé en supplément au locataire
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 3: Scénarios de Relances */}
      {activeTab === 'relances' && (
        <Card className="bg-[#121318] border-white/5 text-white">
          <CardHeader>
            <CardTitle>Automatisation des Rappels &amp; Relances</CardTitle>
            <CardDescription className="text-neutral-400">
              Définissez la fréquence et le canal des alertes automatiques envoyées à vos locataires.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-white/5">
                <div>
                  <p className="font-semibold text-white text-sm">Rappel Préventif (3 jours avant l'échéance)</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Envoi d'un SMS discret avec le montant à prévoir</p>
                </div>
                <button onClick={() => setRemindJMinus3(!remindJMinus3)}>
                  {remindJMinus3 ? <ToggleRight className="h-7 w-7 text-[#E5B842]" /> : <ToggleLeft className="h-7 w-7 text-neutral-600" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-white/5">
                <div>
                  <p className="font-semibold text-white text-sm">Rappel Jour J (Date d'échéance du loyer)</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Envoi d'un WhatsApp avec le lien direct de paiement Mobile Money</p>
                </div>
                <button onClick={() => setRemindJDay(!remindJDay)}>
                  {remindJDay ? <ToggleRight className="h-7 w-7 text-[#E5B842]" /> : <ToggleLeft className="h-7 w-7 text-neutral-600" />}
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/30 border border-white/5">
                <div>
                  <p className="font-semibold text-white text-sm">Relance de Retard (3 jours après échéance)</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Notification de dépassement d'échéance par SMS et WhatsApp</p>
                </div>
                <button onClick={() => setRemindJPlus3(!remindJPlus3)}>
                  {remindJPlus3 ? <ToggleRight className="h-7 w-7 text-[#E5B842]" /> : <ToggleLeft className="h-7 w-7 text-neutral-600" />}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2">
              <label className="text-xs font-semibold text-neutral-300">Langue des messages de relance :</label>
              <select 
                value={remindLanguage}
                onChange={(e: any) => setRemindLanguage(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E5B842]/40 cursor-pointer"
              >
                <option value="bilingual">Français &amp; Wolof (Recommandé pour un taux de réponse maximal)</option>
                <option value="fr">Français uniquement</option>
                <option value="wo">Wolof uniquement</option>
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Sécurité */}
      {activeTab === 'securite' && (
        <Card className="bg-[#121318] border-white/5 text-white">
          <CardHeader>
            <CardTitle>Sécurité du Compte &amp; Sessions</CardTitle>
            <CardDescription className="text-neutral-400">
              Protégez les données financières de votre agence.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-black/30 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Authentification à Deux Facteurs (2FA)</p>
                  <p className="text-xs text-neutral-400">Code de validation envoyé par SMS à chaque nouvelle connexion</p>
                </div>
              </div>
              <button onClick={() => setTwoFactor(!twoFactor)}>
                {twoFactor ? <ToggleRight className="h-8 w-8 text-[#E5B842]" /> : <ToggleLeft className="h-8 w-8 text-neutral-600" />}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">Mot de passe de l'agence</p>
                <p className="text-xs text-neutral-400">Dernière modification il y a 2 mois</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast.info('Un lien de réinitialisation sécurisé a été envoyé à votre adresse email')}
                className="bg-black/30 border-white/10 text-xs text-neutral-300 hover:bg-neutral-800"
              >
                Changer le mot de passe
              </Button>
            </div>

            {/* Demo Reset Card for Defense presentation */}
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-rose-400 flex items-center gap-1.5">
                  <RotateCcw className="h-4 w-4" /> Mode Démonstration &amp; Soutenance
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Réinitialise instantanément les locataires, encaissements et activités aux données de démo par défaut.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  resetToDemoData();
                  toast.success('Données de démonstration réinitialisées avec succès !');
                }}
                className="bg-rose-950/30 border-rose-500/30 text-xs text-rose-300 hover:bg-rose-950/60 shrink-0 gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Réinitialiser les données
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 5: Abonnement & Forfaits */}
      {activeTab === 'abonnement' && (
        <div className="space-y-6">
          {/* Current Subscription Status Card */}
          <Card className="bg-[#121318] border-white/5 text-white">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-white/5 gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#E5B842]" />
                  Forfait Actuel &amp; Suivi d'Abonnement
                </CardTitle>
                <CardDescription className="text-neutral-400 mt-1">
                  Détails de votre formule, consommation du quota de locataires et statut de l'essai gratuit.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {subscription?.status === 'expired' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Essai 30 Jours Expiré
                  </span>
                ) : subscription?.isTrial ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-[#E5B842] border border-[#E5B842]/30">
                    <Sparkles className="h-3.5 w-3.5" />
                    Essai Gratuit 30 Jours ({subscription?.trialDaysRemaining}j restants)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <Check className="h-3.5 w-3.5" />
                    Abonnement Actif
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Expiry Banner if applicable */}
              {subscription?.status === 'expired' && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-rose-300 text-sm">Votre période d'essai gratuit de 30 jours est terminée</p>
                    <p className="text-neutral-300 mt-0.5">
                      Pour continuer à encaisser vos loyers via Wave / Orange Money et accéder à vos quittances, activez votre forfait mensuel dès maintenant.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedPlanToUpgrade(subscription?.planId || 'starter');
                      setIsSubscriptionModalOpen(true);
                    }}
                    className="bg-[#E5B842] hover:bg-[#cdaf35] text-black font-bold text-xs h-9 px-4 shrink-0 shadow-md"
                  >
                    Activer mon forfait (Wave / OM)
                  </Button>
                </div>
              )}

              {/* Grid with Key Metrics */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[11px] uppercase font-semibold text-neutral-400">Forfait Souscrit</span>
                  <p className="text-xl font-bold text-white">{subscription?.planName || 'Starter (50 locataires)'}</p>
                  <p className="text-xs text-[#E5B842] font-mono font-semibold">
                    {subscription?.price ? subscription.price.toLocaleString() : '15 000'} FCFA / mois
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[11px] uppercase font-semibold text-neutral-400">Quota de Locataires</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-mono text-white">{locataires.length}</span>
                    <span className="text-xs text-neutral-400">/ {subscription?.maxTenants || 50} autorisés</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-2">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        locataires.length >= (subscription?.maxTenants || 50) ? 'bg-rose-500' : 'bg-[#E5B842]'
                      }`}
                      style={{ width: `${Math.min(100, Math.round((locataires.length / (subscription?.maxTenants || 50)) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[11px] uppercase font-semibold text-neutral-400">Période &amp; Échéance</span>
                  {subscription?.isTrial ? (
                    <div>
                      <p className="text-xl font-bold text-[#E5B842]">{subscription.trialDaysRemaining} jours</p>
                      <p className="text-xs text-neutral-400">Fin de l'essai : {subscription.trialExpiresAt || '04 Oct. 2026'}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xl font-bold text-emerald-400">Payé ({subscription?.paymentMethod || 'Wave'})</p>
                      <p className="text-xs text-neutral-400">Prochain prélèvement : {subscription?.nextBillingDate || '10 Oct. 2026'}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Single Use Trial Rule Card */}
              <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E5B842] flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    Politique de l'Essai Gratuit de 30 Jours
                  </span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                    subscription?.trialAlreadyUsed 
                      ? 'bg-neutral-800 text-neutral-400 border border-white/10' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {subscription?.trialAlreadyUsed ? 'Essai gratuit consommé' : 'Essai gratuit actif'}
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  L'offre d'essai gratuit de 30 jours sans engagement est valable pour les forfaits <strong>15 000 FCFA (50 locataires)</strong> et <strong>25 000 FCFA (100 locataires)</strong>.
                </p>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-[11px] text-neutral-400 flex items-start gap-2">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Règle stricte d'unicité :</strong> Une agence qui a déjà utilisé son essai gratuit de 30 jours ne peut plus en bénéficier une seconde fois. Tout renouvellement ou changement de formule s'effectue ensuite par abonnement payant standard.
                  </span>
                </div>
              </div>

              {/* Monthly Renewal Cycle Card */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E5B842] flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Cycle de Renouvellement Mensuel (30 Jours)
                    </span>
                    <p className="text-xs text-neutral-300">
                      Chaque agence renouvelle son abonnement mensuel à l'issue de chaque mois (cycle de 30 jours) via Wave ou Orange Money.
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold self-start sm:self-auto ${
                    subscription?.status === 'expired'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {subscription?.status === 'expired' ? 'Échéance atteinte - Renouvellement requis' : 'Mensualité en cours'}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Dernier Paiement</span>
                    <span className="text-sm font-bold text-white mt-1 block">
                      {subscription?.lastPaymentDate || '04 Août 2026'}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Par {subscription?.paymentMethod || 'Wave'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Prochaine Échéance</span>
                    <span className="text-sm font-bold text-[#E5B842] mt-1 block">
                      {subscription?.nextBillingDate || '04 Oct. 2026'}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Cycle de 30 jours
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Tarif Mensuel</span>
                    <span className="text-sm font-bold font-mono text-white mt-1 block">
                      {(subscription?.price || 15000).toLocaleString()} FCFA
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Quota : {subscription?.maxTenants || 50} locataires
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Reconduction Automatique</span>
                      <span className="text-xs font-semibold text-neutral-200 mt-1 block">
                        {subscription?.autoRenew ?? true ? 'Active (Recommandé)' : 'Manuelle'}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        toggleAutoRenew();
                        toast.info(`Reconduction automatique ${!(subscription?.autoRenew ?? true) ? 'activée' : 'désactivée'}`);
                      }}
                      className="text-[11px] text-[#E5B842] hover:underline text-left mt-2 flex items-center gap-1 font-medium"
                    >
                      <RefreshCw className="h-3 w-3" /> Changer l'option
                    </button>
                  </div>
                </div>

                {/* Quick Action Banner */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#E5B842]/5 border border-[#E5B842]/20 p-3 rounded-xl">
                  <div className="text-xs text-neutral-300">
                    <p className="font-semibold text-white">Renouvellement mensuel de votre forfait d'agence</p>
                    <p className="text-neutral-400 text-[11px]">Réglez par Wave ou Orange Money instantanément avec génération de quittance certifiée.</p>
                  </div>
                  <Button
                    onClick={() => {
                      const res = renewSubscription(subscription?.paymentMethod || 'Wave');
                      if (res.success) {
                        toast.success(res.message);
                      }
                    }}
                    className="bg-[#E5B842] hover:bg-[#cdaf35] text-black font-bold text-xs h-9 px-4 shrink-0 shadow-md flex items-center gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Renouveler pour ce mois ({(subscription?.price || 15000).toLocaleString()} F)
                  </Button>
                </div>
              </div>

              {/* Agency Subscription Invoices History */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#E5B842]" />
                    Historique des Factures &amp; Quittances Mensuelles de l'Agence
                  </h3>
                  <span className="text-xs text-neutral-400">
                    {(subscription?.invoices || []).length} quittance{(subscription?.invoices || []).length > 1 ? 's' : ''} d'abonnement
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-white/5 border-b border-white/5 text-neutral-400 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="px-4 py-3">Réf. Quittance</th>
                          <th className="px-4 py-3">Période Mensuelle</th>
                          <th className="px-4 py-3">Montant Réglé</th>
                          <th className="px-4 py-3">Passerelle</th>
                          <th className="px-4 py-3">Date d'encaissement</th>
                          <th className="px-4 py-3">Statut</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {(subscription?.invoices || []).length > 0 ? (
                          (subscription?.invoices || []).map((inv) => (
                            <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-4 py-3 font-mono font-bold text-[#E5B842]">
                                {inv.reference || inv.id}
                              </td>
                              <td className="px-4 py-3 font-semibold text-white">
                                {inv.month}
                              </td>
                              <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                                {inv.amount.toLocaleString()} FCFA
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  inv.paymentMethod === 'Wave'
                                    ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                }`}>
                                  {inv.paymentMethod}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-neutral-400">
                                {inv.date}
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                  <CheckCircle2 className="h-3 w-3" /> Payé
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    toast.success(`Quittance ${inv.reference || inv.id} téléchargée`, {
                                      description: `Reçu mensuel de ${inv.amount.toLocaleString()} FCFA pour ${inv.month} (Paiement certifié KërGuiPay)`,
                                    });
                                  }}
                                  className="h-7 px-2.5 text-[11px] text-neutral-300 hover:text-white hover:bg-white/10"
                                >
                                  <Download className="h-3 w-3 mr-1 text-[#E5B842]" />
                                  Quittance PDF
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-4 py-6 text-center text-neutral-500">
                              Aucune quittance mensuelle enregistrée pour l'instant.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Plans Comparison & Upgrade Grid */}
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Changer de forfait ou activer le paiement
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Plan Starter */}
                  <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                    subscription?.planId === 'starter' 
                      ? 'border-[#E5B842] bg-[#E5B842]/5 shadow-md' 
                      : 'border-white/10 bg-black/40 hover:border-white/20'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">Starter</span>
                        {subscription?.planId === 'starter' && (
                          <span className="text-[10px] bg-[#E5B842] text-black font-bold px-2 py-0.5 rounded-full">
                            Actuel
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-bold font-mono text-[#E5B842]">
                        15 000 <span className="text-xs text-neutral-400 font-normal">F/mois</span>
                      </p>
                      <p className="text-xs font-semibold text-neutral-300">Jusqu'à 50 locataires max</p>
                      <ul className="text-xs text-neutral-400 space-y-1.5 pt-2">
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#E5B842]" /> 50 locataires max</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#E5B842]" /> Passerelles Wave &amp; OM</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#E5B842]" /> Relances WhatsApp</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#E5B842]" /> Quittances PDF certifiées</li>
                      </ul>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedPlanToUpgrade('starter');
                        setIsSubscriptionModalOpen(true);
                      }}
                      className={`w-full text-xs font-bold ${
                        subscription?.planId === 'starter' && subscription?.status === 'active'
                          ? 'bg-white/10 hover:bg-white/20 text-white'
                          : 'bg-[#E5B842] hover:bg-[#cdaf35] text-black'
                      }`}
                    >
                      {subscription?.planId === 'starter' && subscription?.status === 'active'
                        ? 'Forfait Déjà Actif'
                        : 'Payer / Activer 15 000 F'}
                    </Button>
                  </div>

                  {/* Plan Business */}
                  <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 relative ${
                    subscription?.planId === 'business' 
                      ? 'border-[#E5B842] bg-[#E5B842]/5 shadow-md' 
                      : 'border-white/10 bg-black/40 hover:border-white/20'
                  }`}>
                    <span className="absolute -top-2.5 right-4 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E5B842] text-black">
                      Recommandé
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">Business</span>
                        {subscription?.planId === 'business' && (
                          <span className="text-[10px] bg-[#E5B842] text-black font-bold px-2 py-0.5 rounded-full">
                            Actuel
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-bold font-mono text-[#E5B842]">
                        25 000 <span className="text-xs text-neutral-400 font-normal">F/mois</span>
                      </p>
                      <p className="text-xs font-semibold text-neutral-300">Jusqu'à 100 locataires max</p>
                      <ul className="text-xs text-neutral-400 space-y-1.5 pt-2">
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#E5B842]" /> 100 locataires max</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#E5B842]" /> Scénarios automatiques par lots</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#E5B842]" /> Exports comptables Excel</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#E5B842]" /> Support prioritaire 7j/7</li>
                      </ul>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedPlanToUpgrade('business');
                        setIsSubscriptionModalOpen(true);
                      }}
                      className={`w-full text-xs font-bold ${
                        subscription?.planId === 'business' && subscription?.status === 'active'
                          ? 'bg-white/10 hover:bg-white/20 text-white'
                          : 'bg-[#E5B842] hover:bg-[#cdaf35] text-black'
                      }`}
                    >
                      {subscription?.planId === 'business' && subscription?.status === 'active'
                        ? 'Forfait Déjà Actif'
                        : 'Payer / Activer 25 000 F'}
                    </Button>
                  </div>

                  {/* Plan Pro */}
                  <div className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                    subscription?.planId === 'pro' 
                      ? 'border-[#E5B842] bg-[#E5B842]/5 shadow-md' 
                      : 'border-white/10 bg-black/40 hover:border-white/20'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">Plan Pro</span>
                        {subscription?.planId === 'pro' && (
                          <span className="text-[10px] bg-[#E5B842] text-black font-bold px-2 py-0.5 rounded-full">
                            Actuel
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-bold font-mono text-[#E5B842]">
                        60 000 <span className="text-xs text-neutral-400 font-normal">F/mois</span>
                      </p>
                      <p className="text-xs font-semibold text-neutral-300">Locataires illimités</p>
                      <ul className="text-xs text-neutral-400 space-y-1.5 pt-2">
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#E5B842]" /> Locataires &amp; biens illimités</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#E5B842]" /> Multi-agences &amp; multi-utilisateurs</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#E5B842]" /> Passerelles dédiées &amp; API</li>
                        <li className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#E5B842]" /> Accompagnement VIP dédié</li>
                      </ul>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedPlanToUpgrade('pro');
                        setIsSubscriptionModalOpen(true);
                      }}
                      className={`w-full text-xs font-bold ${
                        subscription?.planId === 'pro' && subscription?.status === 'active'
                          ? 'bg-white/10 hover:bg-white/20 text-white'
                          : 'bg-[#E5B842] hover:bg-[#cdaf35] text-black'
                      }`}
                    >
                      {subscription?.planId === 'pro' && subscription?.status === 'active'
                        ? 'Forfait Déjà Actif'
                        : 'Payer / Activer Plan Pro'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Soutenance Demo Simulation Card */}
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#E5B842] flex items-center gap-1.5 text-xs">
                    <Sparkles className="h-4 w-4" /> Outils Démonstration Soutenance (Essai &amp; Renouvellement)
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Permet de simuler instantanément la fin des 30 jours d'essai gratuit ou la fin de mois nécessitant le renouvellement par Wave / Orange Money.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      simulateTrialExpiry();
                      toast.warning('Simulation : Essai de 30 jours expiré ! La plateforme invite maintenant au paiement.');
                    }}
                    className="bg-amber-950/30 border-amber-500/30 text-xs text-amber-300 hover:bg-amber-950/60"
                  >
                    Simuler fin d'essai (0j)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      simulateMonthlyExpiry();
                      toast.warning("Simulation : Échéance du mois atteinte (30 jours) ! Renouvellement de l'abonnement requis.");
                    }}
                    className="bg-rose-950/30 border-rose-500/30 text-xs text-rose-300 hover:bg-rose-950/60"
                  >
                    Simuler fin de mois (30j)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      resetTrialTo30Days();
                      toast.success('Forfait réinitialisé pour 30 jours (Mode démo)');
                    }}
                    className="bg-white/5 border-white/10 text-xs text-neutral-300 hover:bg-white/10"
                  >
                    Rétablir 30j
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscription Modal for Payment / Upgrade */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        defaultPlanId={selectedPlanToUpgrade}
      />
    </div>
  );
}
