import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  CheckCheck, 
  CreditCard, 
  Send, 
  AlertTriangle, 
  UserPlus, 
  Server, 
  Clock, 
  ArrowLeft,
  Inbox
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { useAgencyStore } from '@/stores/agencyStore';
import { NotificationDetailCard } from '../components/NotificationDetailCard';
import { QuittanceModal, type QuittanceData } from '@/shared/components/QuittanceModal';
import type { NotificationFilterTab } from '../types';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const notificationIdFromUrl = searchParams.get('id');

  const { 
    notifications = [], 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useAgencyStore();

  const [activeTab, setActiveTab] = useState<NotificationFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(notificationIdFromUrl);

  // Quittance Modal State
  const [selectedQuittance, setSelectedQuittance] = useState<QuittanceData | null>(null);
  const [isQuittanceOpen, setIsQuittanceOpen] = useState(false);

  // Sync selectedId when URL query changes
  useEffect(() => {
    if (notificationIdFromUrl) {
      setSelectedId(notificationIdFromUrl);
      markAsRead(notificationIdFromUrl);
    }
  }, [notificationIdFromUrl, markAsRead]);

  // KPIs
  const totalCount = notifications.length;
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const paiementCount = notifications.filter(n => n.type === 'paiement').length;
  const relanceAlertCount = notifications.filter(n => n.type === 'relance' || n.type === 'retard').length;

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      // Tab filter
      if (activeTab === 'unread' && notif.isRead) return false;
      if (activeTab === 'paiement' && notif.type !== 'paiement') return false;
      if (activeTab === 'relance' && notif.type !== 'relance') return false;
      if (activeTab === 'retard' && notif.type !== 'retard') return false;
      if (activeTab === 'locataire' && notif.type !== 'locataire') return false;
      if (activeTab === 'system' && notif.type !== 'system') return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = notif.title.toLowerCase().includes(q);
        const matchDesc = notif.description.toLowerCase().includes(q);
        const matchMsg = notif.message?.toLowerCase().includes(q);
        const matchTenant = notif.details?.tenantName?.toLowerCase().includes(q);
        const matchProp = notif.details?.property?.toLowerCase().includes(q);
        const matchRef = notif.details?.reference?.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchMsg || matchTenant || matchProp || matchRef;
      }

      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  // Auto-select first item if current selection is invalid
  useEffect(() => {
    if (!selectedId && filteredNotifications.length > 0) {
      setSelectedId(filteredNotifications[0].id);
    } else if (selectedId && !notifications.some(n => n.id === selectedId) && filteredNotifications.length > 0) {
      setSelectedId(filteredNotifications[0].id);
    }
  }, [filteredNotifications, selectedId, notifications]);

  // The active notification object
  const activeNotification = useMemo(() => {
    return notifications.find(n => n.id === selectedId) || null;
  }, [notifications, selectedId]);

  const handleSelectNotification = (id: string) => {
    setSelectedId(id);
    setSearchParams({ id });
    markAsRead(id);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    toast.success('Toutes les notifications ont été marquées comme lues');
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
    toast.info('Notification supprimée');
    if (selectedId === id) {
      const remaining = notifications.filter(n => n.id !== id);
      if (remaining.length > 0) {
        setSelectedId(remaining[0].id);
        setSearchParams({ id: remaining[0].id });
      } else {
        setSelectedId(null);
        setSearchParams({});
      }
    }
  };

  const handleOpenQuittance = (
    tenantName: string, 
    property: string, 
    amount: number, 
    reference: string, 
    date: string
  ) => {
    setSelectedQuittance({
      tenantName: tenantName,
      property: property,
      amount: amount,
      paymentDate: date,
      reference: reference,
      agencyName: 'Agence Immobilière immo221',
      month: 'Septembre 2026',
      paymentMethod: 'Wave Mobile Money',
    });
    setIsQuittanceOpen(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'paiement':
        return <CreditCard className="h-4 w-4 text-emerald-400" />;
      case 'retard':
        return <AlertTriangle className="h-4 w-4 text-rose-400" />;
      case 'relance':
        return <Send className="h-4 w-4 text-sky-400" />;
      case 'locataire':
        return <UserPlus className="h-4 w-4 text-[#E5B842]" />;
      case 'system':
      default:
        return <Server className="h-4 w-4 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6 bg-[#0A0A0C] text-neutral-200 min-h-screen p-1 sm:p-2 pb-12">
      {/* Header section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5B842] flex items-center gap-1.5">
            <Bell className="h-3.5 w-3.5" />
            Centre de communication &amp; traçabilité
          </span>
          <h1 
            className="text-3xl md:text-4xl font-normal text-white mt-1"
            style={{ fontFamily: 'Georgia, ui-serif, serif' }}
          >
            Notifications &amp; Alertes
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Consultez le flux d'événements en direct, les encaissements mobiles et le suivi des relances.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllRead}
              variant="outline"
              size="sm"
              className="bg-neutral-900 border-white/10 hover:bg-neutral-800 text-xs gap-1.5 text-neutral-200"
            >
              <CheckCheck className="h-3.5 w-3.5 text-[#E5B842]" />
              Tout marquer comme lu ({unreadCount})
            </Button>
          )}
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Total des alertes</p>
            <p className="text-2xl font-bold font-mono text-white mt-1">{totalCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300">
            <Bell className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Non lues</p>
            <p className="text-2xl font-bold font-mono text-[#E5B842] mt-1">{unreadCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-[#E5B842]/10 border border-[#E5B842]/20 flex items-center justify-center text-[#E5B842]">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Encaissements</p>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{paiementCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-[#121318] border border-white/5 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 font-medium">Relances &amp; Retards</p>
            <p className="text-2xl font-bold font-mono text-rose-400 mt-1">{relanceAlertCount}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List & Filters (5 cols) */}
        <div className={`space-y-3 lg:col-span-5 ${activeNotification && 'hidden lg:block'}`}>
          {/* Search and Filters */}
          <div className="bg-[#121318] border border-white/5 rounded-xl p-3.5 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              <input 
                type="text"
                placeholder="Rechercher une notification, locataire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-[#E5B842]/50 placeholder-neutral-500"
              />
            </div>

            {/* Filter Tabs Chips */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { key: 'all', label: 'Toutes', count: totalCount },
                { key: 'unread', label: 'Non lues', count: unreadCount },
                { key: 'paiement', label: 'Paiements', count: paiementCount },
                { key: 'relance', label: 'Relances', count: notifications.filter(n => n.type === 'relance').length },
                { key: 'retard', label: 'Retards', count: notifications.filter(n => n.type === 'retard').length },
                { key: 'locataire', label: 'Locataires', count: notifications.filter(n => n.type === 'locataire').length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as NotificationFilterTab)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === tab.key
                      ? 'bg-[#E5B842] text-black font-semibold shadow-sm'
                      : 'bg-black/30 text-neutral-400 hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1 rounded-full ${
                    activeTab === tab.key ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-neutral-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications Feed */}
          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => {
                const isSelected = activeNotification?.id === notif.id;
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleSelectNotification(notif.id)}
                    className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#181920] border-[#E5B842] shadow-[0_0_15px_-4px_rgba(229,184,66,0.15)]'
                        : 'bg-[#121318] border-white/5 hover:border-white/15 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Unread Glowing Dot */}
                      {!notif.isRead && (
                        <span className="absolute top-3.5 right-3 h-2 w-2 rounded-full bg-[#E5B842] animate-pulse" />
                      )}

                      {/* Icon container */}
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        notif.type === 'paiement'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : notif.type === 'retard'
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                          : notif.type === 'relance'
                          ? 'bg-sky-500/10 border-sky-500/20 text-sky-400'
                          : notif.type === 'locataire'
                          ? 'bg-[#E5B842]/10 border-[#E5B842]/20 text-[#E5B842]'
                          : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                      }`}>
                        {getTypeIcon(notif.type)}
                      </div>

                      {/* Content preview */}
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`text-xs font-semibold truncate ${
                            !notif.isRead ? 'text-white font-bold' : 'text-neutral-300'
                          }`}>
                            {notif.title}
                          </p>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                          {notif.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5 text-[10px] text-neutral-400">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="h-2.5 w-2.5 text-neutral-400" />
                            {notif.timeAgo}
                          </span>

                          {notif.details?.amount && (
                            <span className="font-mono font-bold text-[#E5B842]">
                              {notif.details.amount.toLocaleString()} F
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-[#121318] border border-white/5 rounded-xl">
                <Inbox className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-xs text-neutral-400">Aucune notification dans cette catégorie.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed View (7 cols) */}
        <div className={`lg:col-span-7 ${!activeNotification ? 'hidden lg:block' : 'block'}`}>
          {/* Mobile Back button */}
          <div className="lg:hidden mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedId(null)}
              className="text-xs text-neutral-400 hover:text-white gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la liste des notifications
            </Button>
          </div>

          {activeNotification ? (
            <NotificationDetailCard
              notification={activeNotification}
              onMarkAsRead={markAsRead}
              onDelete={handleDelete}
              onOpenQuittance={handleOpenQuittance}
              onNavigateLocataires={() => navigate('/agence/locataires')}
              onNavigateEncaissements={() => navigate('/agence/encaissements')}
            />
          ) : (
            <Card className="bg-[#121318] border-white/5 text-white p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="h-16 w-16 rounded-2xl bg-[#E5B842]/10 border border-[#E5B842]/20 flex items-center justify-center text-[#E5B842] mb-4">
                <Bell className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">Sélectionnez une notification</h3>
              <p className="text-xs text-neutral-400 max-w-sm mt-1">
                Cliquez sur une alerte dans la colonne de gauche pour afficher l'ensemble des détails du locataire, la transaction et les actions rapides.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Official Quittance Modal */}
      <QuittanceModal 
        isOpen={isQuittanceOpen}
        onClose={() => setIsQuittanceOpen(false)}
        data={selectedQuittance}
      />
    </div>
  );
}
