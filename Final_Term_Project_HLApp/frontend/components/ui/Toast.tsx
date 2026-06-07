'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);
let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastType = 'info', duration = 5000) => {
    const id = String(toastId++);
    const toast: ToastMessage = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const typeStyles = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    info: 'bg-accent text-white',
    warning: 'bg-yellow-500 text-white',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {toasts && toasts.length > 0 && toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`
              ${typeStyles[toast.type]}
              rounded-lg p-4 mb-3 shadow-soft
              flex items-center gap-3
              pointer-events-auto cursor-pointer
              max-w-sm
            `}
            onClick={() => onRemove(toast.id)}
          >
            <span className="text-lg font-bold">{icons[toast.type]}</span>
            <span className="flex-1 text-sm">{toast.message}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(toast.id);
              }}
              className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
