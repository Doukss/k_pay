import { AppRouter } from '@/routes/AppRouter';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/shared/context/ThemeContext';
import { useEffect } from 'react';
import { useAgencyStore } from '@/stores/agencyStore';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

const App = () => {
  const clearAgencyData = useAgencyStore((state) => state.clearData);
  useEffect(() => {
    const clearAgencySession = () => clearAgencyData();
    const expireSession = () => { clearAgencyData(); useAuthStore.setState({ user: null, token: null, isAuthenticated: false }); toast.error('Votre session a expiré ou n’est plus valide.'); };
    window.addEventListener('keurguipay:session-ended', clearAgencySession);
    window.addEventListener('keurguipay:session-started', clearAgencySession);
    window.addEventListener('keurguipay:unauthorized', expireSession);
    return () => { window.removeEventListener('keurguipay:session-ended', clearAgencySession); window.removeEventListener('keurguipay:session-started', clearAgencySession); window.removeEventListener('keurguipay:unauthorized', expireSession); };
  }, [clearAgencyData]);
  return (
    <ThemeProvider>
      <AppRouter />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
};

export default App;
