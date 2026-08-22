import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Cpu, Database, AlertCircle, HardDrive, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const mockGateways = [
  { name: 'Wave Senegal Gateway', type: 'Paiement', latency: '12ms', status: 'operational', load: '14%' },
  { name: 'Orange Money SN API', type: 'Paiement', latency: '48ms', status: 'operational', load: '45%' },
  { name: 'Free Money SN API', type: 'Paiement', latency: '65ms', status: 'operational', load: '8%' },
  { name: 'SMS Broker SN (Orange/Free/Expresso)', type: 'SMS Notification', latency: '110ms', status: 'operational', load: '62%' },
  { name: 'WhatsApp Business Cloud API', type: 'WhatsApp Notification', latency: '95ms', status: 'operational', load: '78%' },
];

export default function MonitoringPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Données de monitoring technique actualisées');
    }, 800);
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
            Statut Système & Passerelles
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Monitoring technique des API de paiement, passerelles de messagerie et ressources serveur.
          </p>
        </div>

        <Button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-rose-400 font-semibold gap-1.5 px-4 self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Actualisation...' : 'Actualiser les métriques'}
        </Button>
      </div>

      {/* Resource Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Resource 1 */}
        <Card className="bg-[#121318] border-white/5 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Serveur Principal CPU</span>
            <Cpu className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">18.4 %</div>
            <p className="text-xs text-emerald-500 mt-1">Opérationnel · Stable</p>
          </CardContent>
        </Card>

        {/* Resource 2 */}
        <Card className="bg-[#121318] border-white/5 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Utilisation RAM</span>
            <HardDrive className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">4.2 GB / 8 GB</div>
            <p className="text-xs text-emerald-500 mt-1">52.5% utilisé · OK</p>
          </CardContent>
        </Card>

        {/* Resource 3 */}
        <Card className="bg-[#121318] border-white/5 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Base de données</span>
            <Database className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">3 / 3 Nodes</div>
            <p className="text-xs text-emerald-500 mt-1">Cluster PostgreSQL sain</p>
          </CardContent>
        </Card>

        {/* Resource 4 */}
        <Card className="bg-[#121318] border-white/5 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Taux d'erreur API</span>
            <AlertCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">0.02 %</div>
            <p className="text-xs text-emerald-500 mt-1">Seuil normal (&lt; 1%)</p>
          </CardContent>
        </Card>
      </div>

      {/* Gateway Card */}
      <Card className="bg-[#121318] border-white/5 text-white">
        <CardHeader>
          <CardTitle>Passerelles Tiers (API SN)</CardTitle>
          <CardDescription>
            État de connexion et temps de réponse des services tiers sénégalais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-neutral-400 font-medium">
                  <th className="pb-3 text-xs uppercase tracking-wider">Passerelle</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Type service</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Temps de réponse</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Charge</th>
                  <th className="pb-3 text-right text-xs uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockGateways.map((gw, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01]">
                    <td className="py-4 font-semibold text-white">{gw.name}</td>
                    <td className="py-4 text-neutral-400 text-xs font-medium uppercase tracking-wider">{gw.type}</td>
                    <td className="py-4 text-sm text-neutral-300 font-mono">{gw.latency}</td>
                    <td className="py-4 text-sm text-neutral-300 font-mono">{gw.load}</td>
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 text-emerald-500 text-xs font-semibold">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Opérationnel
                      </span>
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
