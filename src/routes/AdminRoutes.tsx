import { Routes, Route } from 'react-router-dom';
import { AdminDashboardPage, TenantsPage, MonitoringPage } from '@/features/admin';
import { AdminLayout } from '@/shared/components/AdminLayout';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

export function AdminRoutes() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <Routes>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="tenants" element={<TenantsPage />} />
          <Route path="monitoring" element={<MonitoringPage />} />
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  );
}
