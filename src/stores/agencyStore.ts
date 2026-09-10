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

export interface AgencyNotification {
  id: string;
  type: 'paiement' | 'relance' | 'retard' | 'locataire' | 'system';
  title: string;
  description: string;
  message: string;
  timestamp: string;
  timeAgo: string;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high';
  details?: {
    tenantId?: number;
    tenantName?: string;
    tenantPhone?: string;
    tenantEmail?: string;
    property?: string;
    amount?: number;
    paymentMethod?: 'Wave' | 'Orange Money' | 'Virement' | 'WhatsApp' | 'Espèces';
    reference?: string;
    delayDays?: number;
    actionType?: 'quittance' | 'relance' | 'locataire' | 'none';
  };
}

export type PlanTier = 'starter' | 'business' | 'pro';

export interface SubscriptionInvoice {
  id: string;
  month: string;
  amount: number;
  date: string;
  paymentMethod: 'Wave' | 'Orange Money';
  reference: string;
  status: 'paid';
}

export interface AgencySubscription {
  planId: PlanTier;
  planName: string;
  price: number;
  maxTenants: number;
  status: 'trial' | 'active' | 'expired';
  isTrial: boolean;
  trialDaysRemaining: number;
  trialExpiresAt: string;
  trialAlreadyUsed: boolean;
  lastPaymentDate?: string;
  nextBillingDate?: string;
  paymentMethod?: 'Wave' | 'Orange Money';
  transactionRef?: string;
  autoRenew?: boolean;
  monthlyRenewalDue?: boolean;
  invoices: SubscriptionInvoice[];
}

interface AgencyState {
  locataires: Locataire[];
  encaissements: Encaissement[];
  recentActivities: RecentActivity[];
  notifications: AgencyNotification[];
  subscription: AgencySubscription;
  addLocataire: (loc: Omit<Locataire, 'id'>) => void;
  deleteLocataire: (id: number) => void;
  updateLocataire: (id: number, updated: Partial<Locataire>) => void;
  encaisserLoyer: (id: number) => void;
  annulerPaiement: (id: number) => void;
  relancerLocataire: (id: number) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notification: Omit<AgencyNotification, 'id' | 'isRead'>) => void;
  startTrial: (planId: 'starter' | 'business') => { success: boolean; message: string };
  paySubscription: (planId: PlanTier, method: 'Wave' | 'Orange Money') => { success: boolean; message: string };
  renewSubscription: (method?: 'Wave' | 'Orange Money') => { success: boolean; message: string };
  toggleAutoRenew: () => void;
  simulateTrialExpiry: () => void;
  simulateMonthlyExpiry: () => void;
  resetTrialTo30Days: () => void;
  resetToDemoData: () => void;
}

const defaultLocataires: Locataire[] = [
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
    name: 'Babacar Ba',
    email: 'babacar.ba@email.sn',
    phone: '+221 77 987 65 43',
    property: 'Duplex Fann Résidence',
    rentVal: 850000,
    status: 'pending',
    delayDays: 0,
    createdAt: '01 Sept. 2026 à 17:45',
  },
];

const defaultEncaissements: Encaissement[] = [
  {
    id: 1,
    tenant: 'Mame Diop',
    subtitle: 'Règlement reçu par transfert/espèces',
    property: 'Appartement 2A',
    amount: 250000,
    date: '15 Août 2026',
    reference: 'KP-8271-SN',
  },
];

const defaultActivities: RecentActivity[] = [
  {
    id: 1,
    type: 'paiement',
    title: 'Paiement enregistré',
    description: 'Samba Ndiaye - Appartement 3B',
    amount: '180 000 F',
    time: 'il y a 10 min',
  },
  {
    id: 2,
    type: 'relance',
    title: 'Relance programmée',
    description: 'Aïssatou Fall - Studio 1',
    amount: 'WhatsApp',
    time: 'il y a 2h',
  },
  {
    id: 3,
    type: 'locataire',
    title: 'Nouveau locataire',
    description: 'Babacar Ba - Duplex Fann',
    amount: 'En attente',
    time: 'Hier',
  },
];

export const defaultNotifications: AgencyNotification[] = [
  {
    id: 'notif-1',
    type: 'paiement',
    title: 'Paiement Wave reçu avec succès',
    description: 'Mame Diop a réglé son loyer de Septembre 2026 (250 000 FCFA).',
    message: 'Le règlement de 250 000 FCFA pour le bien « Appartement 2A » a été exécuté et validé via la passerelle Wave Money Sénégal. Le reçu numérique et la quittance certifiée sont disponibles.',
    timestamp: '07 Sept. 2026 à 14:10',
    timeAgo: 'Il y a 15 min',
    isRead: false,
    priority: 'normal',
    details: {
      tenantId: 1,
      tenantName: 'Mame Diop',
      tenantPhone: '+221 77 123 45 67',
      tenantEmail: 'mame.diop@email.sn',
      property: 'Appartement 2A',
      amount: 250000,
      paymentMethod: 'Wave',
      reference: 'KP-WAVE-8271-SN',
      actionType: 'quittance',
    },
  },
  {
    id: 'notif-2',
    type: 'retard',
    title: 'Alerte retard de paiement critique',
    description: 'Samba Ndiaye présente un impayé de 15 jours (180 000 FCFA).',
    message: 'Le terme d\'échéance légal du 05 du mois est dépassé de 15 jours pour l\'Appartement 3B. Une mise en demeure et une relance personnalisée avec lien de paiement sont fortement recommandées.',
    timestamp: '07 Sept. 2026 à 11:30',
    timeAgo: 'Il y a 3h',
    isRead: false,
    priority: 'high',
    details: {
      tenantId: 2,
      tenantName: 'Samba Ndiaye',
      tenantPhone: '+221 76 234 56 78',
      tenantEmail: 'samba.ndiaye@email.sn',
      property: 'Appartement 3B',
      amount: 180000,
      delayDays: 15,
      actionType: 'relance',
    },
  },
  {
    id: 'notif-3',
    type: 'relance',
    title: 'Relance WhatsApp distribuée',
    description: 'Rappel d\'échéance envoyé avec succès à Aïssatou Fall.',
    message: 'Une relance personnalisée contenant le détail de la créance et le lien direct de paiement Wave & Orange Money a été délivrée sur le numéro WhatsApp +221 78 345 67 80.',
    timestamp: '06 Sept. 2026 à 17:45',
    timeAgo: 'Hier à 17h45',
    isRead: false,
    priority: 'normal',
    details: {
      tenantId: 3,
      tenantName: 'Aïssatou Fall',
      tenantPhone: '+221 78 345 67 80',
      tenantEmail: 'aissatou.fall@email.sn',
      property: 'Studio 1',
      amount: 320000,
      delayDays: 10,
      paymentMethod: 'WhatsApp',
      actionType: 'relance',
    },
  },
  {
    id: 'notif-4',
    type: 'locataire',
    title: 'Nouveau locataire intégré',
    description: 'Babacar Ba a rejoint votre portefeuille (Duplex Fann Résidence).',
    message: 'La fiche locative et les conditions de bail pour Babacar Ba ont été enregistrées avec succès. Montant mensuel : 850 000 FCFA. Les passerelles de recouvrement sont activées.',
    timestamp: '05 Sept. 2026 à 09:20',
    timeAgo: 'Il y a 2 jours',
    isRead: true,
    priority: 'low',
    details: {
      tenantId: 4,
      tenantName: 'Babacar Ba',
      tenantPhone: '+221 77 987 65 43',
      tenantEmail: 'babacar.ba@email.sn',
      property: 'Duplex Fann Résidence',
      amount: 850000,
      actionType: 'locataire',
    },
  },
  {
    id: 'notif-5',
    type: 'system',
    title: 'Passerelle Orange Money vérifiée',
    description: 'Webhook et API Orange Money Sénégal opérationnels (210ms).',
    message: 'Test automatisé périodique exécuté sans incident. Disponibilité 99.98% sur le nœud de paiement Orange Money Sénégal.',
    timestamp: '04 Sept. 2026 à 16:00',
    timeAgo: 'Il y a 3 jours',
    isRead: true,
    priority: 'low',
    details: {
      paymentMethod: 'Orange Money',
      reference: 'SYS-OM-CHECK-99',
      actionType: 'none',
    },
  },
];

export const defaultSubscription: AgencySubscription = {
  planId: 'starter',
  planName: 'Starter (50 locataires)',
  price: 15000,
  maxTenants: 50,
  status: 'trial',
  isTrial: true,
  trialDaysRemaining: 24,
  trialExpiresAt: '04 Oct. 2026',
  trialAlreadyUsed: false,
  autoRenew: true,
  monthlyRenewalDue: false,
  nextBillingDate: '04 Oct. 2026',
  paymentMethod: 'Wave',
  invoices: [
    {
      id: 'KP-INV-2026-08',
      month: 'Août 2026',
      amount: 15000,
      date: '04 Août 2026',
      paymentMethod: 'Wave',
      reference: 'KP-SUB-WAVE-8821-SN',
      status: 'paid',
    },
  ],
};

export const useAgencyStore = create<AgencyState>()(
  persist(
    (set) => ({
      locataires: defaultLocataires,
      encaissements: defaultEncaissements,
      recentActivities: defaultActivities,
      notifications: defaultNotifications,
      subscription: defaultSubscription,

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
          }).format(now);

          const newLocataire: Locataire = {
            ...loc,
            id: newId,
            status: loc.status || 'pending',
            delayDays: loc.delayDays ?? 0,
            createdAt: loc.createdAt || formattedDate,
          };

          const newActivity: RecentActivity = {
            id: Date.now(),
            type: 'locataire',
            title: 'Nouveau locataire ajouté',
            description: `${newLocataire.name} - ${newLocataire.property}`,
            amount: `${newLocataire.rentVal.toLocaleString()} F`,
            time: 'À l\'instant',
          };

          const newNotif: AgencyNotification = {
            id: `notif-${Date.now()}`,
            type: 'locataire',
            title: 'Nouveau locataire enregistré',
            description: `${newLocataire.name} - ${newLocataire.property}`,
            message: `Le locataire ${newLocataire.name} a été enregistré pour le bien ${newLocataire.property} avec un loyer mensuel de ${newLocataire.rentVal.toLocaleString()} FCFA.`,
            timestamp: formattedDate,
            timeAgo: 'À l\'instant',
            isRead: false,
            priority: 'low',
            details: {
              tenantId: newId,
              tenantName: newLocataire.name,
              tenantPhone: newLocataire.phone,
              tenantEmail: newLocataire.email,
              property: newLocataire.property,
              amount: newLocataire.rentVal,
              actionType: 'locataire',
            },
          };

          const existingNotifs = state.notifications || defaultNotifications;

          return {
            locataires: [newLocataire, ...state.locataires],
            recentActivities: [newActivity, ...state.recentActivities.slice(0, 4)],
            notifications: [newNotif, ...existingNotifs],
          };
        }),

      deleteLocataire: (id) =>
        set((state) => {
          const loc = state.locataires.find((l) => l.id === id);
          return {
            locataires: state.locataires.filter((l) => l.id !== id),
            recentActivities: loc
              ? [
                  {
                    id: Date.now(),
                    type: 'locataire',
                    title: 'Locataire retiré',
                    description: `${loc.name} - ${loc.property}`,
                    time: 'À l\'instant',
                  },
                  ...state.recentActivities.slice(0, 4),
                ]
              : state.recentActivities,
          };
        }),

      updateLocataire: (id, updated) =>
        set((state) => ({
          locataires: state.locataires.map((l) =>
            l.id === id ? { ...l, ...updated } : l
          ),
        })),

      encaisserLoyer: (id) =>
        set((state) => {
          const loc = state.locataires.find((l) => l.id === id);
          if (!loc) return {};

          const updatedLocataires = state.locataires.map((l) =>
            l.id === id ? { ...l, status: 'paid' as const, delayDays: 0 } : l
          );

          const now = new Date();
          const formattedDate = now.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
          const timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

          const newEncaissement: Encaissement = {
            id: Date.now(),
            tenant: loc.name,
            subtitle: 'Règlement sécurisé (Wave / Orange Money)',
            property: loc.property,
            amount: loc.rentVal,
            date: formattedDate,
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

          const newNotif: AgencyNotification = {
            id: `notif-${Date.now()}`,
            type: 'paiement',
            title: 'Loyer encaissé avec succès',
            description: `${loc.name} a réglé ${loc.rentVal.toLocaleString()} FCFA`,
            message: `Le paiement du loyer pour ${loc.property} (${loc.name}) d'un montant de ${loc.rentVal.toLocaleString()} FCFA a été validé. Référence : ${newEncaissement.reference}.`,
            timestamp: `${formattedDate} à ${timeString}`,
            timeAgo: 'À l\'instant',
            isRead: false,
            priority: 'normal',
            details: {
              tenantId: loc.id,
              tenantName: loc.name,
              tenantPhone: loc.phone,
              tenantEmail: loc.email,
              property: loc.property,
              amount: loc.rentVal,
              paymentMethod: 'Wave',
              reference: newEncaissement.reference,
              actionType: 'quittance',
            },
          };

          const existingNotifs = state.notifications || defaultNotifications;

          return {
            locataires: updatedLocataires,
            encaissements: [newEncaissement, ...state.encaissements],
            recentActivities: [newActivity, ...state.recentActivities.slice(0, 4)],
            notifications: [newNotif, ...existingNotifs],
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

          const now = new Date();
          const timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
          const formattedDate = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });

          const newActivity: RecentActivity = {
            id: Date.now(),
            type: 'relance',
            title: 'Relance envoyée',
            description: `${loc.name} - ${loc.property}`,
            amount: 'WhatsApp',
            time: 'À l\'instant',
          };

          const newNotif: AgencyNotification = {
            id: `notif-${Date.now()}`,
            type: 'relance',
            title: 'Relance WhatsApp envoyée',
            description: `Notification de relance transmise à ${loc.name}`,
            message: `Une mise en demeure pour impayé (${loc.delayDays} jours de retard) avec le lien de paiement direct a été expédiée via l'API WhatsApp au ${loc.phone}.`,
            timestamp: `${formattedDate} à ${timeString}`,
            timeAgo: 'À l\'instant',
            isRead: false,
            priority: loc.delayDays > 10 ? 'high' : 'normal',
            details: {
              tenantId: loc.id,
              tenantName: loc.name,
              tenantPhone: loc.phone,
              tenantEmail: loc.email,
              property: loc.property,
              amount: loc.rentVal,
              delayDays: loc.delayDays,
              paymentMethod: 'WhatsApp',
              actionType: 'relance',
            },
          };

          const existingNotifs = state.notifications || defaultNotifications;

          return {
            recentActivities: [newActivity, ...state.recentActivities.slice(0, 4)],
            notifications: [newNotif, ...existingNotifs],
          };
        }),

      markAsRead: (id) =>
        set((state) => ({
          notifications: (state.notifications || defaultNotifications).map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: (state.notifications || defaultNotifications).map((n) => ({
            ...n,
            isRead: true,
          })),
        })),

      deleteNotification: (id) =>
        set((state) => ({
          notifications: (state.notifications || defaultNotifications).filter((n) => n.id !== id),
        })),

      addNotification: (notif) =>
        set((state) => ({
          notifications: [
            {
              ...notif,
              id: `notif-${Date.now()}`,
              isRead: false,
            },
            ...(state.notifications || defaultNotifications),
          ],
        })),

      startTrial: (planId) => {
        let result = { success: false, message: '' };
        set((state) => {
          const currentSub = state.subscription || defaultSubscription;
          if (currentSub.trialAlreadyUsed) {
            result = {
              success: false,
              message: "Votre agence a déjà consommé son essai gratuit de 30 jours. L'offre d'essai est réservée à une utilisation unique.",
            };
            return {};
          }

          const now = new Date();
          const expireDate = new Date();
          expireDate.setDate(expireDate.getDate() + 30);
          const formattedExpiry = expireDate.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });

          const planName = planId === 'starter' ? 'Starter (50 locataires)' : 'Business (100 locataires)';
          const price = planId === 'starter' ? 15000 : 25000;
          const maxTenants = planId === 'starter' ? 50 : 100;

          const updatedSub: AgencySubscription = {
            planId,
            planName,
            price,
            maxTenants,
            status: 'trial',
            isTrial: true,
            trialDaysRemaining: 30,
            trialExpiresAt: formattedExpiry,
            trialAlreadyUsed: false,
            autoRenew: true,
            monthlyRenewalDue: false,
            invoices: currentSub.invoices || defaultSubscription.invoices || [],
          };

          const newNotif: AgencyNotification = {
            id: `notif-${Date.now()}`,
            type: 'system',
            title: `Essai gratuit 30 jours activé (${planName})`,
            description: `Profitez de toutes les fonctionnalités jusqu'au ${formattedExpiry}`,
            message: `Votre période d'essai gratuit de 30 jours pour le forfait ${planName} a démarré. À l'issue des 30 jours, activez votre forfait par Wave ou Orange Money.`,
            timestamp: now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
            timeAgo: 'À l\'instant',
            isRead: false,
            priority: 'normal',
          };

          result = {
            success: true,
            message: `Essai gratuit de 30 jours activé avec succès pour le forfait ${planName} !`,
          };

          return {
            subscription: updatedSub,
            notifications: [newNotif, ...(state.notifications || defaultNotifications)],
          };
        });
        return result;
      },

      paySubscription: (planId, method) => {
        let result = { success: true, message: '' };
        set((state) => {
          const now = new Date();
          const nextMonth = new Date();
          nextMonth.setDate(nextMonth.getDate() + 30);

          const formattedNow = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
          const formattedNext = nextMonth.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

          const planName = planId === 'starter' ? 'Starter (50 locataires)' : planId === 'business' ? 'Business (100 locataires)' : 'Plan Pro (Illimité)';
          const price = planId === 'starter' ? 15000 : planId === 'business' ? 25000 : 60000;
          const maxTenants = planId === 'starter' ? 50 : planId === 'business' ? 100 : 9999;
          const ref = `KP-SUB-${method === 'Wave' ? 'WAVE' : 'OM'}-${Math.floor(1000 + Math.random() * 9000)}-SN`;

          const newInvoice: SubscriptionInvoice = {
            id: `KP-INV-${Date.now()}`,
            month: now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
            amount: price,
            date: formattedNow,
            paymentMethod: method,
            reference: ref,
            status: 'paid',
          };

          const currentInvoices = state.subscription?.invoices || defaultSubscription.invoices || [];

          const updatedSub: AgencySubscription = {
            planId,
            planName,
            price,
            maxTenants,
            status: 'active',
            isTrial: false,
            trialDaysRemaining: 0,
            trialExpiresAt: '',
            trialAlreadyUsed: true, // Strictly marked as used
            paymentMethod: method,
            lastPaymentDate: formattedNow,
            nextBillingDate: formattedNext,
            transactionRef: ref,
            autoRenew: state.subscription?.autoRenew ?? true,
            monthlyRenewalDue: false,
            invoices: [newInvoice, ...currentInvoices],
          };

          const newNotif: AgencyNotification = {
            id: `notif-${Date.now()}`,
            type: 'paiement',
            title: `Abonnement ${planName} activé`,
            description: `Règlement de ${price.toLocaleString()} FCFA par ${method}`,
            message: `Félicitations ! Votre abonnement pour l'agence est validé jusqu'au ${formattedNext}. Référence transaction : ${ref}.`,
            timestamp: formattedNow,
            timeAgo: 'À l\'instant',
            isRead: false,
            priority: 'normal',
            details: {
              amount: price,
              paymentMethod: method,
              reference: ref,
            },
          };

          result = {
            success: true,
            message: `Abonnement ${planName} validé par ${method} avec succès !`,
          };

          return {
            subscription: updatedSub,
            notifications: [newNotif, ...(state.notifications || defaultNotifications)],
          };
        });
        return result;
      },

      renewSubscription: (method) => {
        let result = { success: true, message: '' };
        set((state) => {
          const currentSub = state.subscription || defaultSubscription;
          const actualMethod = method || currentSub.paymentMethod || 'Wave';
          const now = new Date();
          const nextMonth = new Date();
          nextMonth.setDate(nextMonth.getDate() + 30);

          const formattedNow = now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
          const formattedNext = nextMonth.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
          const ref = `KP-REN-${actualMethod === 'Wave' ? 'WAVE' : 'OM'}-${Math.floor(1000 + Math.random() * 9000)}-SN`;

          const newInvoice: SubscriptionInvoice = {
            id: `KP-INV-${Date.now()}`,
            month: now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
            amount: currentSub.price,
            date: formattedNow,
            paymentMethod: actualMethod,
            reference: ref,
            status: 'paid',
          };

          const currentInvoices = currentSub.invoices || defaultSubscription.invoices || [];

          const updatedSub: AgencySubscription = {
            ...currentSub,
            status: 'active',
            isTrial: false,
            trialDaysRemaining: 0,
            trialExpiresAt: '',
            trialAlreadyUsed: true,
            monthlyRenewalDue: false,
            paymentMethod: actualMethod,
            lastPaymentDate: formattedNow,
            nextBillingDate: formattedNext,
            transactionRef: ref,
            invoices: [newInvoice, ...currentInvoices],
          };

          const newNotif: AgencyNotification = {
            id: `notif-${Date.now()}`,
            type: 'paiement',
            title: `Renouvellement mensuel validé (${currentSub.planName})`,
            description: `Mensualité de ${currentSub.price.toLocaleString()} FCFA réglée par ${actualMethod}`,
            message: `Votre abonnement a été renouvelé avec succès pour 30 jours jusqu'au ${formattedNext}. Référence : ${ref}.`,
            timestamp: formattedNow,
            timeAgo: 'À l\'instant',
            isRead: false,
            priority: 'normal',
            details: {
              amount: currentSub.price,
              paymentMethod: actualMethod,
              reference: ref,
            },
          };

          result = {
            success: true,
            message: `Abonnement ${currentSub.planName} renouvelé pour 30 jours via ${actualMethod} !`,
          };

          return {
            subscription: updatedSub,
            notifications: [newNotif, ...(state.notifications || defaultNotifications)],
          };
        });
        return result;
      },

      toggleAutoRenew: () =>
        set((state) => ({
          subscription: {
            ...(state.subscription || defaultSubscription),
            autoRenew: !(state.subscription?.autoRenew ?? true),
          },
        })),

      simulateTrialExpiry: () =>
        set((state) => {
          const currentSub = state.subscription || defaultSubscription;
          const updatedSub: AgencySubscription = {
            ...currentSub,
            status: 'expired',
            isTrial: true,
            trialDaysRemaining: 0,
            trialAlreadyUsed: true,
            monthlyRenewalDue: false,
          };

          const now = new Date();
          const newNotif: AgencyNotification = {
            id: `notif-${Date.now()}`,
            type: 'retard',
            title: 'Essai gratuit de 30 jours expiré',
            description: 'Veuillez activer votre abonnement pour débloquer toutes les fonctionnalités',
            message: `Votre période d'essai de 30 jours pour le forfait ${currentSub.planName} est terminée. Activez dès maintenant votre abonnement via Wave ou Orange Money.`,
            timestamp: now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
            timeAgo: 'À l\'instant',
            isRead: false,
            priority: 'high',
          };

          return {
            subscription: updatedSub,
            notifications: [newNotif, ...(state.notifications || defaultNotifications)],
          };
        }),

      simulateMonthlyExpiry: () =>
        set((state) => {
          const currentSub = state.subscription || defaultSubscription;
          const updatedSub: AgencySubscription = {
            ...currentSub,
            status: 'expired',
            monthlyRenewalDue: true,
            isTrial: false,
          };

          const now = new Date();
          const newNotif: AgencyNotification = {
            id: `notif-${Date.now()}`,
            type: 'retard',
            title: 'Renouvellement mensuel requis',
            description: `L'échéance mensuelle de votre abonnement (${currentSub.planName}) est arrivée à terme`,
            message: `Votre abonnement mensuel de ${currentSub.price.toLocaleString()} FCFA est arrivé à échéance de 30 jours. Veuillez effectuer le renouvellement via Wave ou Orange Money pour continuer à gérer vos locataires et loyers.`,
            timestamp: now.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
            timeAgo: 'À l\'instant',
            isRead: false,
            priority: 'high',
          };

          return {
            subscription: updatedSub,
            notifications: [newNotif, ...(state.notifications || defaultNotifications)],
          };
        }),

      resetTrialTo30Days: () =>
        set(() => ({
          subscription: {
            planId: 'starter',
            planName: 'Starter (50 locataires)',
            price: 15000,
            maxTenants: 50,
            status: 'trial',
            isTrial: true,
            trialDaysRemaining: 30,
            trialExpiresAt: '10 Oct. 2026',
            trialAlreadyUsed: false,
            autoRenew: true,
            monthlyRenewalDue: false,
            nextBillingDate: '10 Oct. 2026',
            paymentMethod: 'Wave',
            invoices: defaultSubscription.invoices,
          },
        })),

      resetToDemoData: () =>
        set({
          locataires: defaultLocataires,
          encaissements: defaultEncaissements,
          recentActivities: defaultActivities,
          notifications: defaultNotifications,
          subscription: defaultSubscription,
        }),
    }),
    {
      name: 'keurguipay-agency-store',
    }
  )
);
