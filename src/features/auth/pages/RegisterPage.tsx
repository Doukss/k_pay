import { AuthLayout } from '../components/AuthLayout';
import { RegisterForm } from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Créer votre agence"
      subtitle="Commencez à automatiser vos relances en quelques minutes."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
