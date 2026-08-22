import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { 
  MessageSquare, 
  Search, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useAgencyStore } from '@/stores/agencyStore';
import { toast } from 'sonner';

export default function RelancesPage() {
  const { locataires, relancerLocataire } = useAgencyStore();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter late locataires dynamically
  const lateLocataires = useMemo(() => {
    return locataires.filter((l) => l.status === 'late');
  }, [locataires]);

  // Filter by search query
  const filteredRelances = useMemo(() => {
    return lateLocataires.filter((rel) => 
      rel.name.toLowerCase().includes(search.toLowerCase()) ||
      rel.property.toLowerCase().includes(search.toLowerCase())
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

  const handleSendWhatsApp = (id: number, name: string) => {
    relancerLocataire(id);
    toast.success(`Relance WhatsApp envoyée à ${name}`);
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
            Retards & Relances
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Retrouvez les locataires en attente de paiement et envoyez un rappel en un clic.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <Card className="bg-[#121318] border-white/5 text-white">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
          <CardTitle className="text-lg font-bold">Loyers en attente</CardTitle>
          
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
                  <th className="pb-3 text-xs uppercase tracking-wider">Échéance</th>
                  <th className="pb-3 text-right text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedRelances.length > 0 ? (
                  paginatedRelances.map((rel) => (
                    <tr key={rel.id} className="group hover:bg-white/[0.01]">
                      <td className="py-4">
                        <div>
                          <p className="font-semibold text-white text-base leading-snug">{rel.name}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">{rel.phone}</p>
                        </div>
                      </td>
                      <td className="py-4 text-neutral-300 text-sm">{rel.property}</td>
                      <td className="py-4 font-semibold text-rose-500 text-sm">En retard - {rel.delayDays} j</td>
                      <td className="py-4 text-right">
                        <Button 
                          onClick={() => handleSendWhatsApp(rel.id, rel.name)}
                          className="bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-[#E5B842] font-semibold text-xs gap-1.5 px-4.5 py-1 h-8 rounded-lg"
                        >
                          <MessageSquare className="h-3.5 w-3.5 fill-[#E5B842]/20" /> Relancer via WhatsApp
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-neutral-500">
                      Aucun retard à relancer trouvé.
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
              locataires en retard
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
    </div>
  );
}
