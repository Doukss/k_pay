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
  RotateCcw
} from 'lucide-react';
import { useTheme } from '@/shared/context/ThemeContext';
import { useAgencyStore } from '@/stores/agencyStore';
import { toast } from 'sonner';

export default function ParametresPage() {
  const { theme, setTheme } = useTheme();
  const { resetToDemoData } = useAgencyStore();
  const [activeTab, setActiveTab] = useState<'profil' | 'paiement' | 'relances' | 'securite'>('profil');

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
    </div>
  );
}
