import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  ChevronDown, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAgencyStore, type Locataire } from '@/stores/agencyStore';
import { createWhatsAppPaymentMessage } from '@/shared/utils/whatsapp';
import { toast } from 'sonner';

// Historical data for Encaissements Chart (Avr. to Juin)
// The last month (Juil.) is dynamically computed below
const historicalChartData = [
  { name: 'Avr.', attendu: 500000, collecte: 150000 },
  { name: 'Mai', attendu: 600000, collecte: 160000 },
  { name: 'Juin', attendu: 750000, collecte: 165000 },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { 
    locataires, 
    recentActivities, 
    encaisserLoyer, 
    relancerLocataire 
  } = useAgencyStore();

  // Dynamic calculations based on state
  const totalAttendu = locataires.reduce((acc, curr) => acc + curr.rentVal, 0);
  const totalCollecte = locataires
    .filter((l) => l.status === 'paid')
    .reduce((acc, curr) => acc + curr.rentVal, 0);
  const totalImpaye = locataires
    .filter((l) => l.status === 'late')
    .reduce((acc, curr) => acc + curr.rentVal, 0);
  const totalEnAttente = locataires
    .filter((l) => l.status === 'pending')
    .reduce((acc, curr) => acc + curr.rentVal, 0);
  const nombreRetards = locataires.filter((l) => l.status === 'late').length;

  // Monthly performance percentage
  const performancePct = totalAttendu > 0 ? Math.round((totalCollecte / totalAttendu) * 100) : 0;

  // Dynamic data for charts
  const chartData = [
    ...historicalChartData,
    { name: 'Juil.', attendu: totalAttendu, collecte: totalCollecte },
  ];

  const pieData = [
    { name: 'Collecté', value: totalCollecte, color: '#10B981' },
    { name: 'Impayés', value: totalImpaye, color: '#EF4444' },
    { name: 'En attente', value: totalEnAttente || 100000, color: '#E5B842' },
  ];

  // Actions prioritaires (late tenants)
  const lateLocataires = locataires.filter((l) => l.status === 'late');

  const handleEncaisser = (id: number, name: string) => {
    encaisserLoyer(id);
    toast.success(`Encaissement enregistré pour ${name}`);
  };

  const handleRelancer = (loc: Locataire) => {
    relancerLocataire(loc.id);
    const msg = createWhatsAppPaymentMessage(loc);
    window.open(msg.whatsappUrl, '_blank');
    toast.success(`Relance WhatsApp préparée pour ${loc.name}`, {
      description: `Lien Wave/OM inclus : ${msg.paymentUrl}`,
    });
  };

  return (
    <div className="space-y-8 bg-[#0A0A0C] text-neutral-200 min-h-screen">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5B842]">
            Aperçu de l'agence
          </span>
          <h1 
            className="text-3xl md:text-4xl font-normal text-white mt-1"
            style={{ fontFamily: 'Georgia, ui-serif, serif' }}
          >
            Vue d'ensemble
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Voici ce qui demande votre attention aujourd'hui.
          </p>
          <div className="flex items-center gap-1.5 mt-3 text-emerald-500 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-neutral-400">Toutes les données sont synchronisées</span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button className="flex items-center gap-2 rounded-lg bg-neutral-900 border border-white/5 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 transition-colors">
            Août 2026
            <ChevronDown className="h-4 w-4" />
          </button>
          
          <Button 
            className="bg-[#E5B842] hover:bg-[#cdaf35] text-black font-semibold gap-1.5 px-4"
            onClick={() => navigate('/agence/locataires')}
          >
            <Plus className="h-4 w-4" /> Ajouter un locataire
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <Card className="bg-[#121318] border-white/5 text-white relative overflow-hidden group hover:border-[#E5B842]/20 transition-all duration-200">
          <CardHeader className="pb-2">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Total attendu</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{totalAttendu.toLocaleString()} F</div>
            <div className="absolute right-3 bottom-3 text-neutral-800/40 group-hover:text-[#E5B842]/10 transition-colors">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="bg-[#121318] border-white/5 text-white relative overflow-hidden group hover:border-[#E5B842]/20 transition-all duration-200">
          <CardHeader className="pb-2">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Collecté</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-emerald-500">{totalCollecte.toLocaleString()} F</div>
            <div className="absolute right-3 bottom-3 text-neutral-800/40 group-hover:text-emerald-500/10 transition-colors">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="bg-[#121318] border-white/5 text-white relative overflow-hidden group hover:border-[#E5B842]/20 transition-all duration-200">
          <CardHeader className="pb-2">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Impayés</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-[#E5B842]">{totalImpaye.toLocaleString()} F</div>
            <div className="absolute right-3 bottom-3 text-neutral-800/40 group-hover:text-[#E5B842]/10 transition-colors">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card className="bg-[#121318] border-white/5 text-white relative overflow-hidden group hover:border-[#E5B842]/20 transition-all duration-200">
          <CardHeader className="pb-2">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">En retard</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-neutral-200">
              {nombreRetards} locataire{nombreRetards > 1 ? 's' : ''}
            </div>
            <div className="absolute right-3 bottom-3 text-neutral-800/40 group-hover:text-neutral-200/10 transition-colors">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Encaissements Chart & Répartition Pie */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Encaissements Chart Card */}
        <Card className="lg:col-span-2 bg-[#121318] border-white/5 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Encaissements</CardTitle>
            <CardDescription className="text-neutral-400">Évolution des quatre derniers mois.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1B20', borderColor: '#333333' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="attendu" fill="#E5B842" radius={[4, 4, 0, 0]} opacity={0.8} maxBarSize={45} />
                <Line type="monotone" dataKey="collecte" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="flex items-center justify-center gap-6 text-xs text-neutral-400 mt-4">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 bg-[#E5B842] rounded-sm" /> Attendu
              </span>
              <span className="flex items-center gap-2">
                <span className="h-0.5 w-5 bg-[#10B981] inline-block" /> Collecté
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Répartition Donut Card */}
        <Card className="bg-[#121318] border-white/5 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Répartition</CardTitle>
            <CardDescription className="text-neutral-400">Survolez une part pour le détail.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] flex flex-col justify-between">
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center Info */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-neutral-400 text-xs uppercase">Loyers</span>
                <span className="text-lg font-bold">{(totalAttendu / 1000000).toFixed(2)}M F</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-neutral-400 pb-2">
              {pieData.map((d, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-[11px]">{d.name}</span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Actions prioritaires, Activité récente, Performance du mois */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Actions prioritaires */}
        <Card className="bg-[#121318] border-white/5 text-white flex flex-col justify-between">
          <CardHeader className="pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">À traiter aujourd'hui</span>
            <div className="flex items-center justify-between mt-1">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                Actions prioritaires
                {lateLocataires.length > 0 && (
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E5B842]/10 text-xs font-semibold text-[#E5B842] ring-1 ring-inset ring-[#E5B842]/20">
                    {lateLocataires.length}
                  </span>
                )}
              </CardTitle>
              <MoreHorizontal className="h-4 w-4 text-neutral-400" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 mt-4">
            {lateLocataires.length > 0 ? (
              lateLocataires.slice(0, 3).map((loc) => (
                <div key={loc.id} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium text-white text-sm">{loc.name}</p>
                    <p className="text-xs text-neutral-400">{loc.property} - {loc.rentVal.toLocaleString()} F</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEncaisser(loc.id, loc.name)}
                      className="rounded bg-emerald-950/30 border border-emerald-500/20 px-2 py-1 text-[10px] text-emerald-400 hover:bg-emerald-950/60 transition-colors"
                    >
                      Encaisser
                    </button>
                    <button 
                      onClick={() => handleRelancer(loc)}
                      className="rounded-full bg-rose-950/30 border border-rose-500/20 px-2.5 py-1 text-[10px] text-rose-400 hover:bg-rose-950/60 transition-colors"
                    >
                      Relancer <span className="text-[9px] opacity-80">{loc.delayDays}j</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-neutral-500 text-xs py-8 text-center">Aucun retard à traiter aujourd'hui !</div>
            )}
          </CardContent>
          <div className="p-4 border-t border-white/5">
            <button 
              onClick={() => navigate('/agence/relances')}
              className="flex items-center gap-1.5 text-xs text-[#E5B842] hover:underline"
            >
              Voir toutes les relances <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </Card>

        {/* Activité récente */}
        <Card className="bg-[#121318] border-white/5 text-white">
          <CardHeader className="pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5B842]">Dernières mises à jour</span>
            <div className="flex items-center justify-between mt-1">
              <CardTitle className="text-lg font-semibold">Activité récente</CardTitle>
              <RefreshCw className="h-4 w-4 text-neutral-400 cursor-pointer hover:text-white transition-colors" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex gap-3 border-b border-white/5 pb-3 last:border-b-0 last:pb-0">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                  act.type === 'paiement' ? 'bg-emerald-500/10 text-emerald-500' :
                  act.type === 'relance' ? 'bg-[#E5B842]/10 text-[#E5B842]' :
                  'bg-blue-500/10 text-blue-500'
                }`}>
                  {act.type === 'paiement' ? <CheckCircle2 className="h-4 w-4" /> :
                   act.type === 'relance' ? <Send className="h-4 w-4" /> :
                   <Plus className="h-4 w-4" />}
                </div>
                <div className="flex-1 flex justify-between items-start text-xs">
                  <div>
                    <p className="font-semibold text-white">{act.title}</p>
                    <p className="text-neutral-400 mt-0.5">{act.description}</p>
                  </div>
                  <div className="text-right text-neutral-400">
                    <p className={`font-semibold ${act.type === 'relance' ? 'text-rose-500' : 'text-white'}`}>{act.amount}</p>
                    <p className="mt-0.5 text-[10px]">{act.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance du mois */}
        <Card className="bg-[#121318] border-white/5 text-white flex flex-col justify-between">
          <CardHeader>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Performance du mois</span>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col justify-center">
            {/* Radial / Donut Gauge */}
            <div className="flex items-center gap-6">
              <div className="relative h-20 w-20 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { value: performancePct, color: '#E5B842' },
                        { value: 100 - performancePct, color: '#222222' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={40}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                    >
                      <Cell fill="#E5B842" />
                      <Cell fill="#222222" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">{performancePct}%</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-white text-sm">Objectif mensuel</p>
                <p className="text-xs text-neutral-400 mt-1">
                  {totalCollecte.toLocaleString()} F collectés sur {totalAttendu.toLocaleString()} F
                </p>
              </div>
            </div>

            {/* Flat Progress bar */}
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#E5B842] rounded-full" style={{ width: `${performancePct}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
          <div className="p-4 border-t border-white/5 text-[11px] text-neutral-400">
            Quelques relances peuvent encore améliorer ce résultat.
          </div>
        </Card>
      </div>

      {/* Row 4: Locataires à suivre Table */}
      <Card className="bg-[#121318] border-white/5 text-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg font-semibold">Locataires à suivre</CardTitle>
            <CardDescription className="text-neutral-400">Échéances et statut des paiements.</CardDescription>
          </div>
          <button 
            onClick={() => navigate('/agence/locataires')}
            className="flex items-center gap-1 text-xs text-[#E5B842] hover:underline"
          >
            Voir les locataires <ArrowRight className="h-3 w-3" />
          </button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-neutral-400 font-medium">
                  <th className="pb-3 text-xs uppercase tracking-wider">Locataire</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Logement</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Loyer</th>
                  <th className="pb-3 text-right text-xs uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {locataires.slice(0, 3).map((loc) => (
                  <tr key={loc.id} className="group hover:bg-white/[0.02]">
                    <td className="py-4 font-medium text-white">{loc.name}</td>
                    <td className="py-4 text-neutral-400">{loc.property}</td>
                    <td className="py-4 font-mono font-semibold">{loc.rentVal.toLocaleString()} F</td>
                    <td className="py-4 text-right">
                      {loc.status === 'paid' ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                          Payé
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-400 ring-1 ring-inset ring-rose-500/20">
                          En retard
                        </span>
                      )}
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