import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const mockAgences = [
  {
    id: 1,
    name: 'Immo Dakar',
    responsable: 'Malick Mbodji',
    plan: 'Plan Pro',
    locataires: 42,
    quota: 100,
    volume: '2 450 000 F',
    date: '12 Jan 2026',
    status: 'active',
  },
  {
    id: 2,
    name: 'Saint-Louis Immo',
    responsable: 'Fatou Diop',
    plan: 'Gratuit',
    locataires: 4,
    quota: 5,
    volume: '320 000 F',
    date: '18 Fév 2026',
    status: 'active',
  },
  {
    id: 3,
    name: 'Point E Properties',
    responsable: 'Amadou Diallo',
    plan: 'Plan Pro',
    locataires: 89,
    quota: 100,
    volume: '9 800 000 F',
    date: '02 Mars 2026',
    status: 'active',
  },
  {
    id: 4,
    name: 'Almadies Rentals',
    responsable: 'Khady Sow',
    plan: 'Entreprise',
    locataires: 245,
    quota: 500,
    volume: '42 100 000 F',
    date: '10 Avril 2026',
    status: 'active',
  },
  {
    id: 5,
    name: 'Thiès Immo',
    responsable: 'Ousmane Fall',
    plan: 'Gratuit',
    locataires: 2,
    quota: 5,
    volume: '150 000 F',
    date: '15 Mai 2026',
    status: 'suspended',
  },
];

export default function TenantsPage() {
  const [search, setSearch] = useState('');

  const filteredAgences = mockAgences.filter((ag) =>
    ag.name.toLowerCase().includes(search.toLowerCase()) ||
    ag.responsable.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = (agency: string, action: string) => {
    toast.success(`Action "${action}" exécutée pour l'agence ${agency}`);
  };

  return (
    <div className="space-y-8 bg-[#0A0A0C] text-neutral-200 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
            Console Plateforme
          </span>
          <h1 
            className="text-3xl md:text-4xl font-normal text-white mt-1"
            style={{ fontFamily: 'Georgia, ui-serif, serif' }}
          >
            Gestion des Agences
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Supervisez les agences immobilières clientes, leurs abonnements et leurs quotas.
          </p>
        </div>
      </div>

      {/* Table Card */}
      <Card className="bg-[#121318] border-white/5 text-white">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
          <CardTitle className="text-lg font-bold">Portefeuille Agences</CardTitle>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input 
              type="text"
              placeholder="Rechercher une agence..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-black/40 border border-white/5 text-sm text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-rose-500/40"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-neutral-400 font-medium">
                  <th className="pb-3 text-xs uppercase tracking-wider">Nom / Responsable</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Plan tarifaire</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Locataires actifs</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Volume Mensuel</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Statut</th>
                  <th className="pb-3 text-right text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAgences.map((ag) => (
                  <tr key={ag.id} className="hover:bg-white/[0.01]">
                    <td className="py-4">
                      <div>
                        <p className="font-semibold text-white text-base leading-snug">{ag.name}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{ag.responsable} · Inscrit le {ag.date}</p>
                      </div>
                    </td>
                    <td className="py-4 text-sm">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        ag.plan === 'Entreprise' ? 'bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/20' :
                        ag.plan === 'Plan Pro' ? 'bg-[#E5B842]/10 text-[#E5B842] ring-1 ring-inset ring-[#E5B842]/20' :
                        'bg-neutral-500/10 text-neutral-400 ring-1 ring-inset ring-neutral-500/20'
                      }`}>
                        {ag.plan}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-neutral-300 font-mono">
                      <span className="font-semibold text-white">{ag.locataires}</span> / {ag.quota}
                    </td>
                    <td className="py-4 text-sm text-neutral-300 font-semibold font-mono">
                      {ag.volume}
                    </td>
                    <td className="py-4 text-sm">
                      {ag.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-500 text-xs font-semibold">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-rose-500 text-xs font-semibold">
                          <span className="h-2 w-2 rounded-full bg-rose-500" /> Suspendu
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => handleAction(ag.name, 'Config Quotas')}
                          variant="outline" 
                          size="sm" 
                          className="bg-black/20 border-white/5 text-xs text-neutral-300 hover:bg-neutral-800"
                        >
                          Quotas
                        </Button>
                        <Button 
                          onClick={() => handleAction(ag.name, ag.status === 'active' ? 'Suspendre' : 'Activer')}
                          variant="outline"
                          size="sm"
                          className={ag.status === 'active' 
                            ? "bg-rose-950/20 border-rose-500/20 text-rose-400 hover:bg-rose-950/40 text-xs"
                            : "bg-emerald-950/20 border-emerald-500/20 text-emerald-400 hover:bg-emerald-950/40 text-xs"
                          }
                        >
                          {ag.status === 'active' ? 'Suspendre' : 'Activer'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
