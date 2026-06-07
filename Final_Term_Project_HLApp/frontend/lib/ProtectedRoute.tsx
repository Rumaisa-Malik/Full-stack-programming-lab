'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-accent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    // Redirect to role-specific dashboard
    const dashboardMap: Record<string, string> = {
      patient: '/patient/dashboard',
      doctor: '/doctor/dashboard',
      admin: '/admin/dashboard',
    };
    router.push(dashboardMap[user.role] || '/login');
    return null;
  }

  return <>{children}</>;
}
