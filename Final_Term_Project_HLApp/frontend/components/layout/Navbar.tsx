'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  getUserNotifications,
  getUnreadCount,
  markNotificationAsRead,
  deleteNotification,
  Notification,
} from '@/lib/notificationService';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const [notifs, unread] = await Promise.all([
          getUserNotifications(user.id),
          getUnreadCount(user.id),
        ]);
        setNotifications(notifs);
        setUnreadCount(unread);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDismissNotification = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      const notif = notifications.find((n) => n._id === notificationId);
      if (notif && !notif.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to dismiss notification:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  const typeIcon = {
    appointment: 'APT',
    medication: 'MED',
    followup: 'FUP',
  };

  return (
    <motion.nav
      className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <motion.button
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          className="relative p-2 rounded-lg hover:bg-purple-50 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl">🔔</span>
          {unreadCount > 0 && (
            <motion.div
              className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
          </motion.button>

          {/* Notification Popover */}
          <AnimatePresence>
            {isNotificationOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsNotificationOpen(false)}
              />

              <motion.div
                className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-lg border border-slate-200 z-40"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
                  <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
                  <button
                    onClick={() => setIsNotificationOpen(false)}
                    className="text-slate-400 hover:text-slate-900 text-lg font-bold"
                  >
                    ×
                  </button>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {loadingNotifications ? (
                    <div className="p-8 text-center">
                      <p className="text-sm text-slate-500">Loading...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-sm text-slate-500">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-200">
                      {notifications.map((notif) => (
                        <motion.div
                          key={notif._id}
                          className={`p-4 cursor-pointer transition-colors ${
                            notif.read ? 'bg-white' : 'bg-slate-50'
                          } hover:bg-slate-50 group`}
                          onClick={() => handleNotificationClick(notif._id)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-md bg-indigo-100 text-indigo-600 font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {typeIcon[notif.type as keyof typeof typeIcon]}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <p className="text-sm font-semibold text-slate-900 capitalize">
                                  {notif.type}
                                </p>
                                <div className="flex items-center gap-2">
                                  {!notif.read && (
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1" />
                                  )}
                                  <button
                                    onClick={(e) => handleDismissNotification(notif._id, e)}
                                    className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold"
                                    title="Dismiss notification"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>

                              <p className="text-sm text-slate-900 break-words">{notif.message}</p>

                              <div className="mt-2 flex items-center justify-between">
                                <p className="text-xs text-slate-500">
                                  {new Date(notif.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>

                                {notif.emailPreviewUrl && (
                                  <a
                                    href={notif.emailPreviewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-indigo-600 hover:text-indigo-700 underline font-medium"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    View email
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </>
            )}
          </AnimatePresence>
        </div>
        {/* End Notification Bell */}

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 text-white font-medium text-base transition-colors flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Logout"
        >
          <span className="w-4 h-4 rounded-full bg-white/20"></span>
          Logout
        </motion.button>
      </div>
    </motion.nav>
  );
}
