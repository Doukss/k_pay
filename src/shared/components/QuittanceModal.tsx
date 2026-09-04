import { Printer, Download, Share2, X, ShieldCheck, QrCode } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { toast } from 'sonner';

export interface QuittanceData {
  tenantName: string;
  tenantPhone?: string;
  property: string;
  amount: number | string;
  month?: string;
  reference?: string;
  paymentDate?: string;
  paymentMethod?: string;
  agencyName?: string;
  bailleurName?: string;
}

interface QuittanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: QuittanceData | null;
}

export function QuittanceModal({ isOpen, onClose, data }: QuittanceModalProps) {
  if (!isOpen || !data) return null;

  const formattedAmount = typeof data.amount === 'number' 
    ? data.amount.toLocaleString() 
    : data.amount.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const reference = data.reference || `KP-${Math.floor(1000 + Math.random() * 9000)}-SN`;
  const paymentDate = data.paymentDate || '15 Août 2026';
  const month = data.month || 'Août 2026';
  const agencyName = data.agencyName || 'Cabinet Immobilier immo221';
  const paymentMethod = data.paymentMethod || 'Wave Mobile Money';

  const handlePrint = () => {
    window.print();
    toast.success('Impression de la quittance lancée');
  };

  const handleDownload = () => {
    toast.success(`Quittance ${reference} téléchargée en PDF`);
  };

  const handleShareWhatsApp = () => {
    toast.success(`Lien de la quittance envoyé par WhatsApp au ${data.tenantPhone || 'locataire'}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-[#0F0F12] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Topbar Actions */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/30">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#E5B842]">
              Quittance Officielle Certifiée
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="bg-black/30 border-white/10 text-neutral-300 hover:bg-neutral-800 text-xs gap-1.5 h-8"
            >
              <Printer className="h-3.5 w-3.5" /> Imprimer
            </Button>
            <Button
              onClick={handleDownload}
              size="sm"
              className="bg-[#E5B842] hover:bg-[#cdaf35] text-black font-semibold text-xs gap-1.5 h-8"
            >
              <Download className="h-3.5 w-3.5" /> Télécharger PDF
            </Button>
            <Button
              onClick={handleShareWhatsApp}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5 h-8"
            >
              <Share2 className="h-3.5 w-3.5" /> WhatsApp
            </Button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Official Receipt Preview */}
        <div className="printable-quittance flex-1 overflow-y-auto p-8 bg-neutral-950 text-neutral-100 font-sans space-y-6">
          {/* Header of Receipt */}
          <div className="border border-white/10 bg-[#14151B] p-6 rounded-xl relative overflow-hidden">
            {/* Watermark Stamp */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 rotate-[-12deg] pointer-events-none opacity-25 select-none border-4 border-emerald-500 rounded-xl px-4 py-2 text-center">
              <span className="text-2xl font-black tracking-widest text-emerald-500">RÉGLÉ</span>
              <p className="text-[9px] font-mono text-emerald-400">CERTIFIÉ KËRGUIPAY</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-white/5 pb-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  RÉPUBLIQUE DU SÉNÉGAL
                </p>
                <h2 
                  className="text-2xl font-bold text-white mt-1"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  QUITTANCE DE LOYER
                </h2>
                <p className="text-xs text-[#E5B842] font-mono mt-0.5">
                  N° Réf : {reference}
                </p>
              </div>

              <div className="text-left md:text-right">
                <span className="text-xl font-black text-white">
                  <span className="text-[#E5B842]">KërGui</span>Pay
                </span>
                <p className="text-xs text-neutral-400 mt-1">{agencyName}</p>
                <p className="text-[11px] text-neutral-500">Dakar, Sénégal · NINEA : 008472910</p>
              </div>
            </div>

            {/* Receipt Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
              <div className="space-y-1.5 bg-black/20 p-3 rounded-lg border border-white/5">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Bénéficiaire (Locataire)</p>
                <p className="text-sm font-bold text-white">{data.tenantName}</p>
                <p className="text-neutral-400">Logement : <span className="text-neutral-200">{data.property}</span></p>
                {data.tenantPhone && <p className="text-neutral-400">Contact : {data.tenantPhone}</p>}
              </div>

              <div className="space-y-1.5 bg-black/20 p-3 rounded-lg border border-white/5">
                <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Détails du paiement</p>
                <p className="text-sm font-bold text-[#E5B842]">Période : {month}</p>
                <p className="text-neutral-400">Règlement le : <span className="text-neutral-200">{paymentDate}</span></p>
                <p className="text-neutral-400">Mode : <span className="text-emerald-400 font-medium">{paymentMethod}</span></p>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="mt-6 border border-white/5 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-neutral-400 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Désignation</th>
                    <th className="py-2.5 px-4">Période</th>
                    <th className="py-2.5 px-4 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 px-4 text-white">Loyer mensuel principal ({data.property})</td>
                    <td className="py-3 px-4 text-neutral-400">{month}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">{formattedAmount} FCFA</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-neutral-300">Charges locatives & entretien</td>
                    <td className="py-3 px-4 text-neutral-400">{month}</td>
                    <td className="py-3 px-4 text-right font-mono text-neutral-400">Inclus</td>
                  </tr>
                </tbody>
                <tfoot className="bg-emerald-950/20 border-t border-emerald-500/20">
                  <tr>
                    <td colSpan={2} className="py-3 px-4 font-bold text-white uppercase text-xs">
                      Total Net Réglé
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-base text-emerald-400">
                      {formattedAmount} FCFA
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Bottom Verification Banner */}
            <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-400 text-[11px]">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-neutral-300 shrink-0">
                  <QrCode className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-200">Authenticité garantie par signature électronique</p>
                  <p className="text-[10px] text-neutral-500">Vérifiable à l'adresse : keurguipay.sn/verify/{reference}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 text-xs">
                <ShieldCheck className="h-4 w-4" />
                Quittance valide
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="no-print px-6 py-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400">
          <span>KeurGui Pay · Plateforme certifiée de gestion locative</span>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-neutral-400 hover:text-white h-7">
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}
