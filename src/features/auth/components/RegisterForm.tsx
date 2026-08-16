import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { registerSchema, type RegisterFormValues } from '../schemas/register.schema';

export function RegisterForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    // TODO: brancher l'appel API réel (features/auth/api/auth.api.ts)
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success('Compte agence créé avec succès');
    console.log(values);
    navigate('/agence/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nomAgence">Nom de l'agence</Label>
        <Input
          id="nomAgence"
          placeholder="Immo Dakar"
          {...register('nomAgence')}
        />
        {errors.nomAgence && (
          <p className="text-sm text-destructive">{errors.nomAgence.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="nomResponsable">Nom du responsable</Label>
        <Input
          id="nomResponsable"
          placeholder="Malick Mbodji"
          {...register('nomResponsable')}
        />
        {errors.nomResponsable && (
          <p className="text-sm text-destructive">
            {errors.nomResponsable.message}
          </p>
        )}
      </div>

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
        <Label htmlFor="telephone">Téléphone</Label>
        <Input
          id="telephone"
          type="tel"
          placeholder="+221 77 123 45 67"
          {...register('telephone')}
        />
        {errors.telephone && (
          <p className="text-sm text-destructive">{errors.telephone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Création...' : "Créer mon agence"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Déjà un compte ?{' '}
        <Link to="/connexion" className="font-medium text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}