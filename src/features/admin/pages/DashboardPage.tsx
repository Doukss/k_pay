import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { 
  DollarSign, 
  Building, 
  Send, 
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  CreditCard,
  ArrowRight
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
import { useEffect, useState } from 'react';
import { api } from '@/shared/api/client';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  useEffect(() => { api.get('/admin/dashboard').then(({ data }) => setDashboard(data)).catch((error) => toast.error(error instanceof Error ? error.message : 'Dashboard indisponible')); }, []);
  const statsData = dashboard?.stats;
  const mrrData = dashboard?.mrrData || [];
  const mobileMoneyMix: { name: string; value: number; color: string }[] = (dashboard?.paymentMix || []).map((item: any) => ({ name: `${item.method} (${item.share}%)`, value: item.share, color: item.method === 'wave' ? '#1da1f2' : item.method === 'orange_money' ? '#ff7900' : '#E5B842' }));
  const topAgencies: any[] = (dashboard?.topAgencies || []).map((agency: any, i: number) => ({ rank: i + 1, ...agency, volume: `${Number(agency.volume).toLocaleString()} F`, recouvrement: `${agency.recouvrement}%` }));
  const recentNetworkTransactions: any[] = (dashboard?.recentTransactions || []).map((tx: any) => ({ ...tx, amount: `${Number(tx.amount).toLocaleString()} F`, method: tx.method === 'orange_money' ? 'Orange Money' : tx.method === 'wave' ? 'Wave' : tx.method, status: tx.status === 'reussi' ? 'Validé' : tx.status, time: new Date(tx.date).toLocaleString('fr-FR') }));
  const stats = [
    {
      title: 'MRR Plateforme (Revenus SaaS)',
      value: `${Number(statsData?.mrr || 0).toLocaleString()} FCFA`,
      change: `${Number(statsData?.subscriptionRevenue || 0).toLocaleString()} FCFA d'abonnements`,
      icon: DollarSign,
      color: 'text-[#E5B842]',
    },
    {
      title: 'Parc d\'Agences Actives',
      value: `${statsData?.activeAgencies || 0} agences`,
      change: `${statsData?.agencies || 0} agences enregistrées`,
      icon: Building,
      color: 'text-rose-400',
    },
    {
      title: 'Volume Loyers Traités (Mois)',
      value: `${Number(statsData?.monthlyRentVolume || 0).toLocaleString()} FCFA`,
      change: `${statsData?.collectionRate || 0}% de taux de collecte`,
      icon: ShieldCheck,
      color: 'text-emerald-400',
    },
    {
      title: 'Campagnes Relances WhatsApp',
      value: `${statsData?.remindersSent || 0} envois`,
      change: 'Relances WhatsApp enregistrées',
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
            <span className={`h-2 w-2 rounded-full ${dashboard ? 'bg-emerald-400' : 'bg-amber-400'}`} /> {dashboard ? 'Données synchronisées' : 'Connexion au serveur…'}
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

      {/* Subscription Compliance Alert & Monitor */}
      <Card className="bg-[#121318] border-white/5 text-white shadow-xl overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="text-base font-bold">
                  Conformité des Abonnements SaaS du Réseau
                </CardTitle>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {statsData ? `${statsData.agencies ? Math.round((statsData.subscriptionCompliance.en_regle / statsData.agencies) * 100) : 0}% à jour` : '—'}
                </span>
              </div>
              <CardDescription className="text-xs text-neutral-400 mt-0.5">
                Suivi des mensualités Starter (15 000 F), Business (25 000 F), Pro et périodes d'essai de 30 jours
              </CardDescription>
            </div>
          </div>

          <Link 
            to="/admin/tenants?filter=retard" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors self-start sm:self-auto mt-2 sm:mt-0"
          >
            Voir les agences à régulariser <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Status 1: En règle */}
            <Link 
              to="/admin/tenants?filter=en_regle"
              className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center justify-between group"
            >
              <div>
                <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {statsData?.subscriptionCompliance.en_regle || 0} Agence(s) en règle
                </p>
                <p className="text-lg font-bold font-mono text-white mt-1">100 000 F/m</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Cotisations mensuelles payées</p>
              </div>
              <span className="text-xs text-neutral-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all">→</span>
            </Link>

            {/* Status 2: Essai 30 jours */}
            <Link 
              to="/admin/tenants?filter=essai"
              className="p-3.5 rounded-xl bg-black/40 border border-[#E5B842]/20 hover:border-[#E5B842]/40 transition-all flex items-center justify-between group"
            >
              <div>
                <p className="text-xs text-[#E5B842] font-semibold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> {statsData?.subscriptionCompliance.essai || 0} Agence(s) en Essai
                </p>
                <p className="text-lg font-bold font-mono text-white mt-1">{statsData?.subscriptionCompliance.essai || 0} abonnement(s)</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Conversion après les 30 jours</p>
              </div>
              <span className="text-xs text-neutral-500 group-hover:text-[#E5B842] group-hover:translate-x-0.5 transition-all">→</span>
            </Link>

            {/* Status 3: Retard / Renouvellement */}
            <Link 
              to="/admin/tenants?filter=retard"
              className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 hover:border-rose-500/50 transition-all flex items-center justify-between group"
            >
              <div>
                <p className="text-xs text-rose-400 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 animate-pulse" /> {statsData?.subscriptionCompliance.retard || 0} Renouvellement(s) dû(s)
                </p>
                <p className="text-lg font-bold font-mono text-rose-400 mt-1">Abonnements à vérifier</p>
                <p className="text-[10px] text-rose-300/80 mt-0.5 font-medium">Données issues des statuts actuels</p>
              </div>
              <span className="text-xs text-rose-400 group-hover:translate-x-0.5 transition-all">→</span>
            </Link>
          </div>
        </CardContent>
      </Card>

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
              MRR · 6 mois
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
              {mobileMoneyMix.length ? mobileMoneyMix.map((entry) => <div key={entry.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-neutral-300"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />{entry.name.split(' (')[0]}</span>
                <span className="font-bold text-white font-mono">{entry.value} %</span>
              </div>) : <p className="text-neutral-500">Aucun paiement enregistré.</p>}
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
