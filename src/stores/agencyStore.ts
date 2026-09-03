import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Locataire {
  id: number;
  name: string;
  email: string;
  phone: string;
  property: string;
  rentVal: number;
  status: 'paid' | 'late' | 'pending';
  delayDays: number;
  createdAt?: string;
}

export interface Encaissement {
  id: number;
  tenant: string;
  subtitle: string;
  property: string;
  amount: number;
  date: string;
  reference: string;
}

export interface RecentActivity {
  id: number;
  type: 'paiement' | 'relance' | 'locataire';
  title: string;
  description: string;
  amount?: string;
  time: string;
}

interface AgencyState {
  locataires: Locataire[];
  encaissements: Encaissement[];
  recentActivities: RecentActivity[];
  addLocataire: (loc: Omit<Locataire, 'id'>) => void;
  deleteLocataire: (id: number) => void;
  updateLocataire: (id: number, updated: Partial<Locataire>) => void;
  encaisserLoyer: (id: number) => void;
  annulerPaiement: (id: number) => void;
  relancerLocataire: (id: number) => void;
}

export const useAgencyStore = create<AgencyState>()(
  persist(
    (set) => ({
  locataires: [
    {
      id: 1,
      name: 'Mame Diop',
      email: 'mame.diop@email.sn',
      phone: '+221 77 123 45 67',
      property: 'Appartement 2A',
      rentVal: 250000,
      status: 'paid',
      delayDays: 0,
      createdAt: '12 Août 2026 à 09:15',
    },
    {
      id: 2,
      name: 'Samba Ndiaye',
      email: 'samba.ndiaye@email.sn',
      phone: '+221 76 234 56 78',
      property: 'Appartement 3B',
      rentVal: 180000,
      status: 'late',
      delayDays: 15,
      createdAt: '18 Août 2026 à 14:30',
    },
    {
      id: 3,
      name: 'Aïssatou Fall',
      email: 'aissatou.fall@email.sn',
      phone: '+221 78 345 67 80',
      property: 'Studio 1',
      rentVal: 320000,
      status: 'late',
      delayDays: 10,
      createdAt: '25 Août 2026 à 11:20',
    },
    {
      id: 4,
      name: 'Say',
      email: 'mbodji0413@gmail.com',
      phone: '781556521',
      property: '000000000',
      rentVal: 300000,
      status: 'late',
      delayDays: 7,
      createdAt: '01 Sept. 2026 à 17:45',
    },
  ],
  encaissements: [
    {
      id: 1,
      tenant: 'Mame Diop',
      subtitle: 'Règlement reçu par transfert/espèces',
      property: 'Appartement 2A',
      amount: 250000,
      date: '15 Août 2026',
      reference: 'KP-8271-SN',
    },
  ],
  recentActivities: [
    {
      id: 1,
      type: 'paiement',
      title: 'Paiement enregistré',
      description: 'Samba Ndiaye - Appartement 2A',
      amount: '250 000 F',
      time: 'il y a 10 min',
    },
    {
      id: 2,
      type: 'relance',
      title: 'Relance programmée',
      description: 'Aissatou Fall - Appartement 1B',
      amount: 'Échéance dépassée',
      time: 'il y a 2h',
    },
    {
      id: 3,
      type: 'locataire',
      title: 'Nouveau locataire',
      description: 'Aissatou Fall - Studio 1',
      amount: 'à valider',
      time: 'Hier',
    },
  ],

  addLocataire: (loc) =>
    set((state) => {
      const newId = state.locataires.length > 0 ? Math.max(...state.locataires.map((l) => l.id)) + 1 : 1;
      const now = new Date();
      const formattedDate = new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(now).replace(',', ' à');

      const newLoc: Locataire = {
        ...loc,
        status: loc.status || 'pending',
        delayDays: loc.delayDays ?? 0,
        id: newId,
        createdAt: loc.createdAt || formattedDate,
      };

      const newActivity: RecentActivity = {
        id: Date.now(),
        type: 'locataire',
        title: 'Nouveau locataire',
        description: `${newLoc.name} - ${newLoc.property}`,
        amount: 'Actif',
        time: 'À l\'instant',
      };
      return {
        locataires: [...state.locataires, newLoc],
        recentActivities: [newActivity, ...state.recentActivities.slice(0, 4)],
      };
    }),

  deleteLocataire: (id) =>
    set((state) => ({
      locataires: state.locataires.filter((l) => l.id !== id),
    })),

  updateLocataire: (id, updated) =>
    set((state) => ({
      locataires: state.locataires.map((l) => (l.id === id ? { ...l, ...updated } : l)),
    })),

  encaisserLoyer: (id) =>
    set((state) => {
      const loc = state.locataires.find((l) => l.id === id);
      if (!loc) return {};
      
      const updatedLocataires = state.locataires.map((l) =>
        l.id === id ? { ...l, status: 'paid' as const, delayDays: 0 } : l
      );

      const newEncaissement: Encaissement = {
        id: Date.now(),
        tenant: loc.name,
        subtitle: 'Règlement reçu par transfert/espèces',
        property: loc.property,
        amount: loc.rentVal,
        date: 'Aujourd\'hui',
        reference: `KP-${Math.floor(1000 + Math.random() * 9000)}-SN`,
      };

      const newActivity: RecentActivity = {
        id: Date.now(),
        type: 'paiement',
        title: 'Paiement enregistré',
        description: `${loc.name} - ${loc.property}`,
        amount: `${loc.rentVal.toLocaleString()} F`,
        time: 'À l\'instant',
      };

      return {
        locataires: updatedLocataires,
        encaissements: [newEncaissement, ...state.encaissements],
        recentActivities: [newActivity, ...state.recentActivities.slice(0, 4)],
      };
    }),

  annulerPaiement: (id) =>
    set((state) => {
      const loc = state.locataires.find((l) => l.id === id);
      if (!loc) return {};

      const updatedLocataires = state.locataires.map((l) =>
        l.id === id ? { ...l, status: 'late' as const, delayDays: 1 } : l
      );

      return {
        locataires: updatedLocataires,
        encaissements: state.encaissements.filter((e) => e.tenant !== loc.name),
      };
    }),

  relancerLocataire: (id) =>
    set((state) => {
      const loc = state.locataires.find((l) => l.id === id);
      if (!loc) return {};

      const newActivity: RecentActivity = {
        id: Date.now(),
        type: 'relance',
        title: 'Relance envoyée',
        description: `${loc.name} - ${loc.property}`,
        amount: 'WhatsApp',
        time: 'À l\'instant',
      };

      return {
        recentActivities: [newActivity, ...state.recentActivities.slice(0, 4)],
      };
    }),
  }),
  {
    name: 'keurguipay-agency-store',
  }
)
);
