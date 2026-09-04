import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { 
  MessageSquare, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  AlertTriangle,
  Clock,
  Zap,
  CheckCheck,
  ExternalLink,
  Copy,
  Check,
  X
} from 'lucide-react';
import { useAgencyStore, type Locataire } from '@/stores/agencyStore';
import { createWhatsAppPaymentMessage } from '@/shared/utils/whatsapp';
import { toast } from 'sonner';

export default function RelancesPage() {
  const { locataires, relancerLocataire } = useAgencyStore();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isBulkSending, setIsBulkSending] = useState(false);
  const itemsPerPage = 5;

  // WhatsApp Preview Modal State
  const [previewWhatsApp, setPreviewWhatsApp] = useState<{
    loc: Locataire;
    text: string;
    paymentUrl: string;
    whatsappUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Filter late locataires dynamically
  const lateLocataires = useMemo(() => {
    return locataires.filter((l) => l.status === 'late');
  }, [locataires]);

  // Total unpaid
  const totalImpayes = useMemo(() => {
    return lateLocataires.reduce((sum, l) => sum + l.rentVal, 0);
  }, [lateLocataires]);

  const avgDelay = lateLocataires.length > 0 
    ? Math.round(lateLocataires.reduce((sum, l) => sum + l.delayDays, 0) / lateLocataires.length) 
    : 0;

  // Filter by search query
  const filteredRelances = useMemo(() => {
    return lateLocataires.filter((rel) => 
      rel.name.toLowerCase().includes(search.toLowerCase()) || 
      rel.property.toLowerCase().includes(search.toLowerCase()) ||
      rel.phone.toLowerCase().includes(search.toLowerCase())
    );
  }, [lateLocataires, search]);

  // Reset page on search change
  useMemo(() => {
    setCurrentPage(1);
  }, [search]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRelances.length / itemsPerPage) || 1;
  const paginatedRelances = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRelances.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRelances, currentPage]);

  const handleSendWhatsApp = (loc: Locataire) => {
    relancerLocataire(loc.id);
    const msg = createWhatsAppPaymentMessage(loc);
    setPreviewWhatsApp({ loc, ...msg });
    
    // Open WhatsApp Web or mobile app in background/new tab
    window.open(msg.whatsappUrl, '_blank');

    toast.success(`Relance WhatsApp préparée pour ${loc.name}`, {
      description: `Lien Wave/OM inclus : ${msg.paymentUrl}`,
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Message et lien de paiement copiés !');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBulkRemind = () => {
    if (lateLocataires.length === 0) {
      toast.info('Aucun locataire en retard à relancer');
      return;
    }

    setIsBulkSending(true);
    setTimeout(() => {
      lateLocataires.forEach((l) => relancerLocataire(l.id));
      setIsBulkSending(false);
      toast.success(`Campagne terminée : ${lateLocataires.length} relances avec lien Wave/OM expédiées !`, {
        icon: '🚀',
      });
    }, 1200);
  };

  return (
    <div className="space-y-8 bg-[#0A0A0C] text-neutral-200 min-h-screen">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5B842]">
            Alertes de retard
          </span>
          <h1 
            className="text-3xl md:text-4xl font-normal text-white mt-1"
            style={{ fontFamily: 'Georgia, ui-serif, serif' }}
          >
            Relances de Paiement
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Générez et expédiez des relances WhatsApp avec lien de règlement Wave & Orange Money en 1 clic.
          </p>
        </div>

        <Button 
          onClick={handleBulkRemind}
          disabled={isBulkSending || lateLocataires.length === 0}
          className="bg-[#E5B842] hover:bg-[#cdaf35] text-black font-semibold gap-1.5 px-4 self-start md:self-auto shadow-md disabled:opacity-40"
        >
          <Zap className="h-4 w-4 fill-black" />
          {isBulkSending ? 'Expédition en cours...' : `Relancer tout le monde (${lateLocataires.length})`}
        </Button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Impayés en cours</p>
            <p className="text-2xl font-bold font-mono text-rose-400 mt-1">{totalImpayes.toLocaleString()} F</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Dossiers en retard</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">{lateLocataires.length}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#E5B842]">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Retard Moyen</p>
            <p className="text-2xl font-bold font-mono text-neutral-200 mt-1">{avgDelay} jours</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400">
            <Zap className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Canal de Relance</p>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">WhatsApp</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main card panel */}
      <Card className="bg-[#121318] border-white/5 text-white">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
          <CardTitle className="text-lg font-bold">Liste des relances à effectuer</CardTitle>
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input 
                type="text"
                placeholder="Rechercher nom, logement, tél..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/40 border border-white/5 text-sm text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-[#E5B842]/40"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-neutral-400 font-medium">
                  <th className="pb-3 text-xs uppercase tracking-wider">Locataire</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Logement</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Montant dû</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Retard</th>
                  <th className="pb-3 text-right text-xs uppercase tracking-wider">Action WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedRelances.length > 0 ? (
                  paginatedRelances.map((rel) => (
                    <tr key={rel.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-4">
                        <div>
                          <p className="font-semibold text-white text-base leading-snug">{rel.name}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">{rel.phone}</p>
                        </div>
                      </td>
                      <td className="py-4 text-neutral-300 text-sm">{rel.property}</td>
                      <td className="py-4 font-mono font-semibold text-rose-400 text-sm">{rel.rentVal.toLocaleString()} F</td>
                      <td className="py-4">
                        <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400 ring-1 ring-inset ring-rose-500/20">
                          En retard · {rel.delayDays} j
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Button 
                          onClick={() => handleSendWhatsApp(rel)}
                          className="bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 font-semibold text-xs gap-1.5 px-3 py-1.5 h-8 rounded-lg shadow-sm transition-all"
                        >
                          <MessageSquare className="h-3.5 w-3.5 fill-emerald-400/20" /> Relancer via WhatsApp
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500">
                      Aucun retard à relancer trouvé. Tous vos locataires sont à jour !
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t border-white/5 mt-6 pt-4 text-sm text-neutral-400">
            <div>
              Affichage de{' '}
              <span className="font-semibold text-white">
                {filteredRelances.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              à{' '}
              <span className="font-semibold text-white">
                {Math.min(currentPage * itemsPerPage, filteredRelances.length)}
              </span>{' '}
              sur{' '}
              <span className="font-semibold text-white">{filteredRelances.length}</span>{' '}
              dossiers
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-black/20 border-white/5 hover:bg-neutral-800 text-neutral-300 disabled:opacity-40 disabled:pointer-events-none"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" /> Précédent
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 text-xs font-semibold rounded-md border transition-all ${currentPage === page ? 'bg-[#E5B842] text-black border-[#E5B842]' : 'bg-black/20 border-white/5 text-neutral-300 hover:bg-neutral-800'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <Button 
                variant="outline" 
                size="sm"
                className="bg-black/20 border-white/5 hover:bg-neutral-800 text-neutral-300 disabled:opacity-40 disabled:pointer-events-none"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Suivant <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Message & Payment Link Preview Modal */}
      {previewWhatsApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setPreviewWhatsApp(null)} />
          <Card className="relative z-10 w-full max-w-lg bg-[#14151B] border border-emerald-500/30 text-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Message WhatsApp & Lien de Paiement</CardTitle>
                  <p className="text-xs text-neutral-400">Destinataire : <span className="text-white font-semibold">{previewWhatsApp.loc.name}</span> ({previewWhatsApp.loc.phone})</p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewWhatsApp(null)}
                className="rounded-lg p-1 text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Aperçu du message WhatsApp généré :</label>
                <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 font-sans text-xs text-neutral-200 whitespace-pre-wrap leading-relaxed">
                  {previewWhatsApp.text}
                </div>
              </div>

              {/* Direct payment link box */}
              <div className="p-3.5 rounded-xl bg-[#E5B842]/10 border border-[#E5B842]/20 flex items-center justify-between gap-3 text-xs">
                <div className="truncate">
                  <p className="text-[10px] uppercase font-bold text-[#E5B842] tracking-wider">Lien direct de paiement mobile Wave / OM :</p>
                  <p className="font-mono text-neutral-300 truncate mt-0.5 text-[11px]">{previewWhatsApp.paymentUrl}</p>
                </div>
                <a 
                  href={previewWhatsApp.paymentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E5B842] hover:bg-[#cdaf35] text-black font-bold text-xs shadow-sm transition-all"
                >
                  <ExternalLink className="h-3 w-3" /> Ouvrir la page
                </a>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleCopy(previewWhatsApp.text)}
                  className="bg-black/30 border-white/10 text-neutral-300 hover:bg-neutral-800 text-xs h-9 px-3 gap-1.5"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copié !' : 'Copier le message'}
                </Button>
                <Button
                  type="button"
                  onClick={() => window.open(previewWhatsApp.whatsappUrl, '_blank')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-4 shadow-md gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Ouvrir WhatsApp Web
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
