import { useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  ChevronRight, 
  Sparkles,
  Smartphone,
  Lock,
  Building,
  User,
  Calendar
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { QuittanceModal } from '@/shared/components/QuittanceModal';
import { useAgencyStore } from '@/stores/agencyStore';
import { toast } from 'sonner';

export default function PaiementPage() {
  const { token } = useParams<{ token?: string }>();
  const [searchParams] = useSearchParams();
  const tenantIdParam = searchParams.get('tenantId') || searchParams.get('id') || token;

  const { locataires, encaisserLoyer } = useAgencyStore();

  const [selectedMethod, setSelectedMethod] = useState<'wave' | 'om'>('wave');
  const [isProcessing, setIsProcessing] = useState(false);
  const [justPaid, setJustPaid] = useState(false);
  const [isQuittanceOpen, setIsQuittanceOpen] = useState(false);

  // Find tenant by ID, or fallback to first tenant if not found
  const tenant = useMemo(() => {
    if (tenantIdParam) {
      const parsedId = parseInt(tenantIdParam.replace('KP-', ''), 10);
      const found = locataires.find(l => l.id === parsedId || l.id.toString() === tenantIdParam);
      if (found) return found;
    }
    return locataires[0] || {
      id: 1,
      name: 'Mame Diop',
      email: 'mame.diop@email.sn',
      phone: '+221 77 123 45 67',
      property: 'Appartement 2A',
      rentVal: 250000,
      status: 'late',
      delayDays: 0,
      createdAt: '12 Août 2026 à 09:15',
    };
  }, [locataires, tenantIdParam]);

  const [phoneNumber, setPhoneNumber] = useState(tenant.phone.replace('+221', '').trim());

  const isAlreadyPaid = tenant.status === 'paid' && !justPaid;
  const isPaidView = isAlreadyPaid || justPaid;

  const reference = `KP-${tenant.id.toString().padStart(4, '0')}-SN`;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setJustPaid(true);
      encaisserLoyer(tenant.id);
      toast.success(`Paiement de ${tenant.rentVal.toLocaleString()} FCFA validé avec succès par ${selectedMethod === 'wave' ? 'Wave' : 'Orange Money'} !`, {
        description: 'Votre quittance de loyer officielle et certifiée est disponible.',
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#07080A] text-neutral-100 flex flex-col justify-between font-sans">
      {/* Top Mobile Bar */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0E0F14]/90 backdrop-blur-md py-3.5 px-4 sm:px-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-decoration-none">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#E5B842] to-[#B38926] flex items-center justify-center font-bold text-black text-sm shadow-md">
              K
            </span>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-[#E5B842]">KërGui</span>
              <span className="text-white">Pay</span>
            </span>
          </Link>

          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Sécurisé SSL</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 sm:p-5 my-auto">
        {!isPaidView ? (
          /* Checkout View */
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Context Badge */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-neutral-400 flex items-center gap-1">
                <Lock className="h-3 w-3 text-[#E5B842]" /> Portail de Paiement Mobile
              </span>
              <span className="text-[#E5B842] font-mono text-[11px] font-medium">
                Réf : {reference}
              </span>
            </div>

            {/* Invoice Info Card */}
            <Card className="bg-[#121318] border border-white/10 text-white shadow-2xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-[#E5B842]/20 via-[#121318] to-transparent p-5 border-b border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5B842] bg-[#E5B842]/10 px-2 py-0.5 rounded border border-[#E5B842]/20">
                  Avis d'échéance locative
                </span>
                <h1 
                  className="text-2xl font-bold text-white mt-2"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Règlement de loyer
                </h1>
                <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-neutral-500" /> Période : Septembre 2026
                </p>
              </div>

              <CardContent className="p-5 space-y-4">
                {/* Summary Box */}
                <div className="space-y-2.5 text-xs bg-black/40 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-neutral-500" /> Locataire
                    </span>
                    <span className="font-semibold text-white">{tenant.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-neutral-500" /> Logement / Bien
                    </span>
                    <span className="font-semibold text-neutral-200">{tenant.property}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      <Smartphone className="h-3.5 w-3.5 text-neutral-500" /> Numéro contact
                    </span>
                    <span className="font-mono text-neutral-300">{tenant.phone}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-white/10">
                    <span className="font-bold text-white text-sm">Montant du loyer</span>
                    <span className="font-mono font-black text-xl text-[#E5B842]">
                      {tenant.rentVal.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                {/* Mobile Money Selector */}
                <div className="space-y-2.5 pt-1">
                  <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                    <span>Choisissez votre canal de paiement :</span>
                    <span className="text-[10px] text-emerald-400 font-normal">Sans frais additionnels</span>
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Wave */}
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('wave')}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col items-center gap-2 text-center relative ${
                        selectedMethod === 'wave'
                          ? 'border-[#1da1f2] bg-[#1da1f2]/10 ring-2 ring-[#1da1f2]/50 shadow-lg'
                          : 'border-white/5 bg-black/30 hover:border-white/20'
                      }`}
                    >
                      {selectedMethod === 'wave' && (
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#1da1f2]" />
                      )}
                      <div className="h-11 w-11 rounded-full bg-[#1da1f2]/20 flex items-center justify-center text-[#1da1f2] font-black text-xl shadow-inner">
                        W
                      </div>
                      <div>
                        <p className="font-bold text-xs text-white">Wave</p>
                        <p className="text-[10px] text-neutral-400">1-Clic direct</p>
                      </div>
                    </button>

                    {/* Orange Money */}
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('om')}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col items-center gap-2 text-center relative ${
                        selectedMethod === 'om'
                          ? 'border-[#ff7900] bg-[#ff7900]/10 ring-2 ring-[#ff7900]/50 shadow-lg'
                          : 'border-white/5 bg-black/30 hover:border-white/20'
                      }`}
                    >
                      {selectedMethod === 'om' && (
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#ff7900]" />
                      )}
                      <div className="h-11 w-11 rounded-full bg-[#ff7900]/20 flex items-center justify-center text-[#ff7900] font-black text-lg shadow-inner">
                        OM
                      </div>
                      <div>
                        <p className="font-bold text-xs text-white">Orange Money</p>
                        <p className="text-[10px] text-neutral-400">#144# ou Maxit</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Phone number confirmation */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs text-neutral-400 font-medium">
                    Numéro {selectedMethod === 'wave' ? 'Wave' : 'Orange Money'} à débiter :
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-mono font-bold flex items-center gap-1">
                      <span>🇸🇳</span> +221
                    </span>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="77 123 45 67"
                      className="w-full pl-20 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-[#E5B842] font-mono"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  onClick={handlePay}
                  disabled={isProcessing}
                  className={`w-full text-black font-bold h-12 rounded-xl text-sm gap-2 shadow-lg transition-all ${
                    selectedMethod === 'wave' 
                      ? 'bg-[#1da1f2] hover:bg-[#1a90d9] text-white' 
                      : 'bg-[#ff7900] hover:bg-[#e66d00] text-white'
                  }`}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Autorisation {selectedMethod === 'wave' ? 'Wave' : 'Orange Money'} en cours...
                    </span>
                  ) : (
                    <>
                      <span>Valider le paiement de {tenant.rentVal.toLocaleString()} FCFA</span>
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* Security badges */}
                <div className="pt-2 flex items-center justify-center gap-3 text-[10px] text-neutral-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" /> Agréé BCEAO
                  </span>
                  <span>•</span>
                  <span>Quittance certifiée instantanée</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Payment Success View */
          <div className="space-y-5 text-center animate-in zoom-in-95 duration-200">
            <Card className="bg-[#121318] border border-emerald-500/30 text-white p-6 sm:p-7 shadow-2xl rounded-2xl space-y-5">
              <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <Sparkles className="h-3 w-3" /> Règlement Validé avec Succès
                </span>
                <h2 
                  className="text-2xl font-bold text-white mt-3"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Merci {tenant.name} !
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Votre loyer pour le bien <strong className="text-neutral-200">{tenant.property}</strong> est intégralement réglé.
                </p>
              </div>

              <div className="bg-black/40 border border-white/5 rounded-xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Montant réglé :</span>
                  <span className="font-mono font-bold text-white text-sm">{tenant.rentVal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Canal utilisé :</span>
                  <span className="text-emerald-400 font-semibold">{selectedMethod === 'wave' ? 'Wave Mobile Money' : 'Orange Money'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Référence unique :</span>
                  <span className="font-mono text-[#E5B842]">{reference}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Date et heure :</span>
                  <span className="text-neutral-300 font-mono">03 Sept. 2026 à 16:45</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={() => setIsQuittanceOpen(true)}
                  className="w-full bg-[#E5B842] hover:bg-[#cdaf35] text-black font-bold h-12 rounded-xl text-xs gap-2 shadow-md"
                >
                  <FileText className="h-4 w-4" /> Visualiser / Télécharger ma Quittance Certifiée
                </Button>

                <Link 
                  to="/" 
                  className="inline-block text-xs text-neutral-400 hover:text-white pt-2 transition-colors"
                >
                  Retourner au portail KërGui Pay
                </Link>
              </div>
            </Card>
          </div>
        )}
      </main>

      {/* Mobile Footer */}
      <footer className="py-4 border-t border-white/5 text-center text-[11px] text-neutral-500">
        KeurGui Pay · Solution certifiée de paiement locatif sénégalais 🇸🇳
      </footer>

      {/* Quittance Modal */}
      <QuittanceModal
        isOpen={isQuittanceOpen}
        onClose={() => setIsQuittanceOpen(false)}
        data={{
          tenantName: tenant.name,
          tenantPhone: tenant.phone,
          property: tenant.property,
          amount: tenant.rentVal,
          month: 'Septembre 2026',
          reference: reference,
          agencyName: 'Cabinet Immobilier Immo221',
          paymentMethod: selectedMethod === 'wave' ? 'Wave Mobile Money' : 'Orange Money',
        }}
      />
    </div>
  );
}
