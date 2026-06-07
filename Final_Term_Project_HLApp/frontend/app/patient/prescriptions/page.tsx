'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Badge, useToast, Loader, EmptyState } from '@/components/ui';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { useAuth } from '@/lib/AuthContext';
import { getPatientPrescriptions } from '@/lib/patientService';

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const prescsData = await getPatientPrescriptions(user.id);
        if (isMounted) {
          setPrescriptions(prescsData);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch prescriptions:', error);
          addToast('Failed to load prescriptions', 'error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
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
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-ink mb-2">My Prescriptions</h1>
            <p className="text-base text-slate-600">Manage and track your active prescriptions</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {prescriptions.length > 0 ? (
              <>
                {/* Summary Stats */}
                <motion.div variants={itemVariants}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card variant="glass" className="bg-indigo-50 border border-indigo-200">
                      <CardBody>
                        <p className="text-slate-600 text-sm mb-1">Total Prescriptions</p>
                        <p className="text-3xl font-bold text-indigo-600">{prescriptions.length}</p>
                      </CardBody>
                    </Card>
                    <Card variant="glass" className="bg-green-50 border border-green-200">
                      <CardBody>
                        <p className="text-slate-600 text-sm mb-1">Active Medications</p>
                        <p className="text-3xl font-bold text-green-600">
                          {prescriptions.reduce((sum, p) => sum + (p.medications?.length || 0), 0)}
                        </p>
                      </CardBody>
                    </Card>
                    <Card variant="glass" className="bg-purple-50 border border-purple-200">
                      <CardBody>
                        <p className="text-slate-600 text-sm mb-1">Last Updated</p>
                        <p className="text-lg font-bold text-purple-600">
                          {prescriptions.length > 0
                            ? new Date(prescriptions[0].issuedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'N/A'}
                        </p>
                      </CardBody>
                    </Card>
                  </div>
                </motion.div>

                {/* Prescriptions List */}
                <motion.div variants={itemVariants}>
                  <Card variant="glass">
                    <CardHeader
                      title="Active Prescriptions"
                      subtitle={`${prescriptions.length} prescription${prescriptions.length !== 1 ? 's' : ''}`}
                    />
                    <div className="divide-y divide-line">
                      {prescriptions.map((prescription, idx) => (
                        <motion.div
                          key={idx}
                          className="p-6 hover:bg-base/50 transition-colors"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="text-xl font-bold text-ink mb-2">
                                  {prescription.medications.map((m: any) => m.name).join(', ')}
                                </p>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="info">
                                    Dr. {prescription.doctor?.userId?.name || 'Doctor'}
                                  </Badge>
                                  <Badge variant="success">Active</Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-slate-600">Issued</p>
                                <p className="text-base font-semibold text-ink">
                                  {new Date(prescription.issuedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Medications Details */}
                            <div className="bg-slate-50 rounded-lg p-4">
                              <p className="text-sm font-semibold text-ink mb-3">Medication Details</p>
                              <div className="space-y-2">
                                {prescription.medications.map((med: any, medIdx: number) => (
                                  <motion.div
                                    key={medIdx}
                                    className="flex justify-between items-start p-2 bg-white rounded"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: medIdx * 0.1 }}
                                  >
                                    <div className="flex-1">
                                      <p className="text-base font-medium text-ink">{med.name}</p>
                                      <p className="text-sm text-slate-600">{med.dosage}</p>
                                    </div>
                                    <div className="text-right">
                                      <Badge variant="info" className="text-xs">
                                        {med.schedule}
                                      </Badge>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>

                            {/* Notes */}
                            {prescription.notes && (
                              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                                <p className="text-sm font-semibold text-indigo-900 mb-1">Special Instructions</p>
                                <p className="text-sm text-indigo-800">"{prescription.notes}"</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </>
            ) : (
              <motion.div variants={itemVariants}>
                <Card variant="glass">
                  <CardBody>
                    <EmptyState
                      icon="💊"
                      title="No Prescriptions Yet"
                      description="You don't have any active prescriptions. Once a doctor prescribes medication, it will appear here."
                    />
                  </CardBody>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
