import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { 
  DollarSign, 
  Building, 
  Send, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Link } from 'react-router-dom';

const mrrData = [
  { name: 'Mars', mrr: 850000 },
  { name: 'Avril', mrr: 950000 },
  { name: 'Mai', mrr: 1050000 },
  { name: 'Juin', mrr: 1100000 },
  { name: 'Juil.', mrr: 1200000 },
  { name: 'Août', mrr: 1380000 },
];

const mobileMoneyMix = [
  { name: 'Wave Sénégal (68%)', value: 68, color: '#1da1f2' },
  { name: 'Orange Money (32%)', value: 32, color: '#ff7900' },
];

const topAgencies = [
  { rank: 1, name: 'Almadies Rentals & Luxury', volume: '42 100 000 F', locataires: 245, plan: 'Entreprise', recouvrement: '98.4%' },
  { rank: 2, name: 'Point E Properties', volume: '9 800 000 F', locataires: 89, plan: 'Plan Pro', recouvrement: '97.1%' },
  { rank: 3, name: 'Immo Dakar Prestige', volume: '2 450 000 F', locataires: 42, plan: 'Plan Pro', recouvrement: '94.2%' },
];

const recentNetworkTransactions = [
  { id: 1, agency: 'Almadies Rentals', tenant: 'Jean-Marc Dupont', amount: '3 500 000 F', method: 'Wave', status: 'Certifié', time: 'Il y a 5 min' },
  { id: 2, agency: 'Point E Properties', tenant: 'Khadija Wade', amount: '450 000 F', method: 'Orange Money', status: 'Certifié', time: 'Il y a 22 min' },
  { id: 3, agency: 'Immo Dakar', tenant: 'Mame Diop', amount: '250 000 F', method: 'Wave', status: 'Certifié', time: 'Il y a 45 min' },
  { id: 4, agency: 'Saint-Louis Immo', tenant: 'Cheikh Sarr', amount: '120 000 F', method: 'Wave', status: 'Certifié', time: 'Il y a 2 h' },
];

export default function DashboardPage() {
  const stats = [
    {
      title: 'MRR Plateforme (Revenus SaaS)',
      value: '1 380 000 FCFA',
      change: '+18.4% vs mois dernier',
      icon: DollarSign,
      color: 'text-[#E5B842]',
    },
    {
      title: 'Parc d\'Agences Actives',
      value: '14 agences',
      change: 'Sur 15 partenaires affiliés',
      icon: Building,
      color: 'text-rose-400',
    },
    {
      title: 'Volume Loyers Traités (Mois)',
      value: '54 820 000 FCFA',
      change: '100% sécurisé via Mobile Money',
      icon: ShieldCheck,
      color: 'text-emerald-400',
    },
    {
      title: 'Campagnes Relances WhatsApp',
      value: '2 450 envois',
      change: '99.4% taux de délivrabilité',
      icon: Send,
      color: 'text-sky-400',
    },
  ];

  return (
    <div className="space-y-8 bg-[#0A0A0C] text-neutral-200 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
            Console Plateforme · Super Administrateur
          </span>
          <h1 
            className="text-3xl md:text-4xl font-normal text-white mt-1"
            style={{ fontFamily: 'Georgia, ui-serif, serif' }}
          >
            Supervision Générale du Réseau
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Indicateurs financiers consolidés, volumes Wave & Orange Money et suivi des agences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Réseau National Opérationnel
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="bg-[#121318] border-white/5 text-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">{stat.title}</span>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono text-white">{stat.value}</div>
                <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* MRR Growth Chart */}
        <Card className="md:col-span-2 bg-[#121318] border-white/5 text-white shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Croissance des Revenus Plateforme (MRR)</CardTitle>
              <CardDescription className="text-xs text-neutral-400 mt-0.5">
                Évolution des abonnements SaaS et commissions de collecte sur 6 mois
              </CardDescription>
            </div>
            <span className="text-xs font-mono font-bold text-[#E5B842] bg-[#E5B842]/10 border border-[#E5B842]/20 px-2.5 py-1 rounded-lg">
              +62.3% en 2026
            </span>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mrrData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#666" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(v) => `${v / 1000}k`} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  formatter={(value: any) => [`${Number(value).toLocaleString()} FCFA`, 'Revenus MRR']}
                  contentStyle={{ backgroundColor: '#14151B', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="mrr" fill="#E5B842" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mobile Money Mix */}
        <Card className="bg-[#121318] border-white/5 text-white shadow-xl flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold">Mix Paiements Mobile Money</CardTitle>
            <CardDescription className="text-xs text-neutral-400 mt-0.5">
              Part des canaux Wave vs Orange Money
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mobileMoneyMix}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mobileMoneyMix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(v: any) => [`${v}% des règlements`, 'Part']}
                    contentStyle={{ backgroundColor: '#14151B', borderColor: '#333', borderRadius: '8px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full space-y-2 pt-2 border-t border-white/5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-neutral-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#1da1f2]" /> Wave Sénégal
                </span>
                <span className="font-bold text-white font-mono">68 %</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-neutral-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff7900]" /> Orange Money
                </span>
                <span className="font-bold text-white font-mono">32 %</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard & Live Transactions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Agencies */}
        <Card className="bg-[#121318] border-white/5 text-white shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-bold">Top 3 Agences les plus Performantes</CardTitle>
              <CardDescription className="text-xs text-neutral-400 mt-0.5">
                Classées par volume de collecte et taux de recouvrement
              </CardDescription>
            </div>
            <Link to="/admin/tenants" className="text-xs text-rose-400 hover:underline">
              Voir tout
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {topAgencies.map((agency) => (
              <div key={agency.rank} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center font-bold text-xs text-rose-400">
                    #{agency.rank}
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-white">{agency.name}</p>
                    <p className="text-[11px] text-neutral-500">{agency.locataires} locataires · Plan {agency.plan}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-[#E5B842] text-sm">{agency.volume}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">{agency.recouvrement} recouvré</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Live Network Transactions */}
        <Card className="bg-[#121318] border-white/5 text-white shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-bold">Flux Réseau en Direct</CardTitle>
              <CardDescription className="text-xs text-neutral-400 mt-0.5">
                Dernières transactions validées et certifiées par la plateforme
              </CardDescription>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </CardHeader>
          <CardContent className="space-y-3">
            {recentNetworkTransactions.map((tx) => (
              <div key={tx.id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">{tx.tenant}</p>
                  <p className="text-[11px] text-neutral-500">{tx.agency} · {tx.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-white">{tx.amount}</p>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${tx.method === 'Wave' ? 'text-[#1da1f2]' : 'text-[#ff7900]'}`}>
                    {tx.method} · {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
