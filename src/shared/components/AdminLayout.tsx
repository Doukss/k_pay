import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { BarChart3, Building, Activity, Menu, ShieldCheck, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

const NAV_ITEMS = [
  { label: 'Supervision Plateforme', href: '/admin/dashboard', icon: BarChart3 },
  { label: 'Gestion Agences', href: '/admin/tenants', icon: Building },
  { label: 'Monitoring Technique', href: '/admin/monitoring', icon: Activity },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.info('Déconnexion Super Admin réussie');
    navigate('/connexion', { replace: true });
  };

  const currentNav = NAV_ITEMS.find((item) => location.pathname.startsWith(item.href)) || NAV_ITEMS[0];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0A0A0C] text-slate-800 dark:text-neutral-200 font-sans transition-colors duration-200">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#0D0E12] md:flex md:flex-col h-full z-20 transition-colors duration-200">
        {/* Logo Section */}
        <div className="flex flex-col px-6 py-6 gap-1.5 border-b border-slate-100 dark:border-white/5 bg-gradient-to-b from-rose-500/[0.03] to-transparent">
          <div className="flex items-center gap-1.5">
            <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center font-bold text-white text-sm shadow-md">
              SA
            </span>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#E5B842]">KërGui</span>
              <span className="text-slate-900 dark:text-white">Pay</span>
            </span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 dark:border-white/5">
            <span className="text-[11px] text-rose-500 dark:text-rose-400 font-semibold tracking-wider uppercase">Console Admin</span>
            <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-[9px] font-bold text-rose-500 dark:text-rose-400 ring-1 ring-inset ring-rose-500/20">
              SYS-ROOT
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
            Administration
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 border-l-2 group',
                    isActive
                      ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500 font-semibold shadow-[0_0_20px_-8px_rgba(244,63,94,0.2)]'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-white/[0.03] dark:hover:text-neutral-200 border-transparent'
                  )
                }
              >
                <Icon className="h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-105" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Profile Section */}
        <div className="mt-auto border-t border-slate-200 dark:border-white/5 p-4 bg-slate-50 dark:bg-black/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8 bg-neutral-800 text-white border border-rose-500/30">
                <AvatarFallback className="bg-neutral-800 text-rose-400 text-xs font-bold">SA</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-900 dark:text-white leading-none">Super Administrateur</p>
                <p className="text-[10px] text-slate-500 dark:text-neutral-500 mt-1">Accès Intégral</p>
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
          <aside className="relative z-10 flex w-72 flex-col bg-[#0D0E12] border-r border-white/10 shadow-2xl">
            <div className="flex flex-col px-6 py-6 gap-1.5 border-b border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center font-bold text-white text-sm">
                    SA
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
                        'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-150 border-l-2',
                        isActive
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500 font-semibold'
                          : 'text-neutral-400 hover:bg-white/[0.03] hover:text-neutral-200 border-transparent'
                      )
                    }
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden h-full">
        {/* Top Header Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 dark:border-white/5 bg-white/90 dark:bg-[#0D0E12]/90 px-4 md:px-8 backdrop-blur-md z-10 transition-colors duration-200">
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
              <span className="hover:text-slate-900 dark:hover:text-neutral-200 cursor-pointer" onClick={() => navigate('/admin/dashboard')}>
                Administration Système
              </span>
              <ChevronRight className="h-3 w-3 text-slate-400 dark:text-neutral-600" />
              <span className="font-semibold text-rose-500 dark:text-rose-400">
                {currentNav.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 text-[11px] text-slate-600 dark:text-neutral-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Système 100% Opérationnel · DB Cluster OK</span>
            </div>

            <ThemeToggle />

            <Button
              onClick={() => navigate('/admin/monitoring')}
              size="sm"
              variant="outline"
              className="bg-rose-50 dark:bg-black/30 border-rose-200 dark:border-white/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-neutral-800 text-xs gap-1.5 h-8 px-3 rounded-lg"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Diagnostics</span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 w-full max-w-none bg-slate-50 dark:bg-[#0A0A0C] text-slate-800 dark:text-neutral-200 transition-colors duration-200">
          {children}
        </main>
      </div>
    </div>
  );
}
