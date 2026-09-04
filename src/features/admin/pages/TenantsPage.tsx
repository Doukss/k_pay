import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { 
  Search, 
  Building, 
  Eye, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Plus
} from 'lucide-react';
import { AgencyDetailModal } from '../components/AgencyDetailModal';
import type { AgencyDetail } from '../types';
import { toast } from 'sonner';

const initialAgencesData: AgencyDetail[] = [
  {
    id: 1,
    name: 'Immo Dakar Prestige',
    shortName: 'ID',
    responsable: 'Malick Mbodji',
    email: 'direction@immodakar.sn',
    phone: '+221 77 450 12 34',
    city: 'Dakar (Plateau & Fann)',
    address: '14 Boulevard de la République, Dakar',
    ninea: '00482918293-2B',
    plan: 'Plan Pro',
    status: 'active',
    locataires: 42,
    quota: 100,
    volumeMensuel: 2450000,
    commissionRate: 1.5,
    commissionsTotal: 36750,
    tauxRecouvrement: 94.2,
    dateAdhesion: '12 Janvier 2026',
    gateways: {
      wave: { enabled: true, merchantId: 'WV-DKR-892', status: 'operational' },
      orangeMoney: { enabled: true, merchantNumber: '+221 77 450 12 34', status: 'operational' },
      whatsapp: { enabled: true, phoneNumber: '+221 77 450 12 34', status: 'operational' },
    },
    locatairesList: [
      { id: 101, name: 'Mame Diop', property: 'Appartement 2A Plateau', rentVal: 250000, phone: '+221 77 123 45 67', status: 'paid' },
      { id: 102, name: 'Samba Ndiaye', property: 'Appartement 3B Fann', rentVal: 180000, phone: '+221 76 234 56 78', status: 'late' },
      { id: 103, name: 'Aïssatou Fall', property: 'Studio 1 Corniche', rentVal: 320000, phone: '+221 78 345 67 80', status: 'late' },
      { id: 104, name: 'Babacar Ba', property: 'Duplex Fann Résidence', rentVal: 850000, phone: '+221 77 987 65 43', status: 'paid' },
    ],
  },
  {
    id: 2,
    name: 'Saint-Louis Immo',
    shortName: 'SL',
    responsable: 'Fatou Diop',
    email: 'contact@saintlouis-immo.sn',
    phone: '+221 76 567 89 01',
    city: 'Saint-Louis (Île Nord)',
    address: 'Rue Blanchot, Saint-Louis',
    ninea: '00728192837-1A',
    plan: 'Gratuit',
    status: 'active',
    locataires: 4,
    quota: 5,
    volumeMensuel: 320000,
    commissionRate: 2.0,
    commissionsTotal: 6400,
    tauxRecouvrement: 88.5,
    dateAdhesion: '18 Février 2026',
    gateways: {
      wave: { enabled: true, merchantId: 'WV-STL-410', status: 'operational' },
      orangeMoney: { enabled: true, merchantNumber: '+221 76 567 89 01', status: 'operational' },
      whatsapp: { enabled: true, phoneNumber: '+221 76 567 89 01', status: 'operational' },
    },
    locatairesList: [
      { id: 201, name: 'Cheikh Sarr', property: 'Maison Coloniale Sud', rentVal: 120000, phone: '+221 77 888 11 22', status: 'paid' },
      { id: 202, name: 'Mariama Sy', property: 'Studio Ndar', rentVal: 80000, phone: '+221 78 999 33 44', status: 'pending' },
      { id: 203, name: 'Ibrahima Gueye', property: 'Appartement Faidherbe', rentVal: 120000, phone: '+221 76 444 55 66', status: 'late' },
    ],
  },
  {
    id: 3,
    name: 'Point E Properties',
    shortName: 'PE',
    responsable: 'Amadou Diallo',
    email: 'adiallo@pointe-properties.sn',
    phone: '+221 77 890 12 34',
    city: 'Dakar (Point E & Mermoz)',
    address: 'Avenue Cheikh Anta Diop, Dakar',
    ninea: '00192837465-3C',
    plan: 'Plan Pro',
    status: 'active',
    locataires: 89,
    quota: 100,
    volumeMensuel: 9800000,
    commissionRate: 1.5,
    commissionsTotal: 147000,
    tauxRecouvrement: 97.1,
    dateAdhesion: '02 Mars 2026',
    gateways: {
      wave: { enabled: true, merchantId: 'WV-PTE-003', status: 'operational' },
      orangeMoney: { enabled: true, merchantNumber: '+221 77 890 12 34', status: 'operational' },
      whatsapp: { enabled: true, phoneNumber: '+221 77 890 12 34', status: 'operational' },
    },
    locatairesList: [
      { id: 301, name: 'Khadija Wade', property: 'Appartement 5A Point E', rentVal: 450000, phone: '+221 77 333 22 11', status: 'paid' },
      { id: 302, name: 'Oumar Kane', property: 'Villa Mermoz', rentVal: 1200000, phone: '+221 78 555 44 33', status: 'paid' },
    ],
  },
  {
    id: 4,
    name: 'Almadies Rentals & Luxury',
    shortName: 'AR',
    responsable: 'Khady Sow',
    email: 'direction@almadies-rentals.sn',
    phone: '+221 77 333 44 55',
    city: 'Dakar (Almadies & Ngor)',
    address: 'Zone des Almadies, Route du Méridien, Dakar',
    ninea: '00384729104-4D',
    plan: 'Entreprise',
    status: 'active',
    locataires: 245,
    quota: 500,
    volumeMensuel: 42100000,
    commissionRate: 1.0,
    commissionsTotal: 421000,
    tauxRecouvrement: 98.4,
    dateAdhesion: '10 Avril 2026',
    gateways: {
      wave: { enabled: true, merchantId: 'WV-ALM-777', status: 'operational' },
      orangeMoney: { enabled: true, merchantNumber: '+221 77 333 44 55', status: 'operational' },
      whatsapp: { enabled: true, phoneNumber: '+221 77 333 44 55', status: 'operational' },
    },
    locatairesList: [
      { id: 401, name: 'Jean-Marc Dupont', property: 'Penthouse Almadies Ocean View', rentVal: 3500000, phone: '+221 77 111 22 33', status: 'paid' },
      { id: 402, name: 'Awa Ndiaye', property: 'Villa avec piscine Ngor', rentVal: 2200000, phone: '+221 78 222 33 44', status: 'paid' },
    ],
  },
  {
    id: 5,
    name: 'Thiès Immo Prestige',
    shortName: 'TI',
    responsable: 'Ousmane Fall',
    email: 'ofall@thiesimmo.sn',
    phone: '+221 76 111 22 33',
    city: 'Thiès (Centre-ville)',
    address: 'Avenue Léopold Sédar Senghor, Thiès',
    ninea: '00572910482-5E',
    plan: 'Gratuit',
    status: 'suspended',
    locataires: 2,
    quota: 5,
    volumeMensuel: 150000,
    commissionRate: 2.0,
    commissionsTotal: 3000,
    tauxRecouvrement: 50.0,
    dateAdhesion: '15 Mai 2026',
    gateways: {
      wave: { enabled: false, status: 'error' },
      orangeMoney: { enabled: false, status: 'not_configured' },
      whatsapp: { enabled: true, phoneNumber: '+221 76 111 22 33', status: 'operational' },
    },
    locatairesList: [
      { id: 501, name: 'Moussa Cissé', property: 'Appartement Cité Ouvrière', rentVal: 75000, phone: '+221 77 666 77 88', status: 'late' },
    ],
  },
];

export default function TenantsPage() {
  const [agences, setAgences] = useState<AgencyDetail[]>(initialAgencesData);
  const [search, setSearch] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [selectedAgency, setSelectedAgency] = useState<AgencyDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Platform Network Calculations
  const totalAgences = agences.length;
  const activeAgences = agences.filter((a) => a.status === 'active').length;
  const totalVolumeReseau = agences.reduce((sum, a) => sum + a.volumeMensuel, 0);
  const totalCommissions = agences.reduce((sum, a) => sum + a.commissionsTotal, 0);

  // Filtered Agences
  const filteredAgences = useMemo(() => {
    return agences.filter((ag) => {
      const matchesSearch = 
        ag.name.toLowerCase().includes(search.toLowerCase()) ||
        ag.responsable.toLowerCase().includes(search.toLowerCase()) ||
        ag.city.toLowerCase().includes(search.toLowerCase()) ||
        ag.phone.toLowerCase().includes(search.toLowerCase());
      
      const matchesPlan = 
        selectedPlan === 'all' ||
        (selectedPlan === 'active' && ag.status === 'active') ||
        (selectedPlan === 'suspended' && ag.status === 'suspended') ||
        ag.plan === selectedPlan;

      return matchesSearch && matchesPlan;
    });
  }, [agences, search, selectedPlan]);

  const handleOpenDetail = (agency: AgencyDetail) => {
    setSelectedAgency(agency);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (agencyId: number) => {
    setAgences((prev) =>
      prev.map((a) => {
        if (a.id === agencyId) {
          const newStatus = a.status === 'active' ? 'suspended' : 'active';
          toast.success(
            newStatus === 'active'
              ? `Agence "${a.name}" réactivée avec succès`
              : `Agence "${a.name}" suspendue`
          );
          const updated = { ...a, status: newStatus as AgencyDetail['status'] };
          if (selectedAgency?.id === agencyId) {
            setSelectedAgency(updated);
          }
          return updated;
        }
        return a;
      })
    );
  };

  return (
    <div className="space-y-8 bg-[#0A0A0C] text-neutral-200 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
            Console Plateforme
          </span>
          <h1 
            className="text-3xl md:text-4xl font-normal text-white mt-1"
            style={{ fontFamily: 'Georgia, ui-serif, serif' }}
          >
            Gestion des Agences Partenaires
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Supervisez le parc d'agences clientes, auditez leurs locataires et gérez leurs statuts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={() => toast.info('Formulaire d\'embarquement d\'une nouvelle agence partenaire')}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold gap-1.5 px-4 shadow-md text-xs h-9"
          >
            <Plus className="h-4 w-4" /> Enregistrer une agence
          </Button>
        </div>
      </div>

      {/* Network Overview KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Total Agences</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">{totalAgences}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Building className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Agences Actives</p>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{activeAgences}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Volume Total Réseau</p>
            <p className="text-2xl font-bold font-mono text-[#E5B842] mt-1">{totalVolumeReseau.toLocaleString()} F</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-[#E5B842]/10 border border-[#E5B842]/20 flex items-center justify-center text-[#E5B842]">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Commissions Générées</p>
            <p className="text-2xl font-bold font-mono text-rose-400 mt-1">{totalCommissions.toLocaleString()} F</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="bg-[#121318] border-white/5 text-white shadow-xl">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
          <div>
            <CardTitle className="text-lg font-bold">Portefeuille des Agences Immobilières</CardTitle>
            <CardDescription className="text-neutral-400 text-xs mt-0.5">
              Cliquez sur « Détails » pour inspecter les locataires et passerelles de chaque agence.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center rounded-lg bg-black/40 border border-white/5 p-1 text-xs">
              <button
                onClick={() => setSelectedPlan('all')}
                className={`px-2.5 py-1 rounded-md transition-all ${selectedPlan === 'all' ? 'bg-rose-600 text-white font-semibold' : 'text-neutral-400 hover:text-white'}`}
              >
                Toutes ({totalAgences})
              </button>
              <button
                onClick={() => setSelectedPlan('Plan Pro')}
                className={`px-2.5 py-1 rounded-md transition-all ${selectedPlan === 'Plan Pro' ? 'bg-[#E5B842] text-black font-semibold' : 'text-neutral-400 hover:text-white'}`}
              >
                Plan Pro
              </button>
              <button
                onClick={() => setSelectedPlan('Entreprise')}
                className={`px-2.5 py-1 rounded-md transition-all ${selectedPlan === 'Entreprise' ? 'bg-rose-600 text-white font-semibold' : 'text-neutral-400 hover:text-white'}`}
              >
                Entreprise
              </button>
              <button
                onClick={() => setSelectedPlan('Gratuit')}
                className={`px-2.5 py-1 rounded-md transition-all ${selectedPlan === 'Gratuit' ? 'bg-neutral-700 text-white font-semibold' : 'text-neutral-400 hover:text-white'}`}
              >
                Gratuit
              </button>
              <button
                onClick={() => setSelectedPlan('suspended')}
                className={`px-2.5 py-1 rounded-md transition-all ${selectedPlan === 'suspended' ? 'bg-rose-950 text-rose-300 font-semibold' : 'text-neutral-400 hover:text-white'}`}
              >
                Suspendues
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input 
                type="text"
                placeholder="Rechercher agence, gérant, ville..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-black/40 border border-white/5 text-xs text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-rose-500/40"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-neutral-400 font-medium">
                  <th className="pb-3 text-xs uppercase tracking-wider">Agence & Siège</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Formule</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Quota Locataires</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Volume Mensuel</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Recouvrement</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Statut</th>
                  <th className="pb-3 text-right text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAgences.length > 0 ? (
                  filteredAgences.map((ag) => {
                    const pct = Math.min(Math.round((ag.locataires / ag.quota) * 100), 100);
                    return (
                      <tr key={ag.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center font-bold text-xs text-rose-400 shrink-0 shadow-inner">
                              {ag.shortName}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-base leading-snug group-hover:text-rose-400 transition-colors">
                                {ag.name}
                              </p>
                              <p className="text-xs text-neutral-500 mt-0.5">
                                {ag.responsable} <span className="opacity-40">·</span> {ag.city}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 text-sm">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            ag.plan === 'Entreprise' ? 'bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/20' :
                            ag.plan === 'Plan Pro' ? 'bg-[#E5B842]/10 text-[#E5B842] ring-1 ring-inset ring-[#E5B842]/20' :
                            'bg-neutral-500/10 text-neutral-400 ring-1 ring-inset ring-neutral-500/20'
                          }`}>
                            {ag.plan}
                          </span>
                        </td>

                        <td className="py-4 text-xs font-mono">
                          <div className="flex items-center justify-between text-neutral-300 mb-1 max-w-[120px]">
                            <span className="font-bold text-white">{ag.locataires}</span>
                            <span className="text-neutral-500">/ {ag.quota}</span>
                          </div>
                          <div className="w-28 bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${pct > 90 ? 'bg-rose-500' : 'bg-[#E5B842]'}`} 
                              style={{ width: `${pct}%` }} 
                            />
                          </div>
                        </td>

                        <td className="py-4 text-sm text-neutral-200 font-bold font-mono">
                          {ag.volumeMensuel.toLocaleString()} F
                        </td>

                        <td className="py-4 text-sm">
                          <span className="font-mono font-semibold text-emerald-400">
                            {ag.tauxRecouvrement}%
                          </span>
                        </td>

                        <td className="py-4 text-sm">
                          {ag.status === 'active' ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
                              <span className="h-2 w-2 rounded-full bg-rose-500" /> Suspendu
                            </span>
                          )}
                        </td>

                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Inspect Agency Details Button */}
                            <Button 
                              onClick={() => handleOpenDetail(ag)}
                              size="sm" 
                              className="bg-[#E5B842] hover:bg-[#cdaf35] text-black font-bold text-xs gap-1.5 h-8 px-3 rounded-lg shadow-sm"
                            >
                              <Eye className="h-3.5 w-3.5" /> Détails
                            </Button>

                            {/* Toggle Suspend Action */}
                            <Button 
                              onClick={() => handleToggleStatus(ag.id)}
                              variant="outline"
                              size="sm"
                              className={ag.status === 'active' 
                                ? "bg-rose-950/20 border-rose-500/20 text-rose-400 hover:bg-rose-950/40 text-xs h-8 px-2.5"
                                : "bg-emerald-950/20 border-emerald-500/20 text-emerald-400 hover:bg-emerald-950/40 text-xs h-8 px-2.5"
                              }
                            >
                              {ag.status === 'active' ? 'Suspendre' : 'Activer'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-neutral-500">
                      Aucune agence trouvée avec ces critères.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Deep Agency Inspection Modal */}
      <AgencyDetailModal
        agency={selectedAgency}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
