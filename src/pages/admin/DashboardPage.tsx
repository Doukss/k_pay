import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { 
  DollarSign, 
  Building, 
  Send, 
  ShieldCheck
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

const mrrData = [
  { name: 'Mars', mrr: 850000 },
  { name: 'Avril', mrr: 950000 },
  { name: 'Mai', mrr: 1050000 },
  { name: 'Juin', mrr: 1100000 },
  { name: 'Juil.', mrr: 1200000 },
  { name: 'Août', mrr: 1250000 },
];

const planDistribution = [
  { name: 'Gratuit', value: 8, color: '#4B5563' },
  { name: 'Plan Pro', value: 5, color: '#E5B842' },
  { name: 'Entreprise', value: 1, color: '#EF4444' },
];

export default function DashboardPage() {
  const stats = [
    {
      title: 'MRR (Revenus Mensuels)',
      value: '1 250 000 FCFA',
      change: '+15.2% vs mois dernier',
      icon: DollarSign,
      color: 'text-[#E5B842]',
    },
    {
      title: 'Agences Actives',
      value: '14 agences',
      change: 'Sur 18 enregistrées',
      icon: Building,
      color: 'text-rose-400',
    },
    {
      title: 'Volume Loyers Traités',
      value: '18 450 000 FCFA',
      change: 'Ce mois-ci',
      icon: ShieldCheck,
      color: 'text-emerald-500',
    },
    {
      title: 'Total Relances (Mois)',
      value: '1 284 envois',
      change: '98.8% taux de réception',
      icon: Send,
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="space-y-8 bg-[#0A0A0C] text-neutral-200 min-h-screen">
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
          Console Plateforme
        </span>
        <h1 
          className="text-3xl md:text-4xl font-normal text-white mt-1"
          style={{ fontFamily: 'Georgia, ui-serif, serif' }}
        >
          Supervision Générale
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Indicateurs financiers, volume de transactions et abonnements.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="bg-[#121318] border-white/5 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">{stat.title}</span>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono">{stat.value}</div>
                <p className="text-xs text-neutral-400 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Row 2: MRR & Distribution charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* MRR Growth Chart */}
        <Card className="lg:col-span-2 bg-[#121318] border-white/5 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Croissance MRR</CardTitle>
            <CardDescription className="text-neutral-400">Évolution de la facturation mensuelle (FCFA).</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mrrData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#1A1B20', borderColor: '#333333' }} />
                <Bar dataKey="mrr" fill="#E5B842" radius={[4, 4, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribution of plans */}
        <Card className="bg-[#121318] border-white/5 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Distribution des Offres</CardTitle>
            <CardDescription className="text-neutral-400">Plans actifs par agence.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] flex flex-col justify-between">
            <div className="h-[180px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-neutral-400 text-xs">Agences</span>
                <span className="text-lg font-bold">14 actives</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs text-neutral-400 pb-2">
              {planDistribution.map((d, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-[11px] font-medium">{d.name} ({d.value})</span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Platform Log */}
      <Card className="bg-[#121318] border-white/5 text-white">
        <CardHeader>
          <CardTitle>Journal des évènements plateforme</CardTitle>
          <CardDescription>Activité en direct des agences immobilières.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-sm font-medium">Agence "Immo Dakar" mise à niveau</p>
                  <p className="text-xs text-neutral-500">Formule Pro activée ( quota de 100 locataires )</p>
                </div>
              </div>
              <span className="text-xs text-neutral-400 font-mono">il y a 10 min</span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                <div>
                  <p className="text-sm font-medium">Délivrabilité SMS Orange SN en baisse (94%)</p>
                  <p className="text-xs text-neutral-500">Alerte automatique gateway envoyée aux ingénieurs</p>
                </div>
              </div>
              <span className="text-xs text-neutral-400 font-mono">il y a 1h</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <div>
                  <p className="text-sm font-medium">Nouvelle passerelle Wave connectée</p>
                  <p className="text-xs text-neutral-500">Volume loyer Wave SN traité : 1 200 000 F aujourd'hui</p>
                </div>
              </div>
              <span className="text-xs text-neutral-400 font-mono">il y a 4h</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
