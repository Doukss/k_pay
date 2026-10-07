export type AgencyPlan = 'Starter' | 'Business' | 'Plan Pro' | 'Entreprise' | 'Gratuit';
export type AgencyStatus = 'active' | 'suspended' | 'pending';
export type SubscriptionStatus = 'en_regle' | 'essai' | 'retard';

export interface AgencyTenantItem {
  id: number;
  name: string;
  property: string;
  rentVal: number;
  phone: string;
  status: 'paid' | 'late' | 'pending';
}

export interface AgencyGatewayConfig {
  wave: {
    enabled: boolean;
    merchantId?: string;
    status: 'operational' | 'error' | 'not_configured';
  };
  orangeMoney: {
    enabled: boolean;
    merchantNumber?: string;
    status: 'operational' | 'error' | 'not_configured';
  };
  whatsapp: {
    enabled: boolean;
    phoneNumber?: string;
    status: 'operational' | 'error' | 'not_configured';
  };
}

export interface AgencyDetail {
  id: number;
  name: string;
  shortName: string;
  responsable: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  ninea: string;
  plan: AgencyPlan;
  status: AgencyStatus;
  
  // Subscription compliance & billing
  subscriptionStatus: SubscriptionStatus; // 'en_regle' (payé), 'essai' (30j), 'retard' (échéance dépassée)
  subscriptionPrice: number; // e.g. 15000, 25000, 60000
  nextRenewalDate: string; // e.g. '15 Novembre 2026'
  lastPaymentDate?: string; // e.g. '15 Octobre 2026'
  paymentGateway?: 'Wave' | 'Orange Money';
  trialDaysRemaining?: number; // For agencies in 'essai'
  autoRenew?: boolean;

  locataires: number;
  quota: number;
  volumeMensuel: number;
  commissionRate: number; // percentage, e.g. 1.5%
  commissionsTotal: number;
  tauxRecouvrement: number; // percentage, e.g. 96.5%
  dateAdhesion: string;
  gateways: AgencyGatewayConfig;
  locatairesList: AgencyTenantItem[];
}
