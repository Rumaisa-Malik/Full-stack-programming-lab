'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '@/components/ui';

interface VisitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { date: string; checkupNotes: string; vitals?: any }) => Promise<void>;
  isLoading?: boolean;
}

export function VisitForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: VisitFormProps) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [checkupNotes, setCheckupNotes] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [temperature, setTemperature] = useState('');

  const handleSubmit = async () => {
    if (!checkupNotes) return;

    const vitals: any = {};
    if (bloodPressure) vitals.bloodPressure = bloodPressure;
    if (heartRate) vitals.heartRate = parseInt(heartRate) || undefined;
    if (temperature) vitals.temperature = parseFloat(temperature) || undefined;

    await onSubmit({
      date,
      checkupNotes,
      vitals: Object.keys(vitals).length > 0 ? vitals : undefined,
    });

    setDate(new Date().toISOString().slice(0, 16));
    setCheckupNotes('');
    setBloodPressure('');
    setHeartRate('');
    setTemperature('');
  };

  const isValid = !!checkupNotes;

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
              className="glass rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-ink mb-6">Record Visit</h2>

              <Input
                label="Visit Date & Time"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <div className="mt-6 mb-6">
                <label className="block text-sm font-semibold text-ink mb-2">
                  Checkup Notes *
                </label>
                <textarea
                  value={checkupNotes}
                  onChange={(e) => setCheckupNotes(e.target.value)}
                  placeholder="Summary of the visit, findings, and observations..."
                  className="w-full px-3 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  rows={4}
                />
              </div>

              <div className="mb-6 p-4 rounded-lg border border-line bg-base/50">
                <p className="text-sm font-semibold text-ink mb-4">Vitals (optional)</p>
                <div className="space-y-3">
                  <Input
                    label="Blood Pressure"
                    placeholder="e.g. 120/80"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                  />
                  <Input
                    label="Heart Rate (bpm)"
                    type="number"
                    min="30"
                    max="200"
                    placeholder="e.g. 72"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                  />
                  <Input
                    label="Temperature (°C)"
                    type="number"
                    step="0.1"
                    min="35"
                    max="42"
                    placeholder="e.g. 36.5"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!isValid || isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Visit'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
