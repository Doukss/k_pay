import { create } from 'zustand';
import { api } from '@/shared/api/client';

export interface Locataire {
  id: string; name: string; email: string; phone: string; property: string; rentVal: number;
  status: 'paid' | 'late' | 'pending'; delayDays: number; createdAt?: string;
}
export interface Encaissement { id: string; tenant: string; subtitle: string; property: string; amount: number; date: string; reference: string; method?: string; status?: string; billingPeriod?: string }
export interface RecentActivity { id: string; type: 'paiement' | 'relance' | 'locataire'; title: string; description: string; amount?: string; time: string }
export interface AgencyNotification {
  id: string; type: 'paiement' | 'relance' | 'retard' | 'locataire' | 'system'; title: string; description: string;
  message: string; timestamp: string; timeAgo: string; isRead: boolean; priority: 'low' | 'normal' | 'high';
  details?: { tenantId?: string; tenantName?: string; tenantPhone?: string; tenantEmail?: string; property?: string; amount?: number; paymentMethod?: 'Wave' | 'Orange Money' | 'Virement' | 'WhatsApp' | 'Espèces'; reference?: string; delayDays?: number; actionType?: 'quittance' | 'relance' | 'locataire' | 'none' };
}
export type PlanTier = 'starter' | 'business' | 'pro';
export interface SubscriptionInvoice { id: string; month: string; amount: number; date: string; paymentMethod: 'Wave' | 'Orange Money'; reference: string; status: 'paid' }
export interface AgencySubscription {
  planId: PlanTier; planName: string; price: number; maxTenants: number; status: 'trial' | 'active' | 'expired';
  isTrial: boolean; trialDaysRemaining: number; trialExpiresAt: string; trialAlreadyUsed: boolean;
  lastPaymentDate?: string; nextBillingDate?: string; paymentMethod?: 'Wave' | 'Orange Money'; transactionRef?: string;
  autoRenew?: boolean; monthlyRenewalDue?: boolean; invoices: SubscriptionInvoice[];
}
interface AgencyState {
  locataires: Locataire[]; encaissements: Encaissement[]; recentActivities: RecentActivity[]; notifications: AgencyNotification[];
  subscription: AgencySubscription | null; loaded: boolean;
  clearData: () => void;
  loadData: () => Promise<void>;
  addLocataire: (loc: Omit<Locataire, 'id' | 'createdAt'>) => Promise<void>;
  deleteLocataire: (id: string) => Promise<void>; updateLocataire: (id: string, updated: Partial<Locataire>) => Promise<void>;
  encaisserLoyer: (id: string, method?: 'wave' | 'orange_money' | 'especes') => Promise<{ reference: string }>;
  annulerPaiement: (id: string) => Promise<void>; relancerLocataire: (id: string) => Promise<{ whatsappUrl?: string; paymentUrl?: string; message?: string; sent?: boolean }>;
  markAsRead: (id: string) => Promise<void>; markAllAsRead: () => Promise<void>; deleteNotification: (id: string) => Promise<void>;
  addNotification: (notification: Omit<AgencyNotification, 'id' | 'isRead'>) => void;
  startTrial: (planId: 'starter' | 'business') => { success: boolean; message: string };
  paySubscription: (planId: PlanTier, method: 'Wave' | 'Orange Money') => Promise<{ success: boolean; message: string }>;
  renewSubscription: (method?: 'Wave' | 'Orange Money') => Promise<{ success: boolean; message: string }>;
  toggleAutoRenew: () => Promise<void>; simulateTrialExpiry: () => void; simulateMonthlyExpiry: () => void;
  resetTrialTo30Days: () => void; resetToDemoData: () => Promise<void>;
}

const displayDate = (value?: string) => value ? new Date(value).toLocaleDateString('fr-FR') : '';
const mapSubscription = (data: any): AgencySubscription => ({
  planId: data.planId, planName: data.planName, price: Number(data.price), maxTenants: data.maxTenants,
  status: data.status, isTrial: data.isTrial, trialDaysRemaining: data.trialDaysRemaining || 0,
  trialExpiresAt: displayDate(data.trialExpiresAt), trialAlreadyUsed: data.trialAlreadyUsed,
  lastPaymentDate: displayDate(data.lastPaymentDate), nextBillingDate: displayDate(data.nextBillingDate),
  paymentMethod: data.paymentMethod, transactionRef: data.transactionRef, autoRenew: data.autoRenew,
  monthlyRenewalDue: data.monthlyRenewalDue,
  invoices: (data.invoices || []).map((invoice: any) => ({ ...invoice, amount: Number(invoice.amount), date: displayDate(invoice.date) })),
});

export const useAgencyStore = create<AgencyState>((set, get) => {
  const loadData = async () => {
    try {
      const [tenants, payments, activities, notifications, subscription] = await Promise.all([
        api.get('/tenants?limit=100'), api.get('/payments?limit=100'), api.get('/agency/activities?limit=10'),
        api.get('/notifications?limit=100'), api.get('/subscriptions/current'),
      ]);
      set({
      locataires: tenants.data.items.map((t: any) => ({ ...t, rentVal: Number(t.rentVal), createdAt: displayDate(t.createdAt) })),
      encaissements: payments.data.items.map((p: any) => ({ id: p.id, tenant: p.tenant, subtitle: p.subtitle, property: p.property, amount: p.amount, date: displayDate(p.date), reference: p.reference, method: p.method, status: p.status, billingPeriod: p.billingPeriod })),
      recentActivities: activities.data.items.map((a: any) => ({ id: a.id, type: a.type, title: a.title, description: a.description, amount: a.amount, time: a.time })),
      notifications: notifications.data.items.map((n: any) => ({ ...n, timestamp: displayDate(n.createdAt), timeAgo: n.timeAgo || '', details: n.details || undefined })),
        subscription: mapSubscription(subscription.data), loaded: true,
      });
    } catch (error) { set({ loaded: true }); throw error; }
  };
  return {
    locataires: [], encaissements: [], recentActivities: [], notifications: [], subscription: null, loaded: false,
    clearData: () => set({ locataires: [], encaissements: [], recentActivities: [], notifications: [], subscription: null, loaded: false }),
    loadData,
    addLocataire: async (loc) => {
      // The API creates tenants with their initial status and delay from database defaults.
      // Send only fields accepted by the strict createTenantSchema.
      const { name, email, phone, property, rentVal } = loc;
      await api.post('/tenants', { name, email, phone, property, rentVal });
      await loadData();
    },
    deleteLocataire: async (id) => { await api.delete(`/tenants/${id}`); await loadData(); },
    updateLocataire: async (id, updated) => { await api.patch(`/tenants/${id}`, updated); await loadData(); },
    encaisserLoyer: async (id, method = 'wave') => { const { data } = await api.post(`/tenants/${id}/payments`, { moyenPaiement: method }); await loadData(); return { reference: data.reference }; },
    annulerPaiement: async () => { throw new Error("L'annulation d'un encaissement n'est pas proposée par l'API."); },
    relancerLocataire: async (id) => { const { data } = await api.post(`/reminders/${id}`); await loadData(); return data; },
    markAsRead: async (id) => { await api.patch(`/notifications/${id}/read`); set((s) => ({ notifications: s.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n) })); },
    markAllAsRead: async () => { await api.patch('/notifications/read-all'); set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, isRead: true })) })); },
    deleteNotification: async (id) => { await api.delete(`/notifications/${id}`); set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })); },
    addNotification: () => undefined,
    startTrial: () => ({ success: false, message: "L'essai est activé automatiquement à la création du compte." }),
    paySubscription: async (planId, method) => {
      const { data } = await api.post('/subscriptions/checkout', { planId, method });
      await loadData(); return { success: true, message: data.message };
    },
    renewSubscription: async (method) => {
      const { data } = await api.post('/subscriptions/renew', method ? { method } : {});
      await loadData(); return { success: true, message: data.message };
    },
    toggleAutoRenew: async () => {
      const current = get().subscription; if (!current) return;
      const { data } = await api.patch('/subscriptions/auto-renew', { autoRenew: !current.autoRenew });
      set((s) => ({ subscription: s.subscription ? { ...s.subscription, autoRenew: data.autoRenew } : null }));
    },
    simulateTrialExpiry: () => undefined, simulateMonthlyExpiry: () => undefined, resetTrialTo30Days: () => undefined,
    resetToDemoData: loadData,
  };
});
