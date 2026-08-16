const fcfaFormatter = new Intl.NumberFormat('fr-SN', {
  style: 'currency',
  currency: 'XOF',
  maximumFractionDigits: 0,
});

export function formatFcfa(amount: number): string {
  return fcfaFormatter.format(amount);
}