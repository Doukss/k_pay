export interface DashboardKpis {
  totalAttendu: number;
  totalCollecte: number;
  totalImpaye: number;
  nombreRetards: number;
}

export interface MonthlyRevenue {
  mois: string;
  attendu: number;
  collecte: number;
}

export interface RecentPayment {
  id: string;
  locataire: string;
  montant: number;
  moyenPaiement: 'wave' | 'orange_money' | 'especes';
  date: string;
  statut: 'reussi' | 'en_attente' | 'echoue';
}

export interface DashboardData {
  kpis: DashboardKpis;
  revenusMensuels: MonthlyRevenue[];
  paiementsRecents: RecentPayment[];
}