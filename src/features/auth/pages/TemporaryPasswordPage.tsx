import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

export function TemporaryPasswordPage() {
  const navigate = useNavigate();
  const changePassword = useAuthStore((state) => state.changePassword);
  const user = useAuthStore((state) => state.user);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword.length < 8) return toast.error('Le nouveau mot de passe doit contenir au moins 8 caractères.');
    if (newPassword !== confirmPassword) return toast.error('Les mots de passe ne correspondent pas.');
    setBusy(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success('Mot de passe modifié');
      navigate(user?.role === 'admin' ? '/admin/dashboard' : '/agence/dashboard', { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Modification impossible');
    } finally { setBusy(false); }
  };

  return <main className="min-h-screen bg-[#0A0A0C] text-white flex items-center justify-center p-4">
    <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-2xl border border-white/10 bg-[#14151B] p-7">
      <div><h1 className="text-2xl font-semibold">Définir votre mot de passe</h1><p className="mt-2 text-sm text-neutral-400">Le mot de passe provisoire doit être remplacé avant d’accéder à votre espace.</p></div>
      <div className="space-y-2"><Label htmlFor="currentPassword">Mot de passe provisoire</Label><Input id="currentPassword" type="password" autoComplete="current-password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="newPassword">Nouveau mot de passe</Label><Input id="newPassword" type="password" autoComplete="new-password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="confirmPassword">Confirmer le mot de passe</Label><Input id="confirmPassword" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
      <Button className="w-full" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer le nouveau mot de passe'}</Button>
    </form>
  </main>;
}
