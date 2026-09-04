export type AgencyPlan = 'Gratuit' | 'Plan Pro' | 'Entreprise';
export type AgencyStatus = 'active' | 'suspended' | 'pending';

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
