import { AuthLayout, LoginForm } from '@/features/auth';

export default function LoginPage() {
  return (
    <AuthLayout
      title="Connexion"
      subtitle="Accédez au tableau de bord de votre agence."
    >
      <LoginForm />
    </AuthLayout>
  );
}