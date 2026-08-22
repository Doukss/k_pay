import { Routes, Route } from 'react-router-dom';
import DashboardPage from '@/pages/admin/DashboardPage';
import TenantsPage from '@/pages/admin/TenantsPage';
import MonitoringPage from '@/pages/admin/MonitoringPage';
import { AdminLayout } from '@/shared/components/AdminLayout';

export function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tenants" element={<TenantsPage />} />
        <Route path="monitoring" element={<MonitoringPage />} />
      </Routes>
    </AdminLayout>
  );
}
