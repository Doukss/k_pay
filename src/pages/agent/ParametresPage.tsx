import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Bell, Shield } from 'lucide-react';

export default function ParametresPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les configurations de votre agence et de vos relances.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Notifications & Relances
            </CardTitle>
            <CardDescription>
              Fréquence et canaux d'envoi des rappels de loyer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">Relance automatique WhatsApp</p>
                <p className="text-xs text-muted-foreground">Envoyer un message le 5 de chaque mois</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600">Actif</span>
            </div>
            <div className="flex items-center justify-between pb-1">
              <div>
                <p className="font-medium">Relance de retard par SMS</p>
                <p className="text-xs text-muted-foreground">Envoyer un SMS après 3 jours de retard</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600">Actif</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Sécurité & Comptes
            </CardTitle>
            <CardDescription>
              Sécurisez l'accès à votre espace agence.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">Double Authentification</p>
                <p className="text-xs text-muted-foreground">Sécuriser la connexion par code SMS</p>
              </div>
              <Button size="sm" variant="outline">Activer</Button>
            </div>
            <div className="flex items-center justify-between pb-1">
              <div>
                <p className="font-medium">Mots de passe</p>
                <p className="text-xs text-muted-foreground">Dernière modification il y a 3 mois</p>
              </div>
              <Button size="sm" variant="outline">Modifier</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
