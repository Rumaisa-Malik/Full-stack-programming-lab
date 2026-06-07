'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardBody, Button, Badge, useToast, Loader, EmptyState } from '@/components/ui';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { useAuth } from '@/lib/AuthContext';
import {
  getDoctorPatients,
  getDoctorPatientTreatments,
  getDoctorIdByUserId,
} from '@/lib/doctorService';

interface Patient {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
}

export default function DoctorPatientsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [doctorId, setDoctorId] = useState<string>('');
  const [treatedPatients, setTreatedPatients] = useState<Patient[]>([]);
  const [selectedPatientTreatments, setSelectedPatientTreatments] = useState<any>(null);
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const id = await getDoctorIdByUserId(user.id);
        setDoctorId(id);
        const patients = await getDoctorPatients(user.id);
        setTreatedPatients(patients);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
        addToast('Failed to load patients', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, addToast]);

  if (loading) {
    return (
      <ProtectedRoute requiredRoles={['doctor']}>
        <div className="min-h-screen bg-base flex items-center justify-center">
          <Loader variant="heartbeat" size="lg" />
        </div>
      </ProtectedRoute>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <ProtectedRoute requiredRoles={['doctor']}>
      <div className="min-h-screen bg-base py-8">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-ink mb-2">My Patients</h1>
            <p className="text-ink-soft text-sm mt-1">
              {treatedPatients.length} patient{treatedPatients.length !== 1 ? 's' : ''} under care
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card variant="glass">
                <CardHeader title="Patient Treatment History" subtitle={`${treatedPatients.length} patient${treatedPatients.length !== 1 ? 's' : ''}`} />
                {treatedPatients.length === 0 ? (
                  <CardBody>
                    <EmptyState
                      icon="👥"
                      title="No patients treated yet"
                      description="You haven't treated any patients yet."
                    />
                  </CardBody>
                ) : (
                  <div className="divide-y divide-line">
                    {treatedPatients.map((patient) => (
                      <motion.div
                        key={patient._id}
                        className="p-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <p className="font-semibold text-ink text-base">{patient.userId.name}</p>
                            <p className="text-sm text-slate-600">{patient.userId.email}</p>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={async () => {
                              try {
                                const treatments = await getDoctorPatientTreatments(doctorId, patient._id);
                                setSelectedPatientTreatments(treatments);
                                setExpandedPatientId(expandedPatientId === patient._id ? null : patient._id);
                              } catch (error) {
                                addToast('Failed to load treatment history', 'error');
                              }
                            }}
                          >
                            {expandedPatientId === patient._id ? 'Hide History' : 'View History'}
                          </Button>
                        </div>

                        {expandedPatientId === patient._id && selectedPatientTreatments && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 pt-4 border-t border-slate-200 bg-slate-50 rounded-lg p-3"
                          >
                            {selectedPatientTreatments.length === 0 ? (
                              <p className="text-sm text-slate-600">No treatment history for this patient</p>
                            ) : (
                              <div className="space-y-3">
                                {selectedPatientTreatments.map((treatment: any, idx: number) => (
                                  <div key={idx} className="bg-white rounded p-3 border border-slate-200">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <p className="font-semibold text-ink text-sm">{treatment.appointment?.specialty || 'Treatment'}</p>
                                        <p className="text-xs text-slate-600">
                                          {treatment.visits?.length || 0} visit{treatment.visits?.length !== 1 ? 's' : ''}
                                        </p>
                                      </div>
                                      <Badge variant="success">
                                        {treatment.status || 'Active'}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-slate-600 mb-2">
                                      Started: {new Date(treatment.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                      })}
                                    </p>
                                    {treatment.visits && treatment.visits.length > 0 && (
                                      <div className="text-xs text-slate-600 space-y-1 border-t border-slate-100 pt-2">
                                        {treatment.visits.slice(0, 2).map((visit: any, vIdx: number) => (
                                          <p key={vIdx}>• {visit.checkupNotes || 'Follow-up visit'}</p>
                                        ))}
                                        {treatment.visits.length > 2 && (
                                          <p className="text-slate-500">+ {treatment.visits.length - 2} more visit{treatment.visits.length - 2 !== 1 ? 's' : ''}</p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
