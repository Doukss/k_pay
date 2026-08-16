import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatFcfa } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import type { RecentPayment } from '../types';

const STATUT_STYLES: Record<RecentPayment['statut'], string> = {
  reussi: 'bg-emerald-500/10 text-emerald-600',
  en_attente: 'bg-amber-500/10 text-amber-600',
  echoue: 'bg-red-500/10 text-red-600',
};

const STATUT_LABELS: Record<RecentPayment['statut'], string> = {
  reussi: 'Réussi',
  en_attente: 'En attente',
  echoue: 'Échoué',
};

const MOYEN_LABELS: Record<RecentPayment['moyenPaiement'], string> = {
  wave: 'Wave',
  orange_money: 'Orange Money',
  especes: 'Espèces',
};

interface RecentPaymentsProps {
  payments: RecentPayment[];
}

export function RecentPayments({ payments }: RecentPaymentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Paiements récents</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {payment.locataire}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {MOYEN_LABELS[payment.moyenPaiement]} ·{' '}
                  {new Date(payment.date).toLocaleDateString('fr-SN', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-foreground">
                  {formatFcfa(payment.montant)}
                </span>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-medium',
                    STATUT_STYLES[payment.statut]
                  )}
                >
                  {STATUT_LABELS[payment.statut]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}