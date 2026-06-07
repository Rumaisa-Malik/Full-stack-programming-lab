'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: string[];
}

const navigationItems: NavItem[] = [
  { label: 'Dashboard', href: '/patient/dashboard', icon: 'D', roles: ['patient'] },
  { label: 'Book Appointment', href: '/book', icon: 'B', roles: ['patient'] },
  { label: 'My Treatments', href: '/patient/treatments', icon: 'T', roles: ['patient'] },
  { label: 'My Prescriptions', href: '/patient/prescriptions', icon: 'P', roles: ['patient'] },
  { label: 'Dashboard', href: '/doctor/dashboard', icon: 'D', roles: ['doctor'] },
  { label: 'My Appointments', href: '/doctor/appointments', icon: 'A', roles: ['doctor'] },
  { label: 'My Patients', href: '/doctor/patients', icon: 'P', roles: ['doctor'] },
  { label: 'Admin Dashboard', href: '/admin/dashboard', icon: 'A', roles: ['admin'] },
  { label: 'Doctors', href: '/admin/doctors', icon: 'D', roles: ['admin'] },
  { label: 'Patients', href: '/admin/patients', icon: 'P', roles: ['admin'] },
  { label: 'Appointments', href: '/admin/appointments', icon: 'C', roles: ['admin'] },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLogoutMenuOpen, setIsLogoutMenuOpen] = useState(false);

  if (!user) return null;

  const userNavItems = navigationItems.filter((item) => item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) => pathname.startsWith(href);

  const roleInitials: { [key: string]: string } = {
    patient: 'P',
    doctor: 'D',
    admin: 'A',
  };

  return (
    <motion.aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-full flex flex-col">
        {/* Logo / Brand */}
        <motion.div
          className="p-6 border-b border-slate-200 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Link href={user.role === 'patient' ? '/patient/dashboard' : user.role === 'doctor' ? '/doctor/appointments' : '/admin/dashboard'}>
            <motion.div
              className="flex items-center gap-3 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                MF
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-indigo-600">MediFlow</h1>
                  <p className="text-sm text-indigo-500 font-medium">Healthcare</p>
                </div>
              )}
            </motion.div>
          </Link>
        </motion.div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          <AnimatePresence mode="wait">
            {userNavItems.map((item, idx) => {
              const active = isActive(item.href);
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link href={item.href}>
                    <motion.div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                        active
                          ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 shadow-sm'
                          : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {isCollapsed ? (
                        <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          active
                            ? 'bg-indigo-600 text-white'
                            : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          {item.icon}
                        </div>
                      ) : (
                        <span className="text-base text-indigo-600">{item.label}</span>
                      )}
                      {active && !isCollapsed && (
                        <motion.div
                          className="ml-auto w-2 h-2 rounded-full bg-indigo-600"
                          layoutId="activeIndicator"
                        />
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </nav>

        {/* User Profile Section */}
        <motion.div
          className="border-t border-slate-200 p-3 bg-slate-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative">
            <motion.button
              onClick={() => setIsLogoutMenuOpen(!isLogoutMenuOpen)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors ${
                isCollapsed ? 'justify-center' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {roleInitials[user.role]}
              </div>
              {!isCollapsed && (
                <div className="text-left flex-1 min-w-0">
                  <p className="text-base font-semibold text-indigo-600 truncate">{user.name}</p>
                  <p className="text-sm text-indigo-500 capitalize font-medium">{user.role}</p>
                </div>
              )}
            </motion.button>

            {/* Logout Menu */}
            <AnimatePresence>
              {isLogoutMenuOpen && (
                <>
                  <motion.div
                    className="fixed inset-0 z-30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsLogoutMenuOpen(false)}
                  />
                  <motion.div
                    className="absolute bottom-full left-3 right-3 mb-2 bg-white border border-slate-200 rounded-lg shadow-lg z-40 overflow-hidden"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  >
                    <motion.button
                      onClick={() => {
                        handleLogout();
                        setIsLogoutMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      whileHover={{ backgroundColor: 'rgb(254, 242, 242)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-lg">↪</span> Logout
                    </motion.button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Collapse Button */}
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full p-3 border-t border-indigo-100 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors flex justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '‹' : '›'}
        </motion.button>
      </div>
    </motion.aside>
  );
}
