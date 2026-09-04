import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { 
  FileText, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  CreditCard,
  Wallet,
  CheckCircle2,
  Download
} from 'lucide-react';
import { useAgencyStore } from '@/stores/agencyStore';
import { QuittanceModal, type QuittanceData } from '@/shared/components/QuittanceModal';
import { exportToCSV } from '@/shared/utils/csvExport';
import { toast } from 'sonner';

export default function EncaissementsPage() {
  const { encaissements } = useAgencyStore();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Quittance Modal State
  const [selectedQuittance, setSelectedQuittance] = useState<QuittanceData | null>(null);
  const [isQuittanceOpen, setIsQuittanceOpen] = useState(false);

  // Top Metrics
  const totalEncaiss = useMemo(() => {
    return encaissements.reduce((sum, e) => sum + e.amount, 0);
  }, [encaissements]);

  const avgRent = encaissements.length > 0 ? Math.round(totalEncaiss / encaissements.length) : 0;

  // Filtered Encaissements
  const filteredEncaissements = useMemo(() => {
    return encaissements.filter((tx) => 
      tx.tenant.toLowerCase().includes(search.toLowerCase()) ||
      tx.property.toLowerCase().includes(search.toLowerCase())
    );
  }, [encaissements, search]);

  // Reset page on search change
  useMemo(() => {
    setCurrentPage(1);
  }, [search]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredEncaissements.length / itemsPerPage) || 1;
  const paginatedEncaissements = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEncaissements.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEncaissements, currentPage]);

  const handleShowQuittance = (tx: typeof encaissements[0]) => {
    setSelectedQuittance({
      tenantName: tx.tenant,
      property: tx.property,
      amount: tx.amount,
      month: 'Août 2026',
      paymentDate: tx.date,
      paymentMethod: 'Wave Mobile Money',
      reference: tx.reference,
    });
    setIsQuittanceOpen(true);
  };

  const handleExportCSV = () => {
    const dataToExport = encaissements.map((e) => ({
      'Référence': e.reference,
      'Locataire': e.tenant,
      'Logement': e.property,
      'Montant Encaissé (FCFA)': e.amount,
      'Date': e.date,
      'Détails': e.subtitle,
    }));
    exportToCSV('keurguipay_encaissements', dataToExport);
    toast.success('Journal des encaissements exporté en CSV (compatible Excel)');
  };

  return (
    <div className="space-y-8 bg-[#0A0A0C] text-neutral-200 min-h-screen">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5B842]">
            Transactions Agence
          </span>
          <h1 
            className="text-3xl md:text-4xl font-normal text-white mt-1"
            style={{ fontFamily: 'Georgia, ui-serif, serif' }}
          >
            Suivi des Encaissements
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Consultez en temps réel les loyers perçus et éditez les quittances certifiées.
          </p>
        </div>

        <Button 
          variant="outline"
          onClick={handleExportCSV}
          className="bg-black/40 border-white/10 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold gap-1.5 h-10 px-3.5 shadow-sm self-start md:self-auto"
        >
          <Download className="h-4 w-4 text-[#E5B842]" /> Exporter CSV
        </Button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Total Perçu (Août)</p>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{totalEncaiss.toLocaleString()} F</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Transactions Validées</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">{encaissements.length}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Panier Moyen</p>
            <p className="text-2xl font-bold font-mono text-neutral-200 mt-1">{avgRent.toLocaleString()} F</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-neutral-800 border border-white/10 flex items-center justify-center text-neutral-300">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Canal Principal</p>
            <p className="text-xl font-bold text-[#E5B842] mt-1">Wave & OM</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-[#E5B842]/10 border border-[#E5B842]/20 flex items-center justify-center text-[#E5B842]">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <Card className="bg-[#121318] border-white/5 text-white">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
          <CardTitle className="text-lg font-bold">Transactions validées</CardTitle>
          
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input 
              type="text"
              placeholder="Rechercher locataire..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/40 border border-white/5 text-sm text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-[#E5B842]/40"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-neutral-400 font-medium">
                  <th className="pb-3 text-xs uppercase tracking-wider">Locataire</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Logement</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Montant perçu</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Date & Référence</th>
                  <th className="pb-3 text-right text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedEncaissements.length > 0 ? (
                  paginatedEncaissements.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-4">
                        <div>
                          <p className="font-semibold text-white text-base leading-snug">{tx.tenant}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">{tx.subtitle}</p>
                        </div>
                      </td>
                      <td className="py-4 text-neutral-300 text-sm">{tx.property}</td>
                      <td className="py-4 font-mono font-semibold text-emerald-400 text-base">{tx.amount.toLocaleString()} F</td>
                      <td className="py-4 text-neutral-400 text-xs font-mono">
                        <p className="text-white">{tx.date}</p>
                        <p className="text-neutral-500 text-[11px]">{tx.reference}</p>
                      </td>
                      <td className="py-4 text-right">
                        <Button 
                          onClick={() => handleShowQuittance(tx)}
                          className="bg-[#E5B842] hover:bg-[#cdaf35] text-black font-bold text-xs gap-1.5 px-3 py-1 h-8 rounded-lg shadow-sm"
                        >
                          <FileText className="h-3.5 w-3.5" /> Voir la quittance
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500">
                      Aucun encaissement trouvé.
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
                {filteredEncaissements.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              à{' '}
              <span className="font-semibold text-white">
                {Math.min(currentPage * itemsPerPage, filteredEncaissements.length)}
              </span>{' '}
              sur{' '}
              <span className="font-semibold text-white">{filteredEncaissements.length}</span>{' '}
              transactions
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

      {/* Official Quittance Modal */}
      <QuittanceModal 
        isOpen={isQuittanceOpen}
        onClose={() => setIsQuittanceOpen(false)}
        data={selectedQuittance}
      />
    </div>
  );
}
