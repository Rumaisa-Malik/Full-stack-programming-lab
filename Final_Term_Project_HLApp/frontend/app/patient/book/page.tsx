'use client';

import { ProtectedRoute } from '@/lib/ProtectedRoute';

export default function BookAppointment() {
  return (
    <ProtectedRoute requiredRoles={['patient']}>
      <div className="min-h-screen bg-base">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-ink mb-8">Book an Appointment</h1>
          <div className="glass p-8 rounded-2xl">
            <p className="text-ink-soft">Appointment booking flow coming soon...</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
