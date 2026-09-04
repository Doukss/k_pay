import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Send, 
  Settings, 
  Menu, 
  Bell, 
  Search, 
  Plus, 
  ChevronRight, 
  X 
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { useAgencyStore } from '@/stores/agencyStore';
import { useAuthStore } from '@/stores/authStore';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { toast } from 'sonner';

interface AgentLayoutProps {
  children: React.ReactNode;
}

export function AgentLayout({ children }: AgentLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const { locataires, recentActivities } = useAgencyStore();
  const { logout } = useAuthStore();

  const lateCount = useMemo(() => {
    return locataires.filter((l) => l.status === 'late').length;
  }, [locataires]);

  const NAV_ITEMS = [
    { label: "Vue d'ensemble", href: '/agence/dashboard', icon: LayoutDashboard },
    { label: 'Locataires', href: '/agence/locataires', icon: Users, badge: locataires.length },
    { label: 'Encaissements', href: '/agence/encaissements', icon: CreditCard },
    { label: 'Relances', href: '/agence/relances', icon: Send, badge: lateCount > 0 ? lateCount : undefined, badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
    { label: 'Paramètres', href: '/agence/parametres', icon: Settings },
  ];

  // Derive breadcrumb text
  const currentNav = NAV_ITEMS.find((item) => location.pathname.startsWith(item.href)) || NAV_ITEMS[0];

  const handleLogout = () => {
    logout();
    toast.info('Déconnexion réussie');
    navigate('/connexion', { replace: true });
  };

  // Quick filtered results for search modal
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return locataires.filter(l => 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.property.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 4);
  }, [searchQuery, locataires]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0A0A0C] text-slate-800 dark:text-neutral-200 font-sans transition-colors duration-200">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0E0F14] md:flex md:flex-col h-full z-20 transition-colors duration-200">
        {/* Logo Section */}
        <div className="flex flex-col px-6 py-6 gap-1.5 border-b border-slate-100 dark:border-white/5 bg-gradient-to-b from-slate-50 dark:from-white/[0.02] to-transparent">
          <div className="flex items-center gap-1.5">
            <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#E5B842] to-[#B38926] flex items-center justify-center font-bold text-black text-sm shadow-md">
              K
            </span>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#E5B842]">KërGui</span>
              <span className="text-slate-900 dark:text-white">Pay</span>
            </span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-600 dark:text-neutral-300 font-medium">immo221</span>
            </div>
            <span className="inline-flex items-center rounded-full bg-[#E5B842]/10 px-2 py-0.5 text-[9px] font-bold text-[#E5B842] ring-1 ring-inset ring-[#E5B842]/20">
              PLAN PRO
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
            Navigation Agence
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 border-l-2 group',
                    isActive
                      ? 'bg-amber-500/10 text-amber-600 border-amber-500 dark:bg-[#E5B842]/10 dark:text-[#E5B842] dark:border-[#E5B842] font-semibold shadow-[0_0_20px_-8px_rgba(229,184,66,0.2)]'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-white/[0.03] dark:hover:text-neutral-200 border-transparent'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-105" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none", item.badgeColor || "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-neutral-300")}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Profile Section */}
        <div className="mt-auto border-t border-slate-200 dark:border-white/5 p-4 bg-slate-50 dark:bg-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8 bg-neutral-800 text-white border border-[#E5B842]/30">
                <AvatarFallback className="bg-neutral-800 text-[#E5B842] text-xs font-bold">IM</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-900 dark:text-white leading-none">Agence immo221</p>
                <p className="text-[10px] text-slate-500 dark:text-neutral-400 mt-1">Dakar, Plateau</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-[10px] text-slate-400 dark:text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-1"
              title="Se déconnecter"
            >
              Quitter
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="relative z-10 flex w-72 flex-col bg-[#0E0F14] border-r border-white/10 shadow-2xl">
            <div className="flex flex-col px-6 py-6 gap-1.5 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#E5B842] to-[#B38926] flex items-center justify-center font-bold text-black text-sm">
                    K
                  </span>
                  <span className="text-xl font-bold tracking-tight">
                    <span className="text-[#E5B842]">KërGui</span>
                    <span className="text-white">Pay</span>
                  </span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 rounded text-neutral-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-6">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-all duration-150 border-l-2',
                        isActive
                          ? 'bg-[#E5B842]/10 text-[#E5B842] border-[#E5B842] font-semibold'
                          : 'text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-200 border-transparent'
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      {item.label}
                    </div>
                    {item.badge !== undefined && (
                      <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", item.badgeColor || "bg-white/10 text-neutral-300")}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden h-full">
        {/* Top Header Bar for Desktop & Mobile */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 dark:border-white/5 bg-white/90 dark:bg-[#0E0F14]/90 px-4 md:px-8 backdrop-blur-md z-10 transition-colors duration-200">
          {/* Left: Mobile hamburger & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white md:hidden"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-neutral-400">
              <span className="hover:text-slate-900 dark:hover:text-neutral-200 cursor-pointer" onClick={() => navigate('/agence/dashboard')}>
                Workspace Agence
              </span>
              <ChevronRight className="h-3 w-3 text-slate-400 dark:text-neutral-600" />
              <span className="font-semibold text-amber-600 dark:text-[#E5B842]">
                {currentNav.label}
              </span>
            </div>
          </div>

          {/* Center: Live Gateway Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 text-[11px] text-slate-600 dark:text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Passerelles Wave &amp; OM opérationnelles</span>
          </div>

          {/* Right: Quick Search, Notifications, Actions */}
          <div className="flex items-center gap-2.5">
            {/* Quick search button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-xs text-neutral-400 hover:border-white/10 hover:text-neutral-200 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Rechercher...</span>
              <kbd className="text-[10px] font-mono bg-white/5 px-1.5 py-0.5 rounded text-neutral-400">⌘K</kbd>
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Notifications with interactive Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 rounded-lg bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/10 transition-colors"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                {recentActivities.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#E5B842] text-[10px] font-bold text-black flex items-center justify-center ring-2 ring-white dark:ring-[#0E0F14]">
                    {recentActivities.length}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-[#14151B] border border-slate-200 dark:border-white/10 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-white">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider">Alertes &amp; Activités</span>
                      <span className="text-[10px] bg-[#E5B842]/20 text-[#E5B842] font-semibold px-1.5 py-0.5 rounded-full font-mono">
                        {recentActivities.length}
                      </span>
                    </div>
                    <button 
                      className="text-[11px] text-slate-400 dark:text-neutral-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                      onClick={() => setIsNotificationsOpen(false)}
                    >
                      Fermer
                    </button>
                  </div>
                  <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((act) => (
                        <div key={act.id} className="p-2 rounded-lg bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5 text-xs space-y-0.5 hover:border-slate-300 dark:hover:border-white/10 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold flex items-center gap-1.5">
                              {act.type === 'paiement' ? (
                                <CreditCard className="h-3 w-3 text-emerald-500" />
                              ) : act.type === 'relance' ? (
                                <Send className="h-3 w-3 text-sky-500" />
                              ) : (
                                <Users className="h-3 w-3 text-[#E5B842]" />
                              )}
                              {act.title}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">{act.time}</span>
                          </div>
                          <p className="text-slate-600 dark:text-neutral-400 text-[11px] pl-4.5">{act.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-xs text-slate-400 dark:text-neutral-500 py-4">Aucune notification</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <Button
              onClick={() => navigate('/agence/locataires')}
              size="sm"
              className="bg-[#E5B842] hover:bg-[#cdaf35] text-black font-semibold text-xs gap-1.5 h-8 px-3 rounded-lg shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Nouveau Locataire</span>
            </Button>
          </div>
        </header>

        {/* Global Quick Search Modal */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="fixed inset-0" onClick={() => setIsSearchOpen(false)} />
            <div className="relative z-10 w-full max-w-lg bg-[#14151B] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
              <div className="flex items-center px-4 py-3 border-b border-white/10">
                <Search className="h-4 w-4 text-neutral-400 mr-2" />
                <input
                  type="text"
                  placeholder="Rechercher un locataire, un logement..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-neutral-500"
                />
                <button onClick={() => setIsSearchOpen(false)} className="text-xs text-neutral-500 hover:text-white">
                  ESC
                </button>
              </div>

              <div className="p-2 max-h-60 overflow-y-auto text-xs">
                {searchResults.length > 0 ? (
                  searchResults.map((loc) => (
                    <div
                      key={loc.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigate('/agence/locataires');
                      }}
                      className="p-2.5 rounded-lg hover:bg-white/5 cursor-pointer flex items-center justify-between text-neutral-300"
                    >
                      <div>
                        <p className="font-semibold text-white">{loc.name}</p>
                        <p className="text-[11px] text-neutral-500">{loc.property} · {loc.rentVal.toLocaleString()} F</p>
                      </div>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold", loc.status === 'paid' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
                        {loc.status === 'paid' ? 'Payé' : 'En retard'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-neutral-500 text-center py-4">
                    {searchQuery ? 'Aucun résultat trouvé' : 'Tapez un nom ou un numéro de logement...'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 w-full max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}