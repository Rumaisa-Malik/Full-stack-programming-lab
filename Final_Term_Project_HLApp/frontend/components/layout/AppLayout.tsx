'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { motion } from 'framer-motion';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <motion.main
        className="flex-1 md:ml-64 transition-all duration-300 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top Navbar */}
        <div className="sticky top-0 z-30 bg-white">
          <Navbar />
        </div>

        {/* Page Content */}
        <motion.div
          className="p-4 md:p-8 bg-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </motion.main>
    </div>
  );
}
