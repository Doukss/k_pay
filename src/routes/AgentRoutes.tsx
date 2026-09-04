import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from '@/features/agent-dashboard';
import { LocatairesPage } from '@/features/locataires';
import { EncaissementsPage } from '@/features/encaissements';
import { RelancesPage } from '@/features/relances';
import { ParametresPage } from '@/features/parametres';
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