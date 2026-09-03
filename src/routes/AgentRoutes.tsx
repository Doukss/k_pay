import { Routes, Route } from 'react-router-dom';
import DashboardPage from '@/pages/agent/DashboardPage';
import LocatairesPage from '@/pages/agent/LocatairesPage';
import RelancesPage from '@/pages/agent/RelancesPage';
import EncaissementsPage from '@/pages/agent/EncaissementsPage';
import ParametresPage from '@/pages/agent/ParametresPage';
import { AgentLayout } from '@/shared/components/AgentLayout';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

export function AgentRoutes() {
  return (
    <ProtectedRoute requiredRole="agency">
      <AgentLayout>
        <Routes>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="locataires" element={<LocatairesPage />} />
          <Route path="encaissements" element={<EncaissementsPage />} />
          <Route path="relances" element={<RelancesPage />} />
          <Route path="parametres" element={<ParametresPage />} />
        </Routes>
      </AgentLayout>
    </ProtectedRoute>
  );
}