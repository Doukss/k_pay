import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/shared/context/ThemeContext';
import { toast } from 'sonner';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    toggleTheme();
    const next = theme === 'dark' ? 'clair' : 'sombre';
    toast.info(`Mode ${next} activé`, {
      duration: 1500,
    });
  };

  return (
    <button
      onClick={handleToggle}
      className={`relative p-2 rounded-xl transition-all duration-200 border ${
        theme === 'dark'
          ? 'bg-[#14151B] border-white/10 text-[#E5B842] hover:bg-white/5'
          : 'bg-white border-slate-200 text-amber-500 hover:bg-slate-100 shadow-sm'
      } ${className}`}
      title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      aria-label="Basculer le thème"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-300 text-slate-700 hover:text-slate-900" />
      )}
    </button>
  );
}
