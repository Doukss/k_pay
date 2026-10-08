import type { DashboardData } from '../types';
import { api } from '@/shared/api/client';

export async function fetchDashboardData(): Promise<DashboardData> {
  const { data } = await api.get('/dashboard');
  return data as DashboardData;
}
