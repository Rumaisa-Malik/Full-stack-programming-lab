'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Badge, useToast, Loader, EmptyState } from '@/components/ui';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { useAuth } from '@/lib/AuthContext';
import { getPatientTreatmentsData, getPatientPrescriptions } from '@/lib/patientService';

interface Treatment {
  _id: string;
  specialty: string;
  doctor: {
    userId: {
      name: string;
    };
  };
  appointment: {
    specialty: string;
  };
  startDate?: string;
  createdAt: string;
  status: 'active' | 'monitoring' | 'completed';
  phase: string;
  visits: Array<{
    date: string;
    checkupNotes: string;
    vitals: Record<string, any>;
    status: string;
  }>;
  followUps: Array<{
    scheduledDate: string;
    completed: boolean;
  }>;
}

interface Prescription {
  _id: string;
  doctor: {
    specialty: string;
  };
  medications: Array<{
    name: string;
    dosage: string;
    schedule: string;
    durationDays: number;
  }>;
  notes?: string;
  issuedAt: string;
  treatment: string;
}

export default function MyTreatments() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [treatmentData, prescriptionData] = await Promise.all([
        getPatientTreatmentsData(user!.id),
        getPatientPrescriptions(user!.id),
      ]);
      setTreatments(treatmentData);
      setPrescriptions(prescriptionData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      addToast('Failed to load treatments and prescriptions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    if (isMounted) {
      setLoading(true);
      fetchData();
    }

    // Refetch data every 15 seconds to show real-time updates
    const interval = setInterval(() => {
      if (isMounted) {
        fetchData();
      }
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user, addToast]);

  if (loading) {
    return (
      <ProtectedRoute requiredRoles={['patient']}>
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
    <ProtectedRoute requiredRoles={['patient']}>
      <div className="min-h-screen bg-base py-8">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-ink mb-2">My Treatments</h1>
            <p className="text-ink-soft">Your complete medical treatment history and ongoing care cycles</p>
          </motion.div>

          {treatments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="glass">
                <CardBody>
                  <EmptyState
                    icon="📋"
                    title="No treatments yet"
                    description="Your treatment records will appear here once your appointments with doctors are completed and tracked."
                  />
                </CardBody>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {treatments.map((treatment) => (
                <motion.div key={treatment._id} variants={itemVariants}>
                  <Card
                    variant="glass"
                    className={`border-l-4 ${
                      treatment.status === 'active' ? 'border-accent' : 'border-success'
                    }`}
                  >
                    <CardHeader
                      title={`${treatment.appointment?.specialty || 'Treatment'}`}
                      subtitle={`Dr. ${treatment.doctor?.userId?.name || 'Doctor'}`}
                    />
                    <CardBody>
                      {/* Status and Phase */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                          <p className="text-sm text-ink-soft mb-2">Status</p>
                          <Badge
                            variant={
                              treatment.status === 'active'
                                ? 'success'
                                : treatment.status === 'monitoring'
                                  ? 'warning'
                                  : 'default'
                            }
                          >
                            {treatment.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-ink-soft mb-2">Phase</p>
                          <p className="font-semibold text-ink">{treatment.phase}</p>
                        </div>
                        <div>
                          <p className="text-sm text-ink-soft mb-2">Started</p>
                          <p className="font-semibold text-ink">
                            {new Date(treatment.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Visit History */}
                      {treatment.visits && treatment.visits.length > 0 && (
                        <div className="mb-6">
                          <p className="text-sm font-semibold text-ink-soft mb-3">Visit History</p>
                          <div className="space-y-3">
                            {treatment.visits.map((visit, idx) => (
                              <div key={idx} className="p-4 rounded-lg bg-base border border-line">
                                <div className="flex justify-between items-start mb-2">
                                  <p className="font-semibold text-ink">
                                    {new Date(visit.date).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </p>
                                  {idx === treatment.visits.length - 1 && (
                                    <Badge variant="default">Latest</Badge>
                                  )}
                                </div>
                                {visit.checkupNotes && (
                                  <p className="text-sm text-ink-soft italic mb-2">"{visit.checkupNotes}"</p>
                                )}
                                {Object.keys(visit.vitals || {}).length > 0 && (
                                  <div className="text-xs text-ink-soft space-y-1 mt-2">
                                    {Object.entries(visit.vitals).map(([key, val]) => (
                                      <div key={key}>
                                        <span className="capitalize font-semibold">{key}:</span> {val}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Prescriptions for this treatment */}
                      {prescriptions.filter((p) => p.treatment === treatment._id).length > 0 && (
                        <div className="mb-6">
                          <p className="text-sm font-semibold text-ink-soft mb-3">Prescriptions</p>
                          <div className="space-y-3">
                            {prescriptions
                              .filter((p) => p.treatment === treatment._id)
                              .map((prescription) => (
                                <div
                                  key={prescription._id}
                                  className="p-4 rounded-lg bg-base border border-line"
                                >
                                  <p className="text-xs text-ink-soft mb-2">
                                    Issued:{' '}
                                    {new Date(prescription.issuedAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </p>
                                  <div className="space-y-2">
                                    {prescription.medications.map((med, idx) => (
                                      <div key={idx} className="text-sm">
                                        <p className="font-semibold text-ink">{med.name}</p>
                                        <p className="text-xs text-ink-soft">
                                          {med.dosage} • {med.schedule} • {med.durationDays} days
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                  {prescription.notes && (
                                    <p className="text-xs text-ink-soft italic mt-3">
                                      "{prescription.notes}"
                                    </p>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Follow-ups */}
                      {treatment.followUps && treatment.followUps.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-ink-soft mb-3">Follow-ups</p>
                          <div className="space-y-2">
                            {treatment.followUps.map((followUp, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-lg text-sm ${
                                  followUp.completed
                                    ? 'bg-success/10 text-success'
                                    : 'bg-accent-soft/20 text-accent'
                                }`}
                              >
                                {followUp.completed ? '✓' : '⏳'} Scheduled:{' '}
                                {new Date(followUp.scheduledDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Summary Stats */}
          {treatments.length > 0 && (
            <motion.div
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card variant="glass">
                <CardHeader title="Treatment Summary" />
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-xs text-ink-soft uppercase mb-2">Total Treatments</p>
                      <p className="text-2xl font-bold text-accent">{treatments.length}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-soft uppercase mb-2">Active</p>
                      <p className="text-2xl font-bold text-accent">
                        {treatments.filter((t) => t.status === 'active').length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-soft uppercase mb-2">Completed</p>
                      <p className="text-2xl font-bold text-success">
                        {treatments.filter((t) => t.status === 'completed').length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-ink-soft uppercase mb-2">Total Visits</p>
                      <p className="text-2xl font-bold text-ink-soft">
                        {treatments.reduce((sum, t) => sum + (t.visits?.length || 0), 0)}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
