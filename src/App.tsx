import { AppRouter } from '@/routes/AppRouter';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/shared/context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <AppRouter />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
};

export default App;