'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '@/components/ui';

interface Medication {
  name: string;
  dosage: string;
  schedule: string;
  durationDays: number;
}

interface PrescriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (medications: Medication[], notes: string) => Promise<void>;
  isLoading?: boolean;
}

export function PrescriptionForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: PrescriptionFormProps) {
  const [medications, setMedications] = useState<Medication[]>([
    { name: '', dosage: '', schedule: '', durationDays: 1 },
  ]);
  const [notes, setNotes] = useState('');

  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '', schedule: '', durationDays: 1 }]);
  };

  const handleUpdateMedication = (index: number, field: keyof Medication, value: any) => {
    const newMeds = [...medications];
    newMeds[index] = { ...newMeds[index], [field]: value };
    setMedications(newMeds);
  };

  const handleRemoveMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (medications.some((m) => !m.name || !m.dosage || !m.schedule)) {
      return;
    }
    await onSubmit(medications, notes);
    setMedications([{ name: '', dosage: '', schedule: '', durationDays: 1 }]);
    setNotes('');
  };

  const isValid = medications.every((m) => m.name && m.dosage && m.schedule);

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
              className="glass rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-ink mb-6">Add Prescription</h2>

              <div className="space-y-6 mb-6">
                {medications.map((med, idx) => (
                  <motion.div
                    key={idx}
                    className="p-4 rounded-lg border border-line bg-base/50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <p className="font-semibold text-ink">Medication {idx + 1}</p>
                      {medications.length > 1 && (
                        <button
                          onClick={() => handleRemoveMedication(idx)}
                          className="text-danger text-sm hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <Input
                        label="Name"
                        placeholder="e.g. Lisinopril"
                        value={med.name}
                        onChange={(e) => handleUpdateMedication(idx, 'name', e.target.value)}
                      />
                      <Input
                        label="Dosage"
                        placeholder="e.g. 10mg"
                        value={med.dosage}
                        onChange={(e) => handleUpdateMedication(idx, 'dosage', e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Schedule"
                        placeholder="e.g. Twice daily"
                        value={med.schedule}
                        onChange={(e) => handleUpdateMedication(idx, 'schedule', e.target.value)}
                      />
                      <Input
                        label="Duration (days)"
                        type="number"
                        min="1"
                        max="365"
                        value={med.durationDays}
                        onChange={(e) => handleUpdateMedication(idx, 'durationDays', parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddMedication}
                className="w-full mb-6"
              >
                + Add Another Medication
              </Button>

              <Input
                label="Notes (optional)"
                placeholder="Any special instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
                  {isLoading ? 'Saving...' : 'Save Prescription'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
