import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { 
  Search, 
  Building, 
  Eye, 
  CheckCircle2, 
  Plus,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Sparkles,
  Check,
  Smartphone,
  Calendar
} from 'lucide-react';
import { AgencyDetailModal } from '../components/AgencyDetailModal';
import { AddAgencyModal } from '../components/AddAgencyModal';
import type { AgencyDetail } from '../types';
import { toast } from 'sonner';
import { api } from '@/shared/api/client';

export default function TenantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilter = searchParams.get('filter');

  const [agences, setAgences] = useState<AgencyDetail[]>([]);
  const [agencyTotal, setAgencyTotal] = useState(0);
  const [agencyStats, setAgencyStats] = useState({ en_regle: 0, essai: 0, retard: 0, suspended: 0 });
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>(urlFilter || 'all');
  const [selectedAgency, setSelectedAgency] = useState<AgencyDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const refreshAgencies = async () => {
    const query = new URLSearchParams({ limit: '100' });
    if (search.trim()) query.set('search', search.trim());
    if (['active', 'suspended'].includes(selectedFilter)) query.set('status', selectedFilter);
    if (['en_regle', 'essai', 'retard'].includes(selectedFilter)) query.set('subscriptionStatus', selectedFilter);
    const { data } = await api.get(`/admin/agencies?${query}`);
    setAgencyTotal(data.total);
    setAgencyStats(data.stats);
    setAgences(data.items.map((a: any) => ({ ...a, id: String(a.id), shortName: a.name.split(/\s+/).map((x: string) => x[0]).join('').slice(0, 2).toUpperCase(), nextRenewalDate: a.nextRenewalDate ? new Date(a.nextRenewalDate).toLocaleDateString('fr-FR') : '—', dateAdhesion: a.dateAdhesion ? new Date(a.dateAdhesion).toLocaleDateString('fr-FR') : '—', lastPaymentDate: a.lastPaymentDate ? new Date(a.lastPaymentDate).toLocaleDateString('fr-FR') : undefined })));
  };

  useEffect(() => { refreshAgencies().catch((error) => toast.error(error instanceof Error ? error.message : 'Chargement des agences impossible')); }, [search, selectedFilter]);

  // Sync if URL search params change
  useEffect(() => {
    if (urlFilter) {
      setSelectedFilter(urlFilter);
    }
  }, [urlFilter]);

  // Pagination (5 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Platform Network Calculations
  const totalAgences = agencyTotal;
  const enRegleCount = agencyStats.en_regle;
  const trialCount = agencyStats.essai;
  const retardCount = agencyStats.retard;

  // Filtered Agences
  const filteredAgences = useMemo(() => {
    return agences.filter((ag) => {
      const matchesSearch = 
        ag.name.toLowerCase().includes(search.toLowerCase()) ||
        ag.responsable.toLowerCase().includes(search.toLowerCase()) ||
        ag.city.toLowerCase().includes(search.toLowerCase()) ||
        ag.phone.toLowerCase().includes(search.toLowerCase());
      
      let matchesFilter = true;
      if (selectedFilter === 'all') matchesFilter = true;
      else if (selectedFilter === 'en_regle') matchesFilter = ag.subscriptionStatus === 'en_regle';
      else if (selectedFilter === 'essai') matchesFilter = ag.subscriptionStatus === 'essai';
      else if (selectedFilter === 'retard') matchesFilter = ag.subscriptionStatus === 'retard';
      else if (selectedFilter === 'suspended') matchesFilter = ag.status === 'suspended';
      else if (selectedFilter === 'active') matchesFilter = ag.status === 'active';
      else if (selectedFilter === 'Starter') matchesFilter = ag.plan === 'Starter';
      else if (selectedFilter === 'Business') matchesFilter = ag.plan === 'Business';
      else if (selectedFilter === 'Entreprise') matchesFilter = ag.plan === 'Entreprise' || ag.plan === 'Plan Pro';
      else matchesFilter = ag.plan === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [agences, search, selectedFilter]);

  // Paginated Slices
  const totalPages = Math.ceil(filteredAgences.length / itemsPerPage) || 1;
  const paginatedAgences = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAgences.slice(start, start + itemsPerPage);
  }, [filteredAgences, currentPage, itemsPerPage]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
    if (filter === 'all') {
      searchParams.delete('filter');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ filter });
    }
  };

  const handleOpenDetail = async (agency: AgencyDetail) => {
    try {
      const { data } = await api.get(`/admin/agencies/${agency.id}`);
      setSelectedAgency({ ...agency, ...data, id: String(data.id), shortName: agency.shortName, nextRenewalDate: data.nextRenewalDate ? new Date(data.nextRenewalDate).toLocaleDateString('fr-FR') : '—', dateAdhesion: data.dateAdhesion ? new Date(data.dateAdhesion).toLocaleDateString('fr-FR') : '—', lastPaymentDate: data.lastPaymentDate ? new Date(data.lastPaymentDate).toLocaleDateString('fr-FR') : undefined });
      setIsModalOpen(true);
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Détails agence indisponibles'); }
  };

  const handleToggleStatus = async (agencyId: string | number) => {
    const agency = agences.find((a) => String(a.id) === String(agencyId)); if (!agency) return;
    const status = agency.status === 'active' ? 'suspended' : 'active';
    try {
      await api.patch(`/admin/agencies/${agencyId}/status`, { status });
      await refreshAgencies();
      if (selectedAgency && String(selectedAgency.id) === String(agencyId)) setSelectedAgency({ ...selectedAgency, status });
      toast.success(status === 'active' ? `Agence "${agency.name}" réactivée` : `Agence "${agency.name}" suspendue`);
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Modification du statut impossible'); }
  };

  const handleRenewSubscription = async (agencyId: string | number) => {
    try { const { data } = await api.post(`/admin/agencies/${agencyId}/renew`, { method: 'Wave' }); await refreshAgencies(); toast.success(`Paiement simulé enregistré (${Number(data.amount).toLocaleString()} FCFA)`); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Renouvellement impossible'); }
  };

  const handleContactWhatsAppRenew = (agency: AgencyDetail) => {
    const rawDigits = agency.phone.replace(/\D/g, '');
    const cleanPhone = rawDigits.startsWith('221') ? rawDigits : `221${rawDigits.slice(-9)}`;
    const text = encodeURIComponent(
      `Bonjour ${agency.responsable}, administration de KeurGui Pay. Votre abonnement mensuel au forfait ${agency.plan} (${agency.subscriptionPrice.toLocaleString()} FCFA/mois) pour l'agence "${agency.name}" est arrivé à échéance (${agency.nextRenewalDate}). Merci de procéder au renouvellement via Wave ou Orange Money pour maintenir l'encaissement actif.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    toast.success(`Relance d'abonnement WhatsApp préparée pour ${agency.responsable}`);
  };

  const handleAddAgency = async (newAgency: AgencyDetail) => {
    const planId = newAgency.plan === 'Entreprise' ? 'enterprise' : newAgency.plan.toLowerCase();
    const { data } = await api.post('/admin/agencies', {
      agencyName: newAgency.name, contactName: newAgency.responsable, email: newAgency.email,
      telephone: newAgency.phone, city: newAgency.city, address: newAgency.address, ninea: newAgency.ninea,
      planId, initialSubscriptionStatus: newAgency.subscriptionStatus === 'en_regle' ? 'paid' : 'trial',
      waveActive: newAgency.gateways.wave.enabled, orangeMoneyActive: newAgency.gateways.orangeMoney.enabled,
      whatsappActive: newAgency.gateways.whatsapp.enabled,
    });
    await refreshAgencies(); setCurrentPage(1);
    toast.success(`Agence créée. Mot de passe provisoire : ${data.credentials.temporaryPassword}`, { duration: 15000 });
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
            Supervisez le parc d'agences clientes, contrôlez la conformité des abonnements mensuels et accédez aux audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold gap-1.5 px-4 shadow-md text-xs h-9"
          >
            <Plus className="h-4 w-4" /> Enregistrer une agence
          </Button>
        </div>
      </div>

      {/* Subscription Compliance KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Agencies */}
        <div 
          onClick={() => handleFilterChange('all')}
          className={`bg-[#121318] border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:border-white/20 ${
            selectedFilter === 'all' ? 'border-rose-500/40 ring-1 ring-rose-500/30' : 'border-white/5'
          }`}
        >
          <div>
            <p className="text-xs text-neutral-400 font-medium">Total Agences</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">{totalAgences}</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Parc national KeurGui Pay</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Building className="h-5 w-5" />
          </div>
        </div>

        {/* En Règle (Payé) */}
        <div 
          onClick={() => handleFilterChange('en_regle')}
          className={`bg-[#121318] border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:border-emerald-500/40 ${
            selectedFilter === 'en_regle' ? 'border-emerald-500 ring-1 ring-emerald-500/30' : 'border-white/5'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs text-emerald-400 font-semibold">En Règle (Payé)</p>
            </div>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{enRegleCount}</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">Cotisation mensuelle à jour</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        {/* Essai 30 Jours */}
        <div 
          onClick={() => handleFilterChange('essai')}
          className={`bg-[#121318] border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:border-[#E5B842]/40 ${
            selectedFilter === 'essai' ? 'border-[#E5B842] ring-1 ring-[#E5B842]/30' : 'border-white/5'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-[#E5B842]" />
              <p className="text-xs text-[#E5B842] font-semibold">Essai 30 Jours</p>
            </div>
            <p className="text-2xl font-bold font-mono text-[#E5B842] mt-1">{trialCount}</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">Période offerte en cours</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-[#E5B842]/10 border border-[#E5B842]/20 flex items-center justify-center text-[#E5B842]">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        {/* Renouvellement Requis / En Retard */}
        <div 
          onClick={() => handleFilterChange('retard')}
          className={`bg-[#121318] border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:border-rose-500/40 ${
            selectedFilter === 'retard' ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-white/5'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-3 w-3 text-rose-400 animate-pulse" />
              <p className="text-xs text-rose-400 font-semibold">Renouvellement Dû</p>
            </div>
            <p className="text-2xl font-bold font-mono text-rose-400 mt-1">{retardCount}</p>
            <p className="text-[11px] text-rose-300/80 mt-0.5 font-medium">Échéance échue · À régulariser</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="bg-[#121318] border-white/5 text-white shadow-xl">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
          <div>
            <CardTitle className="text-lg font-bold">Portefeuille des Agences Immobilières</CardTitle>
            <CardDescription className="text-neutral-400 text-xs mt-0.5">
              Visualisez instantanément quelles agences sont en règle, en période d'essai ou en retard de paiement.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center rounded-lg bg-black/40 border border-white/5 p-1 text-xs gap-1">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-2.5 py-1 rounded-md transition-all ${selectedFilter === 'all' ? 'bg-rose-600 text-white font-semibold' : 'text-neutral-400 hover:text-white'}`}
              >
                Toutes ({totalAgences})
              </button>
              <button
                onClick={() => handleFilterChange('en_regle')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  selectedFilter === 'en_regle' ? 'bg-emerald-600 text-white font-semibold shadow-sm' : 'text-emerald-400 hover:text-emerald-300'
                }`}
              >
                <CheckCircle2 className="h-3 w-3" /> En règle ({enRegleCount})
              </button>
              <button
                onClick={() => handleFilterChange('essai')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  selectedFilter === 'essai' ? 'bg-[#E5B842] text-black font-semibold shadow-sm' : 'text-[#E5B842] hover:text-white'
                }`}
              >
                <Sparkles className="h-3 w-3" /> Essai 30j ({trialCount})
              </button>
              <button
                onClick={() => handleFilterChange('retard')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  selectedFilter === 'retard' ? 'bg-rose-600 text-white font-semibold shadow-sm' : 'text-rose-400 hover:text-rose-300'
                }`}
              >
                <AlertTriangle className="h-3 w-3" /> Renouvellement dû ({retardCount})
              </button>
              <button
                onClick={() => handleFilterChange('suspended')}
                className={`px-2.5 py-1 rounded-md transition-all ${selectedFilter === 'suspended' ? 'bg-rose-950 text-rose-300 font-semibold' : 'text-neutral-400 hover:text-white'}`}
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
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-black/40 border border-white/5 text-xs text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-rose-500/40"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-neutral-400 font-medium">
                  <th className="pb-3 text-xs uppercase tracking-wider">Agence & Ville</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Responsable & Contact</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Forfait Souscrit</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Statut Abonnement</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Locataires</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Statut Réseau</th>
                  <th className="pb-3 text-right text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedAgences.length > 0 ? (
                  paginatedAgences.map((ag) => (
                    <tr key={ag.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Agence & Localisation */}
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center font-bold text-xs text-rose-400 shrink-0 shadow-inner">
                            {ag.shortName}
                          </div>
                          <div>
                            <p className="font-semibold text-white text-sm leading-snug group-hover:text-rose-400 transition-colors">
                              {ag.name}
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              {ag.city}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Responsable & Contact */}
                      <td className="py-3.5">
                        <div>
                          <p className="font-medium text-neutral-200 text-xs">{ag.responsable}</p>
                          <p className="text-[11px] font-mono text-neutral-500 mt-0.5">{ag.phone}</p>
                        </div>
                      </td>

                      {/* Forfait Souscrit & Tarif */}
                      <td className="py-3.5 text-xs">
                        <div>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            ag.plan === 'Entreprise' ? 'bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/20' :
                            ag.plan === 'Plan Pro' || ag.plan === 'Business' ? 'bg-[#E5B842]/10 text-[#E5B842] ring-1 ring-inset ring-[#E5B842]/20' :
                            'bg-neutral-500/10 text-neutral-300 ring-1 ring-inset ring-neutral-500/20'
                          }`}>
                            {ag.plan}
                          </span>
                          <p className="text-[11px] font-mono text-neutral-400 mt-1">
                            {ag.subscriptionPrice.toLocaleString()} F<span className="text-[9px] text-neutral-500">/mois</span>
                          </p>
                        </div>
                      </td>

                      {/* Statut Abonnement (NEW!) */}
                      <td className="py-3.5 text-xs">
                        {ag.subscriptionStatus === 'en_regle' ? (
                          <div>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="h-3 w-3" /> En règle (Payé)
                            </span>
                            <p className="text-[10px] text-neutral-400 mt-1 font-mono flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-neutral-500" /> Échéance : {ag.nextRenewalDate}
                            </p>
                          </div>
                        ) : ag.subscriptionStatus === 'essai' ? (
                          <div>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E5B842]/10 text-[#E5B842] border border-[#E5B842]/20">
                              <Sparkles className="h-3 w-3" /> Essai ({ag.trialDaysRemaining ?? 30}j restants)
                            </span>
                            <p className="text-[10px] text-neutral-400 mt-1 font-mono flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-neutral-500" /> Fin : {ag.nextRenewalDate}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">
                              <AlertTriangle className="h-3 w-3" /> Renouvellement requis
                            </span>
                            <p className="text-[10px] text-rose-400/90 mt-1 font-mono font-semibold flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-rose-400" /> Échu le {ag.nextRenewalDate}
                            </p>
                          </div>
                        )}
                      </td>

                      {/* Locataires */}
                      <td className="py-3.5 text-xs font-mono">
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-black/40 border border-white/5 font-semibold text-white">
                          {ag.locataires} <span className="text-neutral-500 font-normal ml-1">/ {ag.quota}</span>
                        </span>
                      </td>

                      {/* Statut Réseau */}
                      <td className="py-3.5 text-xs">
                        {ag.status === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-rose-400 font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Suspendu
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Regularize if late or in trial */}
                          {ag.subscriptionStatus === 'retard' && (
                            <>
                              <Button
                                onClick={() => handleRenewSubscription(ag.id)}
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1 h-8 px-2.5 rounded-lg shadow-sm"
                                title="Enregistrer le paiement (+30 jours)"
                              >
                                <Check className="h-3.5 w-3.5" /> Régulariser
                              </Button>
                              <Button
                                onClick={() => handleContactWhatsAppRenew(ag)}
                                size="sm"
                                variant="outline"
                                className="bg-rose-950/20 border-rose-500/20 text-rose-400 hover:bg-rose-950/40 text-xs h-8 px-2 rounded-lg"
                                title="Envoyer rappel WhatsApp d'abonnement"
                              >
                                <Smartphone className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}

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
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-neutral-500 text-xs">
                      Aucune agence trouvée avec ces critères.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls (5 per page) */}
          {filteredAgences.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-white/5 text-xs text-neutral-400">
              <div>
                Affichage de <span className="font-semibold text-white font-mono">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
                <span className="font-semibold text-white font-mono">
                  {Math.min(currentPage * itemsPerPage, filteredAgences.length)}
                </span>{' '}
                sur <span className="font-semibold text-white font-mono">{filteredAgences.length}</span> agences
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-black/40 border-white/10 text-neutral-300 hover:bg-neutral-800 text-xs h-8 px-2.5 disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Précédent
                </Button>

                <div className="flex items-center gap-1 mx-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-8 w-8 rounded-lg text-xs font-semibold font-mono transition-colors ${
                        currentPage === pageNum
                          ? 'bg-[#E5B842] text-black shadow-sm'
                          : 'bg-black/30 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-white/5'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-black/40 border-white/10 text-neutral-300 hover:bg-neutral-800 text-xs h-8 px-2.5 disabled:opacity-40"
                >
                  Suivant <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deep Agency Inspection Modal */}
      <AgencyDetailModal
        agency={selectedAgency}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onToggleStatus={handleToggleStatus}
        onRenewSubscription={handleRenewSubscription}
      />

      {/* Add New Partner Agency Modal */}
      <AddAgencyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAgency={handleAddAgency}
        existingAgencies={agences}
      />
    </div>
  );
}
