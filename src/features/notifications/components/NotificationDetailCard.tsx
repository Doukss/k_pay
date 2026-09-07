import { 
  CheckCircle2, 
  Send, 
  AlertTriangle, 
  UserPlus, 
  Server, 
  Clock, 
  Phone, 
  Mail, 
  Home, 
  CreditCard, 
  FileText, 
  Trash2, 
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import type { AgencyNotification } from '@/stores/agencyStore';
import { toast } from 'sonner';

interface NotificationDetailCardProps {
  notification: AgencyNotification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onOpenQuittance?: (tenantName: string, property: string, amount: number, reference: string, date: string) => void;
  onNavigateLocataires?: () => void;
  onNavigateEncaissements?: () => void;
}

export function NotificationDetailCard({
  notification,
  onMarkAsRead,
  onDelete,
  onOpenQuittance,
  onNavigateLocataires,
  onNavigateEncaissements
}: NotificationDetailCardProps) {
  const [copiedRef, setCopiedRef] = useState(false);

  const handleCopyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    toast.success('Référence copiée dans le presse-papier');
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const getTypeBadge = () => {
    switch (notification.type) {
      case 'paiement':
        return {
          label: 'Encaissement Mobile',
          icon: CreditCard,
          className: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20',
          iconColor: 'text-emerald-400',
        };
      case 'retard':
        return {
          label: 'Alerte Retard',
          icon: AlertTriangle,
          className: 'bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/20',
          iconColor: 'text-rose-400',
        };
      case 'relance':
        return {
          label: 'Relance Automatisée',
          icon: Send,
          className: 'bg-sky-500/10 text-sky-400 ring-1 ring-inset ring-sky-500/20',
          iconColor: 'text-sky-400',
        };
      case 'locataire':
        return {
          label: 'Dossier Locatif',
          icon: UserPlus,
          className: 'bg-[#E5B842]/10 text-[#E5B842] ring-1 ring-inset ring-[#E5B842]/20',
          iconColor: 'text-[#E5B842]',
        };
      case 'system':
      default:
        return {
          label: 'Système & Passerelles',
          icon: Server,
          className: 'bg-purple-500/10 text-purple-400 ring-1 ring-inset ring-purple-500/20',
          iconColor: 'text-purple-400',
        };
    }
  };

  const badge = getTypeBadge();
  const IconComponent = badge.icon;
  const details = notification.details;

  const handleSendWhatsApp = () => {
    if (!details?.tenantPhone) return;
    const phoneDigits = details.tenantPhone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Bonjour ${details.tenantName || ''},\nCeci est un message de votre gestionnaire immobilier concernant votre location (${details.property || ''}).\nMontant loyer : ${details.amount ? details.amount.toLocaleString() + ' FCFA' : ''}.\nMerci de régulariser via Wave ou Orange Money : https://keurguipay.sn/paiement`
    );
    window.open(`https://wa.me/${phoneDigits}?text=${message}`, '_blank');
  };

  return (
    <Card className="bg-[#121318] border-white/10 text-white shadow-xl overflow-hidden">
      {/* Header bar */}
      <CardHeader className="p-6 pb-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
            <IconComponent className="h-3.5 w-3.5" />
            {badge.label}
          </span>
          {notification.priority === 'high' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Priorité Haute
            </span>
          )}
          <span className="text-xs text-neutral-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {notification.timestamp}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onMarkAsRead && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
              className="h-8 px-2.5 text-xs bg-black/40 border-white/10 hover:bg-white/5 text-neutral-300"
            >
              {notification.isRead ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                  Marqué lu
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 mr-1.5 text-[#E5B842]" />
                  Marquer comme lu
                </>
              )}
            </Button>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(notification.id)}
              className="h-8 w-8 p-0 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
              title="Supprimer la notification"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Title and Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {notification.title}
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed">
            {notification.message || notification.description}
          </p>
        </div>

        {/* Concerned Details Panel */}
        {details && (
          <div className="rounded-xl bg-black/40 border border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E5B842] flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Détails du dossier concerné
              </span>
              {details.paymentMethod && (
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold ${
                  details.paymentMethod === 'Wave' 
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' 
                    : details.paymentMethod === 'Orange Money'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : details.paymentMethod === 'WhatsApp'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/10 text-neutral-300'
                }`}>
                  Passerelle {details.paymentMethod}
                </span>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Tenant Identity */}
              {details.tenantName && (
                <div className="space-y-2 bg-[#14151B] p-3.5 rounded-lg border border-white/5">
                  <span className="text-[11px] uppercase font-semibold text-neutral-400">Locataire &amp; Logement</span>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">{details.tenantName}</p>
                    <p className="text-xs text-neutral-400 flex items-center gap-1">
                      <Home className="h-3 w-3 text-[#E5B842]" />
                      {details.property || 'Logement non spécifié'}
                    </p>
                    {details.tenantPhone && (
                      <p className="text-xs text-neutral-300 font-mono flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3 text-[#E5B842]" />
                        {details.tenantPhone}
                      </p>
                    )}
                    {details.tenantEmail && (
                      <p className="text-xs text-neutral-400 truncate flex items-center gap-1">
                        <Mail className="h-3 w-3 text-[#E5B842]" />
                        {details.tenantEmail}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Financials / Transaction */}
              {details.amount !== undefined && (
                <div className="space-y-2 bg-[#14151B] p-3.5 rounded-lg border border-white/5">
                  <span className="text-[11px] uppercase font-semibold text-neutral-400">Montant &amp; Référence</span>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold font-mono text-[#E5B842]">
                        {details.amount.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-neutral-400">FCFA</span>
                    </div>

                    {details.reference && (
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                        <span className="text-[11px] text-neutral-400">Réf. transaction :</span>
                        <div className="flex items-center gap-1">
                          <code className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            {details.reference}
                          </code>
                          <button
                            onClick={() => handleCopyRef(details.reference!)}
                            className="p-1 hover:text-white text-neutral-400 transition-colors"
                            title="Copier la référence"
                          >
                            {copiedRef ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {details.delayDays !== undefined && details.delayDays > 0 && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-neutral-400">Retard accumulé :</span>
                        <span className="text-xs font-bold text-rose-400">
                          {details.delayDays} jours d'échéance
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            {details?.tenantPhone && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendWhatsApp}
                className="bg-emerald-950/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/40 text-xs gap-1.5 h-9"
              >
                <Send className="h-3.5 w-3.5" />
                Relancer par WhatsApp
              </Button>
            )}

            {details && onOpenQuittance && (
              <Button
                size="sm"
                onClick={() =>
                  onOpenQuittance(
                    details.tenantName || 'Locataire',
                    details.property || 'Bien loué',
                    details.amount || 250000,
                    details.reference || 'KP-QUITTANCE-SN',
                    notification.timestamp
                  )
                }
                className="bg-[#E5B842] hover:bg-[#cdaf35] text-black font-semibold text-xs gap-1.5 h-9 shadow-sm"
              >
                <FileText className="h-3.5 w-3.5" />
                Générer la quittance
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onNavigateLocataires && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateLocataires}
                className="text-xs text-neutral-400 hover:text-white hover:bg-white/5 gap-1 h-9"
              >
                Voir locataires
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
            {onNavigateEncaissements && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateEncaissements}
                className="text-xs text-neutral-400 hover:text-white hover:bg-white/5 gap-1 h-9"
              >
                Encaissements
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
