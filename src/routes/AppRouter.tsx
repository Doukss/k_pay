import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/features/landing';
import { LoginPage, RegisterPage } from '@/features/auth';
import { PaiementPage } from '@/features/paiement-mobile';
import { AgentRoutes } from '@/routes/AgentRoutes';
import { AdminRoutes } from '@/routes/AdminRoutes';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/connexion" element={<LoginPage />} />
      <Route path="/inscription" element={<RegisterPage />} />
      <Route path="/agence/*" element={<AgentRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/paiement" element={<PaiementPage />} />
      <Route path="/paiement/:token" element={<PaiementPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}