import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { 
  UserPlus, 
  Phone, 
  Search, 
  ChevronDown, 
  List, 
  Grid, 
  FileText, 
  Edit3, 
  Trash2, 
  Send,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useAgencyStore } from '@/stores/agencyStore';
import { toast } from 'sonner';

export default function LocatairesPage() {
  const { 
    locataires, 
    addLocataire, 
    deleteLocataire, 
    encaisserLoyer, 
    relancerLocataire 
  } = useAgencyStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'liste' | 'cartes'>('liste');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const itemsPerPage = 5;

  // Add Form State
  const [newLocName, setNewLocName] = useState('');
  const [newLocEmail, setNewLocEmail] = useState('');
  const [newLocPhone, setNewLocPhone] = useState('');
  const [newLocProp, setNewLocProp] = useState('');
  const [newLocRent, setNewLocRent] = useState('');

  // Filtered Locataires
  const filteredLocataires = useMemo(() => {
    return locataires.filter((loc) => {
      const matchesSearch = loc.name.toLowerCase().includes(search.toLowerCase()) || 
                            loc.property.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'paid' && loc.status === 'paid') ||
                            (statusFilter === 'late' && loc.status !== 'paid');
      return matchesSearch && matchesStatus;
    });
  }, [locataires, search, statusFilter]);

  // Reset page when filtering
  useMemo(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredLocataires.length / itemsPerPage) || 1;
  const paginatedLocataires = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLocataires.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLocataires, currentPage]);

  const handleEncaisser = (id: number, name: string) => {
    encaisserLoyer(id);
    toast.success(`Encaissement enregistré pour ${name}`);
  };

  const handleRelancer = (id: number, name: string) => {
    relancerLocataire(id);
    toast.success(`Relance WhatsApp envoyée à ${name}`);
  };

  const handleDelete = (id: number, name: string) => {
    deleteLocataire(id);
    toast.error(`Locataire ${name} supprimé`);
  };

  const handleAction = (action: string, name: string) => {
    toast.success(`${action} effectuée pour ${name}`);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName || !newLocProp || !newLocRent) {
      toast.error('Veuillez remplir les champs obligatoires (Nom, Logement, Loyer)');
      return;
    }

    addLocataire({
      name: newLocName,
      email: newLocEmail || `${newLocName.toLowerCase().replace(/\s+/g, '')}@email.sn`,
      phone: newLocPhone || '+221 77 000 00 00',
      property: newLocProp,
      rentVal: parseInt(newLocRent) || 0,
      status: 'late',
      delayDays: 1,
    });

    // Reset Form
    setNewLocName('');
    setNewLocEmail('');
    setNewLocPhone('');
    setNewLocProp('');
    setNewLocRent('');
    setIsAdding(false);
    toast.success('Nouveau locataire ajouté avec succès');
  };

  return (
    <div className="space-y-8 bg-[#0A0A0C] text-neutral-200 min-h-screen">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5B842]">
            Workspace Agence
          </span>
          <h1 
            className="text-3xl md:text-4xl font-normal text-white mt-1"
            style={{ fontFamily: 'Georgia, ui-serif, serif' }}
          >
            Gestion des Locataires
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Retrouvez, modifiez, relancez vos locataires ou générez leurs quittances de loyer.
          </p>
        </div>

        <Button 
          className="bg-[#E5B842] hover:bg-[#cdaf35] text-black font-semibold gap-1.5 px-4 self-start md:self-auto"
          onClick={() => setIsAdding(true)}
        >
          <UserPlus className="h-4 w-4" /> Ajouter un locataire
        </Button>
      </div>

      {/* Add Locataire Modal Popup */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsAdding(false)} 
          />
          <Card className="relative z-10 w-full max-w-xl bg-[#121318] border border-white/10 text-white shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-xl">Ajouter un nouveau locataire</CardTitle>
                <CardDescription className="text-neutral-400 mt-1">Remplissez les informations ci-dessous.</CardDescription>
              </div>
              <button 
                onClick={() => setIsAdding(false)}
                className="rounded-lg p-1 text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium">Nom complet *</label>
                    <input 
                      type="text" 
                      placeholder="Moussa Ndiaye" 
                      value={newLocName}
                      onChange={(e) => setNewLocName(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-[#E5B842]/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium">Logement / Bien *</label>
                    <input 
                      type="text" 
                      placeholder="Appartement 4B" 
                      value={newLocProp}
                      onChange={(e) => setNewLocProp(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-[#E5B842]/40"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium">Loyer mensuel (FCFA) *</label>
                    <input 
                      type="number" 
                      placeholder="150000" 
                      value={newLocRent}
                      onChange={(e) => setNewLocRent(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-[#E5B842]/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium">Téléphone</label>
                    <input 
                      type="text" 
                      placeholder="+221 77 123 45 67" 
                      value={newLocPhone}
                      onChange={(e) => setNewLocPhone(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-[#E5B842]/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400 font-medium">Adresse email</label>
                  <input 
                    type="email" 
                    placeholder="moussa@email.sn" 
                    value={newLocEmail}
                    onChange={(e) => setNewLocEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-[#E5B842]/40"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/5 mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="bg-black/20 border-white/5 hover:bg-neutral-800 text-neutral-300"
                    onClick={() => setIsAdding(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-[#E5B842] hover:bg-[#cdaf35] text-black font-semibold">
                    Ajouter le locataire
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main card panel */}
      <Card className="bg-[#121318] border-white/5 text-white">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-6">
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg font-bold">Portefeuille locatif</CardTitle>
            
            {/* View Mode Toggle */}
            <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/5 text-xs text-neutral-400">
              <button 
                onClick={() => setViewMode('liste')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${viewMode === 'liste' ? 'bg-[#E5B842] text-black font-semibold' : 'hover:text-white'}`}
              >
                <List className="h-3.5 w-3.5" /> Liste
              </button>
              <button 
                onClick={() => setViewMode('cartes')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${viewMode === 'cartes' ? 'bg-[#E5B842] text-black font-semibold' : 'hover:text-white'}`}
              >
                <Grid className="h-3.5 w-3.5" /> Cartes
              </button>
            </div>
          </div>

          {/* Filtering and search inputs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
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

            {/* Status Select */}
            <div className="relative w-full sm:w-auto">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-black/40 border border-white/5 rounded-lg px-4 py-2 pr-10 text-sm text-neutral-300 focus:outline-none focus:border-[#E5B842]/40 cursor-pointer"
              >
                <option value="all">Tous les statuts</option>
                <option value="paid">Payé</option>
                <option value="late">En retard</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {viewMode === 'liste' ? (
            /* Table list mode */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-neutral-400 font-medium">
                    <th className="pb-3 text-xs uppercase tracking-wider">Locataire</th>
                    <th className="pb-3 text-xs uppercase tracking-wider">Logement</th>
                    <th className="pb-3 text-xs uppercase tracking-wider">Loyer</th>
                    <th className="pb-3 text-xs uppercase tracking-wider">Statut</th>
                    <th className="pb-3 text-right text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedLocataires.length > 0 ? (
                    paginatedLocataires.map((loc) => (
                      <tr key={loc.id} className="group hover:bg-white/[0.01]">
                        <td className="py-4">
                          <div>
                            <p className="font-semibold text-white text-base leading-snug">{loc.name}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              {loc.email} <span className="opacity-40">·</span> {loc.phone}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 text-neutral-300 text-sm">{loc.property}</td>
                        <td className="py-4 font-mono font-semibold text-neutral-300 text-sm">{loc.rentVal.toLocaleString()} F</td>
                        <td className="py-4">
                          {loc.status === 'paid' ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                              Payé
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400 ring-1 ring-inset ring-rose-500/20">
                              En retard - {loc.delayDays} j
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {loc.status === 'paid' ? (
                              <>
                                <button 
                                  onClick={() => handleAction('Annulation', loc.name)}
                                  className="px-3 py-1 rounded bg-rose-950/20 border border-rose-500/20 text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition-colors"
                                >
                                  Annuler
                                </button>
                                <button 
                                  onClick={() => handleAction('Édition Quittance', loc.name)}
                                  className="flex items-center gap-1 px-3 py-1 rounded bg-[#E5B842]/10 border border-[#E5B842]/20 text-xs font-medium text-[#E5B842] hover:bg-[#E5B842]/20 transition-colors"
                                >
                                  <FileText className="h-3 w-3" /> Quittance
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => handleEncaisser(loc.id, loc.name)}
                                  className="px-3 py-1 rounded bg-emerald-950/20 border border-emerald-500/20 text-xs font-medium text-emerald-400 hover:bg-emerald-950/40 transition-colors"
                                >
                                  Encaisser
                                </button>
                                <button 
                                  onClick={() => handleRelancer(loc.id, loc.name)}
                                  className="flex items-center gap-1 px-3 py-1 rounded bg-neutral-800 border border-white/10 text-xs font-medium text-neutral-300 hover:bg-neutral-700 transition-colors"
                                >
                                  <Send className="h-3 w-3" /> Relancer
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => handleAction('Modification', loc.name)}
                              className="flex items-center gap-1 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-400 hover:bg-amber-500/20 transition-colors"
                            >
                              <Edit3 className="h-3 w-3" /> Modifier
                            </button>
                            <button 
                              onClick={() => handleDelete(loc.id, loc.name)}
                              className="flex items-center gap-1 px-3 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-xs font-medium text-orange-400 hover:bg-orange-500/20 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" /> Suppr.
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-neutral-500">
                        Aucun locataire trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Cards mode layout */
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedLocataires.length > 0 ? (
                paginatedLocataires.map((loc) => (
                  <Card key={loc.id} className="bg-black/30 border-white/5 text-white flex flex-col justify-between">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base font-bold">{loc.name}</CardTitle>
                          <CardDescription className="text-neutral-500 mt-1">{loc.email}</CardDescription>
                        </div>
                        {loc.status === 'paid' ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                            Payé
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400 ring-1 ring-inset ring-rose-500/20">
                            En retard - {loc.delayDays} j
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                      <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400 border-b border-white/5 pb-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-neutral-500">Logement</p>
                          <p className="font-medium text-neutral-200 mt-0.5">{loc.property}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-neutral-500">Loyer</p>
                          <p className="font-semibold text-neutral-200 mt-0.5">{loc.rentVal.toLocaleString()} F</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-neutral-400">
                          <Phone className="h-3.5 w-3.5" /> {loc.phone}
                        </span>
                      </div>
                      {/* Action buttons footer */}
                      <div className="flex flex-wrap items-center justify-end gap-1.5 pt-2">
                        {loc.status === 'paid' ? (
                          <>
                            <button 
                              onClick={() => handleAction('Annulation', loc.name)}
                              className="px-2 py-1 rounded bg-rose-950/20 border border-rose-500/20 text-[10px] font-medium text-rose-400 hover:bg-rose-950/40"
                            >
                              Annuler
                            </button>
                            <button 
                              onClick={() => handleAction('Édition Quittance', loc.name)}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-[#E5B842]/10 border border-[#E5B842]/20 text-[10px] font-medium text-[#E5B842] hover:bg-[#E5B842]/20"
                            >
                              <FileText className="h-2.5 w-2.5" /> Quittance
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleEncaisser(loc.id, loc.name)}
                              className="px-2 py-1 rounded bg-emerald-950/20 border border-emerald-500/20 text-[10px] font-medium text-emerald-400 hover:bg-emerald-950/40"
                            >
                              Encaisser
                            </button>
                            <button 
                              onClick={() => handleRelancer(loc.id, loc.name)}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-neutral-800 border border-white/10 text-[10px] font-medium text-neutral-300 hover:bg-neutral-700"
                            >
                              <Send className="h-2.5 w-2.5" /> Relancer
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleAction('Modification', loc.name)}
                          className="flex items-center gap-0.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-medium text-amber-400 hover:bg-amber-500/20"
                        >
                          <Edit3 className="h-2.5 w-2.5" /> Modifier
                        </button>
                        <button 
                          onClick={() => handleDelete(loc.id, loc.name)}
                          className="flex items-center gap-0.5 px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-[10px] font-medium text-orange-400 hover:bg-orange-500/20"
                        >
                          <Trash2 className="h-2.5 w-2.5" /> Suppr.
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-neutral-500">
                  Aucun locataire trouvé.
                </div>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t border-white/5 mt-6 pt-4 text-sm text-neutral-400">
            <div>
              Affichage de{' '}
              <span className="font-semibold text-white">
                {filteredLocataires.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </span>{' '}
              à{' '}
              <span className="font-semibold text-white">
                {Math.min(currentPage * itemsPerPage, filteredLocataires.length)}
              </span>{' '}
              sur{' '}
              <span className="font-semibold text-white">{filteredLocataires.length}</span>{' '}
              locataires
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
