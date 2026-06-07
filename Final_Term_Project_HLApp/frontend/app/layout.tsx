import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/AuthContext';
import { ToastProvider } from '@/components/ui/Toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediFlow - Healthcare Platform',
  description: 'Book appointments and manage your continuous care treatment journey',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-base text-ink">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
