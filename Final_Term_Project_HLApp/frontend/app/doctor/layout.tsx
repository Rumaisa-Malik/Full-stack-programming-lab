'use client';

import { ReactNode } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}
