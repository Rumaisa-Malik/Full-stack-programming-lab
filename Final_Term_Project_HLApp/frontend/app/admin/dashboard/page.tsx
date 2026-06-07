'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, Badge, Loader, useToast } from '@/components/ui';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { getDashboardStats, type DashboardStats } from '@/lib/adminService';

export default function AdminDashboard() {
  const router = useRouter();
  const { addToast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        addToast('Failed to load dashboard statistics', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [addToast]);

  if (loading) {
    return (
      <ProtectedRoute requiredRoles={['admin']}>
        <div className="min-h-screen bg-base flex items-center justify-center">
          <Loader variant="heartbeat" size="lg" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!stats) {
    return (
      <ProtectedRoute requiredRoles={['admin']}>
        <div className="min-h-screen bg-base py-8">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-ink-soft">No data available</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const systemMetrics = [
    { label: 'Total Users', value: stats.totalUsers.toString(), onClick: null },
    { label: 'Active Doctors', value: stats.totalDoctors.toString(), onClick: () => router.push('/admin/doctors') },
    { label: 'Registered Patients', value: stats.totalPatients.toString(), onClick: () => router.push('/admin/patients') },
    { label: 'Pending Appointments', value: stats.pendingAppointments.toString(), onClick: () => router.push('/admin/appointments') },
  ];

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <div className="min-h-screen bg-base py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-ink">Control Room</h1>
          <p className="text-ink-soft text-sm mt-1">System metrics, user management, appointment oversight</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            {systemMetrics.map((metric) => (
              <div
                key={metric.label}
                className={`glass rounded-lg p-4 border border-line ${metric.onClick ? 'cursor-pointer hover:bg-accent-soft/20 transition-colors' : ''}`}
                onClick={metric.onClick || undefined}
              >
                <p className="text-xs text-ink-soft uppercase mb-2">{metric.label}</p>
                <p className="text-3xl font-bold text-accent mb-2">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Card variant="glass">
              <CardHeader title="Specialty Distribution" subtitle="Doctors & patients by specialty" />
              <div className="divide-y divide-line">
                {stats.specialtyDistribution.length > 0 ? (
                  stats.specialtyDistribution.map((spec) => (
                    <div
                      key={spec.specialty}
                      className="p-4 flex items-center justify-between hover:bg-accent-soft/20"
                    >
                      <div>
                        <p className="font-semibold text-ink">{spec.specialty}</p>
                        <p className="text-xs text-ink-soft">
                          {spec.doctors} doctors • {spec.patients} patients
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="default">{spec.doctors} Docs</Badge>
                        <Badge variant="info">{spec.patients} Pts</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-ink-soft">No specialty data available</div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
