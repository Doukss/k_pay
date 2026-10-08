import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { 
  Cpu, 
  Database, 
  AlertCircle, 
  HardDrive, 
  RefreshCw, 
  ShieldCheck
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/shared/api/client';

interface GatewayItem {
  id: string;
  name: string;
  type: string;
  latency?: string;
  status: string;
  load?: string;
  endpoint?: string;
}

export default function MonitoringPage() {
  const [monitoring, setMonitoring] = useState<any>(null);
  const [gateways, setGateways] = useState<GatewayItem[]>([]);
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const { data } = await api.get('/admin/monitoring'); setMonitoring(data);
      setGateways(data.gateways.map((gateway: any) => ({ ...gateway, type: gateway.id === 'whatsapp' ? 'Notification' : 'Paiement', status: gateway.status === 'simulation' ? 'Simulé' : gateway.status === 'configured' ? 'Configuré' : 'Non configuré' })));
      setSecurityLogs(data.latestAdminActions.map((log: any) => ({ id: log.id, event: log.action, ip: log.ipAddress || '—', time: new Date(log.createdAt).toLocaleString('fr-FR'), status: 'Journalisé', admin: log.admin?.name || log.admin?.email || 'Administrateur' })));
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Monitoring indisponible'); }
    finally { setIsRefreshing(false); }
  };
  useEffect(() => { void refresh(); }, []);
  const handleRefresh = () => { void refresh(); };

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
            <div className="text-2xl font-bold font-mono">{monitoring ? `${Math.floor(monitoring.uptimeSeconds / 3600)} h` : '—'}</div>
            <p className="text-xs text-neutral-400 mt-1">Temps de fonctionnement du processus API</p>
          </CardContent>
        </Card>

        <Card className="bg-[#121318] border-white/5 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Mémoire Vive (RAM)</span>
            <HardDrive className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{monitoring ? `${(monitoring.memoryBytes.heapUsed / 1024 / 1024).toFixed(0)} / ${(monitoring.memoryBytes.heapTotal / 1024 / 1024).toFixed(0)} MB` : '—'}</div>
            <p className="text-xs text-neutral-400 mt-1">Mémoire heap Node.js</p>
          </CardContent>
        </Card>

        <Card className="bg-[#121318] border-white/5 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Cluster Base de Données</span>
            <Database className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{monitoring?.database === 'connected' ? 'Connectée' : monitoring ? 'Indisponible' : '—'}</div>
            <p className="text-xs text-neutral-400 mt-1">État vérifié par le backend</p>
          </CardContent>
        </Card>

        <Card className="bg-[#121318] border-white/5 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Taux d'Erreur Global</span>
            <AlertCircle className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{gateways.filter((gateway) => gateway.status === 'Configuré').length} / {gateways.length}</div>
            <p className="text-xs text-neutral-400 mt-1">Services configurés (état déclaratif)</p>
          </CardContent>
        </Card>
      </div>

      {/* Gateway Status Interactive Table */}
      <Card className="bg-[#121318] border-white/5 text-white shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-bold">Passerelles Mobile Money & Services Externes</CardTitle>
            <CardDescription className="text-neutral-400 text-xs mt-0.5">
              État de configuration renvoyé par le backend. Les paiements Wave et Orange Money sont simulés.
            </CardDescription>
          </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Statut déclaré par l’API
          </span>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-neutral-400 font-medium">
                  <th className="pb-3 text-xs uppercase tracking-wider">Service / Passerelle</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Type</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Configuration</th>
                  <th className="pb-3 text-xs uppercase tracking-wider">Diagnostic</th>
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
                    <td className="py-4 text-xs font-mono text-neutral-300">{gw.status}</td>
                    <td className="py-4 text-xs text-neutral-400">{gw.endpoint || 'Aucun endpoint configuré'}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${gw.status === 'Configuré' ? 'text-emerald-400' : 'text-amber-300'}`}>
                        <span className={`h-2 w-2 rounded-full ${gw.status === 'Configuré' ? 'bg-emerald-400' : 'bg-amber-300'}`} /> {gw.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-xs text-neutral-500">Pas de test actif</span>
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
                  <p className="font-semibold text-white">{log.event} · {log.admin}</p>
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
