import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { 
  Cpu, 
  Database, 
  AlertCircle, 
  HardDrive, 
  RefreshCw, 
  Zap, 
  CheckCircle2, 
  ShieldCheck
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface GatewayItem {
  id: string;
  name: string;
  type: string;
  latency: string;
  status: 'operational' | 'degraded' | 'error';
  load: string;
  endpoint: string;
}

const initialGateways: GatewayItem[] = [
  { id: 'wave', name: 'Wave Senegal Gateway', type: 'Paiement Mobile', latency: '12ms', status: 'operational', load: '14%', endpoint: 'api.wave.com/v1/checkout' },
  { id: 'om', name: 'Orange Money SN API', type: 'Paiement Mobile', latency: '48ms', status: 'operational', load: '45%', endpoint: 'api.orange.sn/om/direct' },
  { id: 'free', name: 'Free Money SN API', type: 'Paiement Mobile', latency: '65ms', status: 'operational', load: '8%', endpoint: 'api.free.sn/money/v2' },
  { id: 'wa', name: 'WhatsApp Business Cloud API', type: 'Notification Relances', latency: '92ms', status: 'operational', load: '78%', endpoint: 'graph.facebook.com/v19.0/messages' },
  { id: 'sms', name: 'SMS Broker SN (Orange/Free/Expresso)', type: 'SMS Fallback', latency: '110ms', status: 'operational', load: '32%', endpoint: 'sms.broker-senegal.sn/send' },
];

const securityLogs = [
  { id: 1, event: 'Authentification SuperAdmin (SYS-ROOT)', ip: '197.234.221.14 (Dakar, SN)', time: 'Aujourd\'hui à 15:52', status: 'Succès' },
  { id: 2, event: 'Webhook Wave Checkout (#KP-0042)', ip: 'Wave Cloud Gateway', time: 'Aujourd\'hui à 15:45', status: 'Validé' },
  { id: 3, event: 'Génération Quittance Certifiée SSL', ip: 'Core KeurGui Engine', time: 'Aujourd\'hui à 15:45', status: 'Validé' },
  { id: 4, event: 'Synchronisation Orange Money Callback', ip: 'OM Server SN', time: 'Aujourd\'hui à 14:30', status: 'Validé' },
  { id: 5, event: 'Renouvellement Certificat SSL 256-bit', ip: 'Let\'s Encrypt Authority', time: 'Hier à 03:00', status: 'Succès' },
];

export default function MonitoringPage() {
  const [gateways, setGateways] = useState<GatewayItem[]>(initialGateways);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Données de monitoring technique et passerelles actualisées');
    }, 800);
  };

  const handlePingGateway = (gw: GatewayItem) => {
    setTestingId(gw.id);
    setTimeout(() => {
      const simulatedLatency = Math.floor(Math.random() * 30) + 10;
      setGateways(prev => prev.map(g => g.id === gw.id ? { ...g, latency: `${simulatedLatency}ms` } : g));
      setTestingId(null);
      toast.success(`Ping réussi sur ${gw.name} : ${simulatedLatency}ms (HTTP 200 OK)`, {
        description: `Endpoint : ${gw.endpoint}`,
      });
    }, 600);
  };

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
            Statut Système & Passerelles
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Monitoring en direct des API de paiement sénégalaises, webhooks et infrastructure cloud.
          </p>
        </div>

        <Button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-rose-400 font-semibold gap-1.5 px-4 self-start sm:self-auto text-xs h-9 shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Actualisation...' : 'Actualiser les métriques'}
        </Button>
      </div>

      {/* Resource KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#121318] border-white/5 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Serveur Principal CPU</span>
            <Cpu className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">16.8 %</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> 8 Coeurs vCPU · Normal
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#121318] border-white/5 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Mémoire Vive (RAM)</span>
            <HardDrive className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">4.1 GB / 8 GB</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> 51.2% alloué · Stable
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#121318] border-white/5 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Cluster Base de Données</span>
            <Database className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">3 / 3 Nodes</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Réplication active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#121318] border-white/5 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Taux d'Erreur Global</span>
            <AlertCircle className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">0.01 %</div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> 99.99% disponibilité SLA
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gateway Status Interactive Table */}
      <Card className="bg-[#121318] border-white/5 text-white shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-bold">Passerelles Mobile Money & Services Externes</CardTitle>
            <CardDescription className="text-neutral-400 text-xs mt-0.5">
              Cliquez sur « Tester le Ping » pour tester la connectivité et la latence en temps réel.
            </CardDescription>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Toutes les passerelles opérationnelles
          </span>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-neutral-400 font-medium">
                  <th className="pb-3 text-xs uppercase tracking-wider">Service / Passerelle</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Type</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Latence API</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Charge</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Statut</th>
                  <th className="pb-3 text-right text-xs uppercase tracking-wider">Diagnostic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {gateways.map((gw) => (
                  <tr key={gw.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4">
                      <div>
                        <p className="font-semibold text-white">{gw.name}</p>
                        <p className="text-[11px] font-mono text-neutral-500 mt-0.5">{gw.endpoint}</p>
                      </div>
                    </td>
                    <td className="py-4 text-xs text-neutral-300">{gw.type}</td>
                    <td className="py-4 text-xs font-mono font-bold text-emerald-400">{gw.latency}</td>
                    <td className="py-4 text-xs font-mono text-neutral-300">{gw.load}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" /> Opérationnel
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePingGateway(gw)}
                        disabled={testingId === gw.id}
                        className="bg-black/30 border-white/10 hover:bg-neutral-800 text-neutral-200 text-xs h-8 px-3 gap-1.5"
                      >
                        <Zap className={`h-3 w-3 ${testingId === gw.id ? 'animate-bounce text-[#E5B842]' : 'text-rose-400'}`} />
                        {testingId === gw.id ? 'Test en cours...' : 'Tester le Ping'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Security & Audit Events Log */}
      <Card className="bg-[#121318] border-white/5 text-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-rose-400" /> Journal d'Audit & Événements Système
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400">
            Traçabilité des accès administratifs et certificats de transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {securityLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <p className="font-semibold text-white">{log.event}</p>
                  <p className="text-[11px] text-neutral-500 font-mono">Source : {log.ip}</p>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {log.status}
                  </span>
                  <p className="text-[10px] text-neutral-500">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
