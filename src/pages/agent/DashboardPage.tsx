import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BellRing, 
  CreditCard, 
  TrendingUp, 
  LogOut, 
  ArrowUpRight, 
  Activity,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { toast } from 'sonner';

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.info('Déconnexion réussie');
    navigate('/');
  };

  const stats = [
    {
      title: 'Loyers Encaissés',
      value: '2 450 000 FCFA',
      change: '+12.5% vs mois dernier',
      icon: CreditCard,
      color: 'text-emerald-500',
    },
    {
      title: 'Taux de Recouvrement',
      value: '94.2%',
      change: '+3.1% vs mois dernier',
      icon: TrendingUp,
      color: 'text-blue-500',
    },
    {
      title: 'Relances Envoyées',
      value: '184',
      change: '100% délivrées (SMS/WhatsApp)',
      icon: BellRing,
      color: 'text-amber-500',
    },
    {
      title: 'Locataires Actifs',
      value: '42',
      change: 'Sur 3 immeubles gérés',
      icon: Users,
      color: 'text-indigo-500',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      tenant: 'Moussa Diop',
      property: 'Immeuble A - Appt 4',
      amount: '150 000 FCFA',
      status: 'success',
      date: "Aujourd'hui, 14:32",
    },
    {
      id: 2,
      tenant: 'Fatou Sow',
      property: 'Villa 12 - Fann',
      amount: '450 000 FCFA',
      status: 'success',
      date: 'Hier, 18:15',
    },
    {
      id: 3,
      tenant: 'Amadou Diallo',
      property: 'Immeuble B - Appt 9',
      amount: '200 000 FCFA',
      status: 'pending',
      date: '12 Août, 10:00',
    },
    {
      id: 4,
      tenant: 'Awa Ndiaye',
      property: 'Immeuble A - Appt 2',
      amount: '180 000 FCFA',
      status: 'failed',
      date: '10 Août, 09:12',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950">
      {/* Header bar */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">KeurGui Pay</span>
            <span className="hidden sm:inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              Espace Agence
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">Immo Dakar</p>
              <p className="text-xs text-muted-foreground">Malick Mbodji</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Déconnexion">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main dashboard content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* Welcome section */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
              <p className="text-muted-foreground">
                Bienvenue dans l'espace de gestion de votre agence.
              </p>
            </div>
            <Button className="w-full sm:w-auto gap-2">
              <Activity className="h-4 w-4" /> Nouvel Immeuble
            </Button>
          </div>

          {/* Stats grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main sections layout */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Recent activity card */}
            <Card className="col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Encaissés Récents</CardTitle>
                  <CardDescription>
                    Statut en temps réel des transactions de loyer.
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  Voir tout <ArrowUpRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground font-medium">
                        <th className="pb-3">Locataire</th>
                        <th className="pb-3">Bien</th>
                        <th className="pb-3">Montant</th>
                        <th className="pb-3">Statut</th>
                        <th className="pb-3 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentActivities.map((act) => (
                        <tr key={act.id} className="group hover:bg-slate-50/50 dark:hover:bg-zinc-900/50">
                          <td className="py-3.5 font-medium">{act.tenant}</td>
                          <td className="py-3.5 text-muted-foreground">{act.property}</td>
                          <td className="py-3.5 font-semibold">{act.amount}</td>
                          <td className="py-3.5">
                            {act.status === 'success' && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Reçu
                              </span>
                            )}
                            {act.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                                <AlertCircle className="h-3.5 w-3.5 animate-pulse" /> Relancé
                              </span>
                            )}
                            {act.status === 'failed' && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                                <AlertCircle className="h-3.5 w-3.5" /> Échoué
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 text-right text-muted-foreground">{act.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions / WhatsApp status card */}
            <Card>
              <CardHeader>
                <CardTitle>Canaux de Relance</CardTitle>
                <CardDescription>
                  Configuration et statut des notifications automatisées.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-semibold">SMS KeurGui</p>
                    <p className="text-xs text-muted-foreground">99.8% délivrabilité (Orange/Tigo/Free)</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-400">
                    Actif
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-semibold">WhatsApp Business</p>
                    <p className="text-xs text-muted-foreground">Template de relance officiel approuvé</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-400">
                    Actif
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1">
                  <div>
                    <p className="font-semibold">Passerelle Wave / Orange Money</p>
                    <p className="text-xs text-muted-foreground">Encaissement automatique SN</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-400">
                    Connecté
                  </span>
                </div>

                <Button className="w-full mt-4" variant="outline">
                  Configurer les canaux
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
