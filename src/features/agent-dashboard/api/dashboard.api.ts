import type { DashboardData } from '../types';

// TODO: remplacer par un vrai appel API (Axios) une fois le backend branché
export async function fetchDashboardData(): Promise<DashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    kpis: {
      totalAttendu: 4_250_000,
      totalCollecte: 3_180_000,
      totalImpaye: 1_070_000,
      nombreRetards: 12,
    },
    revenusMensuels: [
      { mois: 'Mars', attendu: 3_800_000, collecte: 3_500_000 },
      { mois: 'Avril', attendu: 3_900_000, collecte: 3_600_000 },
      { mois: 'Mai', attendu: 4_000_000, collecte: 3_400_000 },
      { mois: 'Juin', attendu: 4_100_000, collecte: 3_750_000 },
      { mois: 'Juillet', attendu: 4_200_000, collecte: 3_050_000 },
      { mois: 'Août', attendu: 4_250_000, collecte: 3_180_000 },
    ],
    paiementsRecents: [
      {
        id: '1',
        locataire: 'Fatou Diop',
        montant: 150_000,
        moyenPaiement: 'wave',
        date: '2026-08-14',
        statut: 'reussi',
      },
      {
        id: '2',
        locataire: 'Moussa Ndiaye',
        montant: 200_000,
        moyenPaiement: 'orange_money',
        date: '2026-08-13',
        statut: 'reussi',
      },
      {
        id: '3',
        locataire: 'Aïssatou Ba',
        montant: 175_000,
        moyenPaiement: 'wave',
        date: '2026-08-12',
        statut: 'en_attente',
      },
      {
        id: '4',
        locataire: 'Ibrahima Sarr',
        montant: 120_000,
        moyenPaiement: 'especes',
        date: '2026-08-10',
        statut: 'reussi',
      },
      {
        id: '5',
        locataire: 'Khady Fall',
        montant: 160_000,
        moyenPaiement: 'orange_money',
        date: '2026-08-09',
        statut: 'echoue',
      },
    ],
  };
}