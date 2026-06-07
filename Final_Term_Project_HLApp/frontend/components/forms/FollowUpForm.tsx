'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '@/components/ui';

interface FollowUpFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (scheduledDate: string) => Promise<void>;
  isLoading?: boolean;
}

export function FollowUpForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: FollowUpFormProps) {
  const [scheduledDate, setScheduledDate] = useState('');

  const handleSubmit = async () => {
    if (!scheduledDate) return;
    await onSubmit(scheduledDate);
    setScheduledDate('');
  };

  const isValid = !!scheduledDate;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <motion.div
              className="glass rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-ink mb-6">Schedule Follow-up</h2>

              <Input
                label="Follow-up Date"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />

              <div className="flex gap-3 justify-end mt-8">
                <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!isValid || isLoading}
                >
                  {isLoading ? 'Scheduling...' : 'Schedule'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
