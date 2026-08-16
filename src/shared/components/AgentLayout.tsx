import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Send, Settings, Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { toast } from 'sonner';

const NAV_ITEMS = [
  { label: "Vue d'ensemble", href: '/agence/dashboard', icon: LayoutDashboard },
  { label: 'Locataires', href: '/agence/locataires', icon: Users },
  { label: 'Encaissements', href: '/agence/encaissements', icon: CreditCard },
  { label: 'Relances', href: '/agence/relances', icon: Send },
  { label: 'Paramètres', href: '/agence/parametres', icon: Settings },
];

interface AgentLayoutProps {
  children: React.ReactNode;
}

export function AgentLayout({ children }: AgentLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.info('Déconnexion réussie');
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0C] text-neutral-200 font-sans">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-[#0F0F12] md:flex md:flex-col h-full">
        {/* Logo Section */}
        <div className="flex flex-col px-6 py-6 gap-1.5 border-b border-white/5">
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#E5B842]">KërGui</span>
              <span className="text-white">Pay</span>
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-[#E5B842]/80 font-medium">immo221</span>
            <span className="inline-flex items-center rounded-full bg-[#E5B842]/10 px-2 py-0.5 text-[10px] font-bold text-[#E5B842] ring-1 ring-inset ring-[#E5B842]/20">
              PLAN PRO
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-150 border-l-2',
                    isActive
                      ? 'bg-[#E5B842]/5 text-[#E5B842] border-[#E5B842] font-semibold'
                      : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200 border-transparent'
                  )
                }
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Profile Section */}
        <div className="mt-auto border-t border-white/5 p-4 flex items-center justify-between bg-black/10">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 bg-neutral-800 text-white border border-white/10">
              <AvatarFallback className="bg-neutral-800 text-white text-xs font-semibold">IM</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-xs font-semibold text-white leading-none">immo221</p>
              <button
                onClick={handleLogout}
                className="text-[10px] text-neutral-400 hover:text-[#E5B842] transition-colors mt-1 inline-block leading-none"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="relative z-10 flex w-64 flex-col bg-[#0F0F12] border-r border-white/5">
            <div className="flex flex-col px-6 py-6 gap-1.5 border-b border-white/5">
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-[#E5B842]">KërGui</span>
                  <span className="text-white">Pay</span>
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-[#E5B842]/80 font-medium">immo221</span>
                <span className="inline-flex items-center rounded-full bg-[#E5B842]/10 px-2 py-0.5 text-[10px] font-bold text-[#E5B842] ring-1 ring-inset ring-[#E5B842]/20">
                  PLAN PRO
                </span>
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
                        'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-150 border-l-2',
                        isActive
                          ? 'bg-[#E5B842]/5 text-[#E5B842] border-[#E5B842] font-semibold'
                          : 'text-neutral-400 hover:bg-neutral-900/50 hover:text-neutral-200 border-transparent'
                      )
                    }
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
            <div className="mt-auto border-t border-white/5 p-4 flex items-center justify-between bg-black/10">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 bg-neutral-800 text-white border border-white/10">
                  <AvatarFallback className="bg-neutral-800 text-white text-xs font-semibold">IM</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white leading-none">immo221</p>
                  <button
                    onClick={handleLogout}
                    className="text-[10px] text-neutral-400 hover:text-[#E5B842] transition-colors mt-1 inline-block leading-none"
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden h-full">
        {/* Mobile Header only */}
        <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0F0F12] px-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-neutral-400 hover:text-white"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-lg font-bold tracking-tight">
            <span className="text-[#E5B842]">KërGui</span>
            <span className="text-white">Pay</span>
          </span>
          <div className="w-9 h-9" /> {/* Spacer */}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 w-full max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}