import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { loginSchema, type LoginFormValues } from '../schemas/login.schema';

import { useAuthStore } from '@/stores/authStore';

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const mustChangePassword = await login(values.email, values.password);
      const user = useAuthStore.getState().user;
      if (mustChangePassword) {
        toast.success('Connexion réussie', { description: 'Vous devez définir un nouveau mot de passe.' });
        navigate('/mot-de-passe-provisoire', { replace: true });
      } else if (user?.role === 'admin') {
      toast.success('Connexion Super Admin réussie');
      navigate('/admin/dashboard', { replace: true });
      } else {
      toast.success('Connexion réussie');
      navigate('/agence/dashboard', { replace: true });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Connexion impossible');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="vous@agence.sn"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Mot de passe</Label>
          <button type="button" onClick={() => toast.info("La réinitialisation par e-mail n’est pas encore configurée. Contactez l’administrateur.")} className="text-xs font-medium text-primary hover:underline">
            Mot de passe oublié ?
          </button>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Connexion...' : 'Se connecter'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{' '}
        <Link to="/inscription" className="font-medium text-primary hover:underline">
          Créer une agence
        </Link>
      </p>
    </form>
  );
}
