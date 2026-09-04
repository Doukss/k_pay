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
  X,
  Users,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Clock,
  Download
} from 'lucide-react';
import { useAgencyStore, type Locataire } from '@/stores/agencyStore';
import { QuittanceModal, type QuittanceData } from '@/shared/components/QuittanceModal';
import { createWhatsAppPaymentMessage } from '@/shared/utils/whatsapp';
import { exportToCSV } from '@/shared/utils/csvExport';
import { toast } from 'sonner';

// Helper to normalize phone numbers for reliable comparison (keeps last 9 digits)
const normalizePhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  return digits.slice(-9);
};

export default function LocatairesPage() {
  const { 
    locataires, 
    addLocataire, 
    updateLocataire, 
    deleteLocataire, 
    encaisserLoyer, 
    relancerLocataire 
  } = useAgencyStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'liste' | 'cartes'>('liste');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Quittance Modal State
  const [selectedQuittance, setSelectedQuittance] = useState<QuittanceData | null>(null);
  const [isQuittanceOpen, setIsQuittanceOpen] = useState(false);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocataire, setEditingLocataire] = useState<Locataire | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property: '',
    rentVal: '',
  });

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    property?: string;
    rentVal?: string;
  }>({});

  // Delete Confirmation State
  const [locataireToDelete, setLocataireToDelete] = useState<Locataire | null>(null);

  // Quick Stats
  const totalCount = locataires.length;
  const paidCount = locataires.filter(l => l.status === 'paid').length;
  const pendingCount = locataires.filter(l => l.status === 'pending').length;
  const lateCount = locataires.filter(l => l.status === 'late').length;

  // Filtered Locataires
  const filteredLocataires = useMemo(() => {
    return locataires.filter((loc) => {
      const matchesSearch = loc.name.toLowerCase().includes(search.toLowerCase()) || 
                            loc.property.toLowerCase().includes(search.toLowerCase()) ||
                            loc.phone.toLowerCase().includes(search.toLowerCase()) ||
                            loc.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || loc.status === statusFilter;
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

  const handleRelancer = (loc: Locataire) => {
    relancerLocataire(loc.id);
    const msg = createWhatsAppPaymentMessage(loc);
    window.open(msg.whatsappUrl, '_blank');
    toast.success(`Relance WhatsApp préparée pour ${loc.name}`, {
      description: `Lien Wave/OM inclus : ${msg.paymentUrl}`,
    });
  };

  const confirmDelete = () => {
    if (!locataireToDelete) return;
    deleteLocataire(locataireToDelete.id);
    toast.success(`Locataire "${locataireToDelete.name}" supprimé avec succès`);
    setLocataireToDelete(null);
  };

  const handleOpenQuittance = (loc: Locataire) => {
    setSelectedQuittance({
      tenantName: loc.name,
      tenantPhone: loc.phone,
      property: loc.property,
      amount: loc.rentVal,
      month: 'Août 2026',
      paymentMethod: 'Wave Mobile Money',
    });
    setIsQuittanceOpen(true);
  };

  // Open Modal in Add Mode
  const handleOpenAdd = () => {
    setEditingLocataire(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      property: '',
      rentVal: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Modal in Edit Mode
  const handleOpenEdit = (loc: Locataire) => {
    setEditingLocataire(loc);
    setFormData({
      name: loc.name,
      email: loc.email,
      phone: loc.phone,
      property: loc.property,
      rentVal: loc.rentVal.toString(),
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Submit Handler for Add / Edit with Uniqueness Validations
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof formErrors = {};

    // 1. Validate Name
    if (!formData.name.trim()) {
      errors.name = 'Le nom complet du locataire est obligatoire.';
    }

    // 2. Validate Property
    if (!formData.property.trim()) {
      errors.property = 'Le logement ou numéro de bien est obligatoire.';
    }

    // 3. Validate Rent
    if (!formData.rentVal.trim() || isNaN(Number(formData.rentVal)) || Number(formData.rentVal) <= 0) {
      errors.rentVal = 'Veuillez saisir un loyer valide supérieur à 0 FCFA.';
    }

    // 4. Validate Email & Uniqueness
    const trimmedEmail = formData.email.trim().toLowerCase();
    if (!trimmedEmail) {
      errors.email = "L'adresse email est obligatoire.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Veuillez saisir une adresse email valide.';
    } else {
      // Check duplicate email (ignoring the tenant itself if in edit mode)
      const emailExists = locataires.some((l) => 
        (!editingLocataire || l.id !== editingLocataire.id) && 
        l.email.trim().toLowerCase() === trimmedEmail
      );
      if (emailExists) {
        errors.email = 'Cette adresse email est déjà enregistrée pour un autre locataire.';
      }
    }

    // 5. Validate Phone & Uniqueness
    const normalizedInputPhone = normalizePhone(formData.phone);
    if (!formData.phone.trim()) {
      errors.phone = 'Le numéro de téléphone est obligatoire.';
    } else if (normalizedInputPhone.length < 9) {
      errors.phone = 'Numéro invalide (ex: 77 123 45 67 ou +221 77 123 45 67).';
    } else {
      // Check duplicate phone (ignoring the tenant itself if in edit mode)
      const phoneExists = locataires.some((l) => 
        (!editingLocataire || l.id !== editingLocataire.id) && 
        normalizePhone(l.phone) === normalizedInputPhone
      );
      if (phoneExists) {
        errors.phone = 'Ce numéro de téléphone est déjà attribué à un autre locataire.';
      }
    }

    // If there are validation errors, block submission
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error('Veuillez corriger les erreurs de validation');
      return;
    }

    if (editingLocataire) {
      // MODE MODIFICATION
      updateLocataire(editingLocataire.id, {
        name: formData.name.trim(),
        email: trimmedEmail,
        phone: formData.phone.trim(),
        property: formData.property.trim(),
        rentVal: parseInt(formData.rentVal, 10),
      });
      toast.success(`Locataire "${formData.name.trim()}" mis à jour avec succès`);
    } else {
      // MODE AJOUT
      addLocataire({
        name: formData.name.trim(),
        email: trimmedEmail,
        phone: formData.phone.trim(),
        property: formData.property.trim(),
        rentVal: parseInt(formData.rentVal, 10),
        status: 'pending',
        delayDays: 0,
      });
      toast.success(`Nouveau locataire "${formData.name.trim()}" ajouté avec succès (Statut : En attente)`);
    }

    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    const dataToExport = locataires.map((l) => ({
      'Nom du locataire': l.name,
      'Logement': l.property,
      'Loyer Mensuel (FCFA)': l.rentVal,
      'Statut': l.status === 'paid' ? 'À jour' : l.status === 'pending' ? 'En attente' : 'En retard',
      'Jours de retard': l.delayDays,
      'Téléphone': l.phone,
      'Email': l.email,
      'Date d\'enregistrement': l.createdAt || 'N/A',
    }));
    exportToCSV('keurguipay_locataires', dataToExport);
    toast.success('Portefeuille des locataires exporté en CSV (compatible Excel)');
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
            Supervisez votre portefeuille, enregistrez les règlements et éditez les quittances certifiées.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <Button 
            variant="outline"
            onClick={handleExportCSV}
            className="bg-black/40 border-white/10 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold gap-1.5 h-10 px-3.5 shadow-sm"
          >
            <Download className="h-4 w-4 text-[#E5B842]" /> Exporter CSV
          </Button>

          <Button 
            className="bg-[#E5B842] hover:bg-[#cdaf35] text-black font-semibold gap-1.5 px-4 shadow-md h-10"
            onClick={handleOpenAdd}
          >
            <UserPlus className="h-4 w-4" /> Ajouter un locataire
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Total Locataires</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">{totalCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Loyers Réglés</p>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{paidCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">En Attente</p>
            <p className="text-2xl font-bold font-mono text-[#E5B842] mt-1">{pendingCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#E5B842]">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">En Retard</p>
            <p className="text-2xl font-bold font-mono text-rose-400 mt-1">{lateCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Unified Add / Edit Locataire Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsModalOpen(false)} 
          />
          <Card className="relative z-10 w-full max-w-xl bg-[#14151B] border border-white/10 text-white shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
              <div>
                <CardTitle className="text-xl">
                  {editingLocataire ? `Modifier le locataire : ${editingLocataire.name}` : 'Ajouter un nouveau locataire'}
                </CardTitle>
                <CardDescription className="text-neutral-400 mt-1">
                  {editingLocataire 
                    ? 'Mettez à jour les coordonnées et informations locatives du résident.' 
                    : 'Remplissez les informations ci-dessous. L\'email et le téléphone doivent être uniques.'}
                </CardDescription>
                {editingLocataire?.createdAt && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-300">
                    <Clock className="h-3 w-3 text-[#E5B842]" />
                    <span>Ajouté le {editingLocataire.createdAt}</span>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium">Nom complet *</label>
                    <input 
                      type="text" 
                      placeholder="Moussa Ndiaye" 
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                      }}
                      className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none ${formErrors.name ? 'border-rose-500 focus:border-rose-500' : 'border-white/5 focus:border-[#E5B842]/40'}`}
                    />
                    {formErrors.name && (
                      <p className="text-[11px] text-rose-400 font-medium">{formErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium">Logement / Bien *</label>
                    <input 
                      type="text" 
                      placeholder="Appartement 4B" 
                      value={formData.property}
                      onChange={(e) => {
                        setFormData({ ...formData, property: e.target.value });
                        if (formErrors.property) setFormErrors({ ...formErrors, property: undefined });
                      }}
                      className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none ${formErrors.property ? 'border-rose-500 focus:border-rose-500' : 'border-white/5 focus:border-[#E5B842]/40'}`}
                    />
                    {formErrors.property && (
                      <p className="text-[11px] text-rose-400 font-medium">{formErrors.property}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium">Loyer mensuel (FCFA) *</label>
                    <input 
                      type="number" 
                      placeholder="150000" 
                      value={formData.rentVal}
                      onChange={(e) => {
                        setFormData({ ...formData, rentVal: e.target.value });
                        if (formErrors.rentVal) setFormErrors({ ...formErrors, rentVal: undefined });
                      }}
                      className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none ${formErrors.rentVal ? 'border-rose-500 focus:border-rose-500' : 'border-white/5 focus:border-[#E5B842]/40'}`}
                    />
                    {formErrors.rentVal && (
                      <p className="text-[11px] text-rose-400 font-medium">{formErrors.rentVal}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-neutral-400 font-medium">Téléphone (Unique) *</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="+221 77 123 45 67" 
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                        }}
                        className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none ${formErrors.phone ? 'border-rose-500 focus:border-rose-500' : 'border-white/5 focus:border-[#E5B842]/40'}`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-[11px] text-rose-400 font-medium">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400 font-medium">Adresse email (Unique) *</label>
                  <input 
                    type="email" 
                    placeholder="moussa@email.sn" 
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                    }}
                    className={`w-full bg-black/40 border rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none ${formErrors.email ? 'border-rose-500 focus:border-rose-500' : 'border-white/5 focus:border-[#E5B842]/40'}`}
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-rose-400 font-medium">{formErrors.email}</p>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-white/5 mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="bg-black/20 border-white/5 hover:bg-neutral-800 text-neutral-300"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" className="bg-[#E5B842] hover:bg-[#cdaf35] text-black font-semibold">
                    {editingLocataire ? 'Enregistrer les modifications' : 'Ajouter le locataire'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main card panel */}
      <Card className="bg-[#121318] border-white/5 text-white">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
          <CardTitle className="text-lg font-bold">Portefeuille des locataires</CardTitle>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input 
                type="text"
                placeholder="Rechercher nom, bien, tél..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/40 border border-white/5 text-sm text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-[#E5B842]/40"
              />
            </div>

            {/* Filter Status */}
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-lg bg-black/40 border border-white/5 text-sm text-neutral-300 focus:outline-none focus:border-[#E5B842]/40 cursor-pointer"
              >
                <option value="all">Tous les statuts</option>
                <option value="paid">Payé</option>
                <option value="pending">En attente</option>
                <option value="late">En retard</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg bg-black/40 border border-white/5 p-1">
              <button 
                onClick={() => setViewMode('liste')}
                className={`p-1.5 rounded-md ${viewMode === 'liste' ? 'bg-[#E5B842] text-black font-semibold' : 'text-neutral-400 hover:text-white'}`}
                title="Vue Liste"
              >
                <List className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setViewMode('cartes')}
                className={`p-1.5 rounded-md ${viewMode === 'cartes' ? 'bg-[#E5B842] text-black font-semibold' : 'text-neutral-400 hover:text-white'}`}
                title="Vue Cartes"
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {viewMode === 'liste' ? (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-neutral-400 font-medium">
                    <th className="pb-3 text-xs uppercase tracking-wider">Locataire</th>
                    <th className="pb-3 text-xs uppercase tracking-wider">Logement</th>
                    <th className="pb-3 text-xs uppercase tracking-wider">Ajouté le</th>
                    <th className="pb-3 text-xs uppercase tracking-wider">Loyer mensuel</th>
                    <th className="pb-3 text-xs uppercase tracking-wider">Statut</th>
                    <th className="pb-3 text-right text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedLocataires.length > 0 ? (
                    paginatedLocataires.map((loc) => (
                      <tr key={loc.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="py-4">
                          <div>
                            <p className="font-semibold text-white text-base leading-snug">{loc.name}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              {loc.email} <span className="opacity-40">·</span> {loc.phone}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 text-neutral-300 text-sm">{loc.property}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-1.5 text-xs text-neutral-300">
                            <Clock className="h-3.5 w-3.5 text-[#E5B842]" />
                            <span>{loc.createdAt || '12 Août 2026 à 09:15'}</span>
                          </div>
                        </td>
                        <td className="py-4 font-mono font-semibold text-neutral-200 text-sm">{loc.rentVal.toLocaleString()} F</td>
                        <td className="py-4">
                          {loc.status === 'paid' && (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                              Payé
                            </span>
                          )}
                          {loc.status === 'pending' && (
                            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-[#E5B842] ring-1 ring-inset ring-[#E5B842]/20">
                              En attente
                            </span>
                          )}
                          {loc.status === 'late' && (
                            <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400 ring-1 ring-inset ring-rose-500/20">
                              En retard - {loc.delayDays} j
                            </span>
                          )}
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {loc.status === 'paid' ? (
                              <button 
                                onClick={() => handleOpenQuittance(loc)}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#E5B842] hover:bg-[#cdaf35] text-xs font-bold text-black transition-all shadow-sm"
                              >
                                <FileText className="h-3.5 w-3.5" /> Quittance
                              </button>
                            ) : loc.status === 'pending' ? (
                              <button 
                                onClick={() => handleEncaisser(loc.id, loc.name)}
                                className="px-3 py-1 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs font-semibold text-emerald-400 hover:bg-emerald-950/40 transition-colors"
                              >
                                Encaisser
                              </button>
                            ) : (
                              <>
                                <button 
                                  onClick={() => handleEncaisser(loc.id, loc.name)}
                                  className="px-3 py-1 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs font-semibold text-emerald-400 hover:bg-emerald-950/40 transition-colors"
                                >
                                  Encaisser
                                </button>
                                <button 
                                  onClick={() => handleRelancer(loc)}
                                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-neutral-800 border border-white/10 text-xs font-medium text-neutral-300 hover:bg-neutral-700 transition-colors"
                                >
                                  <Send className="h-3 w-3" /> Relancer
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => handleOpenEdit(loc)}
                              className="flex items-center gap-1 p-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                              title="Modifier ce locataire"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => setLocataireToDelete(loc)}
                              className="flex items-center gap-1 p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-400 hover:bg-rose-500/20 transition-colors"
                              title="Supprimer ce locataire"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-500">
                        Aucun locataire trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Card View */
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedLocataires.length > 0 ? (
                paginatedLocataires.map((loc) => (
                  <Card key={loc.id} className="bg-black/20 border-white/5 text-white">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{loc.name}</CardTitle>
                        <CardDescription className="text-xs text-neutral-400 mt-0.5">{loc.property}</CardDescription>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                        loc.status === 'paid' 
                          ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20' 
                          : loc.status === 'pending'
                          ? 'bg-amber-500/10 text-[#E5B842] ring-[#E5B842]/20'
                          : 'bg-rose-500/10 text-rose-400 ring-rose-500/20'
                      }`}>
                        {loc.status === 'paid' ? 'À jour' : loc.status === 'pending' ? 'En attente' : `Retard · ${loc.delayDays}j`}
                      </span>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-1">
                      <div className="space-y-1.5 text-xs text-neutral-300">
                        <div className="flex items-center gap-2 text-neutral-400">
                          <Phone className="h-3.5 w-3.5 text-neutral-500" />
                          <span>{loc.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400">
                          <Mail className="h-3.5 w-3.5 text-neutral-500" />
                          <span className="truncate">{loc.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400 text-[11px] pt-0.5">
                          <Clock className="h-3.5 w-3.5 text-[#E5B842]" />
                          <span>Ajouté le {loc.createdAt || '12 Août 2026 à 09:15'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="text-xs text-neutral-400">Loyer mensuel</span>
                        <span className="font-mono font-bold text-white text-base">
                          {loc.rentVal.toLocaleString()} F
                        </span>
                      </div>

                      {/* Action buttons footer */}
                      <div className="flex flex-wrap items-center justify-end gap-1.5 pt-2 border-t border-white/5">
                        {loc.status === 'paid' ? (
                          <button 
                            onClick={() => handleOpenQuittance(loc)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#E5B842] text-[10px] font-bold text-black hover:bg-[#cdaf35]"
                          >
                            <FileText className="h-3 w-3" /> Quittance
                          </button>
                        ) : loc.status === 'pending' ? (
                          <button 
                            onClick={() => handleEncaisser(loc.id, loc.name)}
                            className="px-2 py-1 rounded bg-emerald-950/20 border border-emerald-500/20 text-[10px] font-medium text-emerald-400 hover:bg-emerald-950/40"
                          >
                            Encaisser
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleEncaisser(loc.id, loc.name)}
                              className="px-2 py-1 rounded bg-emerald-950/20 border border-emerald-500/20 text-[10px] font-medium text-emerald-400 hover:bg-emerald-950/40"
                            >
                              Encaisser
                            </button>
                            <button 
                              onClick={() => handleRelancer(loc)}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-neutral-800 border border-white/10 text-[10px] font-medium text-neutral-300 hover:bg-neutral-700"
                            >
                              <Send className="h-2.5 w-2.5" /> Relancer
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleOpenEdit(loc)}
                          className="flex items-center gap-0.5 p-1 rounded bg-white/5 border border-white/10 text-[10px] font-medium text-neutral-300 hover:text-white hover:bg-white/10"
                          title="Modifier"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => setLocataireToDelete(loc)}
                          className="flex items-center gap-0.5 p-1 rounded bg-rose-500/10 border border-rose-500/20 text-[10px] font-medium text-rose-400 hover:bg-rose-500/20"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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

      {/* Delete Confirmation Modal Popup */}
      {locataireToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="fixed inset-0" 
            onClick={() => setLocataireToDelete(null)} 
          />
          <Card className="relative z-10 w-full max-w-md bg-[#14151B] border border-rose-500/30 text-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <CardHeader className="flex flex-row items-start gap-3 pb-3 border-b border-white/5">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-bold text-white">Supprimer le locataire ?</CardTitle>
                <CardDescription className="text-neutral-400 text-xs mt-1">
                  Cette action est irréversible et supprimera définitivement le locataire.
                </CardDescription>
              </div>
              <button 
                onClick={() => setLocataireToDelete(null)}
                className="rounded-lg p-1 text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Locataire :</span>
                  <span className="font-semibold text-white">{locataireToDelete.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Logement :</span>
                  <span className="text-neutral-300">{locataireToDelete.property}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Loyer mensuel :</span>
                  <span className="font-mono text-[#E5B842] font-semibold">{locataireToDelete.rentVal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Statut actuel :</span>
                  <span className="font-medium text-neutral-300">
                    {locataireToDelete.status === 'paid' ? 'Payé' : locataireToDelete.status === 'pending' ? 'En attente' : `En retard (${locataireToDelete.delayDays}j)`}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocataireToDelete(null)}
                  className="bg-black/30 border-white/10 text-neutral-300 hover:bg-neutral-800 text-xs h-9 px-4"
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={confirmDelete}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs h-9 px-4 shadow-md gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Confirmer la suppression
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Official Quittance Modal */}
      <QuittanceModal 
        isOpen={isQuittanceOpen}
        onClose={() => setIsQuittanceOpen(false)}
        data={selectedQuittance}
      />
    </div>
  );
}
