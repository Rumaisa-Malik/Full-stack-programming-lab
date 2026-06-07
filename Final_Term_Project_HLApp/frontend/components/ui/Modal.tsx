'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="pointer-events-auto">
              <div className={`glass ${sizes[size]} rounded-2xl w-full mx-4`}>
                {title && (
                  <div className="border-b border-line pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-ink">{title}</h2>
                  </div>
                )}

                <div className="mb-6">{children}</div>

                {footer && (
                  <div className="border-t border-line pt-6 flex gap-3 justify-end">
                    {footer}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-ink-soft mb-4">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 rounded-lg border-2 border-line text-ink hover:bg-base transition-all"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={`flex-1 px-4 py-2 rounded-lg text-white transition-all ${
            isDangerous
              ? 'bg-danger hover:bg-opacity-90'
              : 'bg-accent hover:bg-opacity-90'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
