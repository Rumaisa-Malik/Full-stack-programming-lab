'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Badge, useToast, Loader, EmptyState } from '@/components/ui';
import { type CareVisit } from '@/components/timeline';
import { ContinuousCareTimeline } from '@/components/timeline/ContinuousCareTimeline';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { useAuth } from '@/lib/AuthContext';
import {
  getPatientData,
  getPatientAppointments,
  getPatientTreatmentsData,
  Appointment,
} from '@/lib/patientService';

export default function PatientDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [patientName, setPatientName] = useState<string>('');
  const [treatmentJourney, setTreatmentJourney] = useState<CareVisit[]>([]);
  const [upcomingAppointment, setUpcomingAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async (user: any) => {
    try {
      // Fetch patient profile
      const patientData = await getPatientData(user.id);
      setPatientName(patientData.userId?.name || 'Patient');

      // Fetch appointments
      const appts = await getPatientAppointments(user.id);

      // Find upcoming appointment (approved or pending, not completed)
      const upcoming = appts.find(
        (apt: Appointment) => apt.status === 'approved' || apt.status === 'pending'
      );
      if (upcoming) {
        setUpcomingAppointment(upcoming);
      }

      // Fetch treatments for timeline
      const treatments = await getPatientTreatmentsData(user.id);

      // Transform treatments into CareVisit format for timeline
      const visits: CareVisit[] = treatments.flatMap((treatment: any) =>
        (treatment.visits || []).map((visit: any, idx: number) => {
          // If treatment is explicitly marked as completed, show all visits as completed
          if (treatment.status === 'completed') {
            return {
              id: `${treatment._id}-visit-${idx}`,
              date: visit.date,
              doctor: treatment.doctor?.userId?.name || 'Doctor',
              specialty: treatment.appointment?.specialty || 'Consultation',
              checkupNotes: visit.checkupNotes || '',
              vitals: visit.vitals || {},
              prescriptions: [],
              status: 'completed' as const,
            };
          }

          // Otherwise determine status based on date
          const visitDate = new Date(visit.date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          visitDate.setHours(0, 0, 0, 0);

          let status: 'completed' | 'active' | 'pending' = 'pending';
          if (visitDate < today) {
            status = 'completed';
          } else if (visitDate.getTime() === today.getTime()) {
            status = 'active';
          } else {
            status = 'pending';
          }

          return {
            id: `${treatment._id}-visit-${idx}`,
            date: visit.date,
            doctor: treatment.doctor?.userId?.name || 'Doctor',
            specialty: treatment.appointment?.specialty || 'Consultation',
            checkupNotes: visit.checkupNotes || '',
            vitals: visit.vitals || {},
            prescriptions: [],
            status: status,
          };
        })
      );

      setTreatmentJourney(visits);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      addToast('Failed to load dashboard data', 'error');
    }
  };

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        setLoading(true);
        await loadDashboardData(user);
        setLoading(false);
      }
    };

    fetchData();

    // Refetch data every 15 seconds to show real-time updates
    const interval = setInterval(() => {
      if (isMounted) {
        loadDashboardData(user);
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
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-ink mb-2">Welcome, {patientName}</h1>
            <p className="text-base text-slate-600">Your health journey, all in one place</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Quick Action: Book Appointment */}
            <motion.div variants={itemVariants}>
              <Link href="/book">
                <div className="bg-indigo-600 border border-indigo-600 rounded-2xl p-8 shadow-soft cursor-pointer">
                  <div className="py-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Book an Appointment</h2>
                        <p className="text-base text-indigo-100">Schedule a consultation with a specialist</p>
                      </div>
                      <div className="text-3xl text-indigo-200">→</div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Continuous Care Timeline */}
            <motion.div variants={itemVariants}>
              <Card variant="glass">
                <CardHeader
                  title="Continuous Care Timeline"
                  subtitle="Track your treatment journey with detailed visit timeline"
                />
                <CardBody>
                  <ContinuousCareTimeline
                    visits={treatmentJourney.map((visit) => ({
                      id: visit.id,
                      date: visit.date,
                      doctor: visit.doctor,
                      specialty: visit.specialty,
                      status: visit.status as 'completed' | 'active' | 'pending',
                      checkupNotes: visit.checkupNotes,
                      vitals: visit.vitals,
                    }))}
                  />
                </CardBody>
              </Card>
            </motion.div>


            {/* Upcoming Appointment */}
            <motion.div variants={itemVariants}>
              <Card variant="glass">
                <CardHeader
                  title="Upcoming Appointment"
                  subtitle={upcomingAppointment ? 'Your next scheduled visit' : 'No upcoming appointments'}
                />
                {upcomingAppointment ? (
                  <CardBody>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center gap-3">
                        <div className="flex-1">
                          <p className="text-xs text-ink-soft mb-1">Specialty</p>
                          <Badge variant="info">{upcomingAppointment.specialty}</Badge>
                        </div>
                        <div>
                          <p className="text-xs text-ink-soft mb-1">Status</p>
                          <Badge
                            variant={
                              upcomingAppointment.status === 'approved'
                                ? 'success'
                                : upcomingAppointment.status === 'pending'
                                  ? 'warning'
                                  : 'default'
                            }
                          >
                            {upcomingAppointment.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="bg-base/50 rounded-lg p-3">
                        <p className="text-xs text-ink-soft mb-1">Scheduled Date</p>
                        <p className="text-sm font-semibold text-ink">
                          {new Date(upcomingAppointment.requestedDate).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-ink-soft mb-1">Reason</p>
                        <p className="text-sm text-ink">{upcomingAppointment.reason}</p>
                      </div>

                      {upcomingAppointment.status === 'pending' && (
                        <p className="text-sm text-slate-600 italic">Awaiting doctor approval...</p>
                      )}
                    </div>
                  </CardBody>
                ) : (
                  <CardBody>
                    <EmptyState
                      icon="📅"
                      title="No upcoming appointments"
                      description="You haven't booked any appointments yet. Click the button above to schedule a consultation."
                    />
                  </CardBody>
                )}
              </Card>
            </motion.div>


          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
