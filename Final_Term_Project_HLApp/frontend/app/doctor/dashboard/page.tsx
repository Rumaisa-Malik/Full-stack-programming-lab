'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardHeader, CardBody, Button, Badge, AlertDialog, useToast, Loader, EmptyState } from '@/components/ui';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { useAuth } from '@/lib/AuthContext';
import {
  getDoctorAppointments,
  getTodayAppointments,
  updateAppointmentStatus,
  getDoctorTreatmentStats,
} from '@/lib/doctorService';

interface Appointment {
  _id: string;
  patient: {
    _id: string;
    userId: {
      name: string;
      email: string;
    };
  };
  specialty: string;
  reason: string;
  requestedDate: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  createdAt: string;
}

interface Stats {
  totalPatients: number;
  appointmentsToday: number;
  pendingReviews: number;
  activeCount: number;
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isActing, setIsActing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [appts, todayAppts, treatmentStats] = await Promise.all([
          getDoctorAppointments(user.id),
          getTodayAppointments(user.id),
          getDoctorTreatmentStats(user.id),
        ]);

        setAppointments(appts);
        setTodayAppointments(todayAppts);
        setStats({
          totalPatients: treatmentStats.totalPatients,
          appointmentsToday: todayAppts.length,
          pendingReviews: treatmentStats.pendingReviews,
          activeCount: treatmentStats.activeCount,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        addToast('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, addToast]);

  const handleApproveAppointment = async () => {
    if (!selectedAppointment || !user) return;
    try {
      setIsActing(true);
      await updateAppointmentStatus(selectedAppointment._id, 'approved', user.id);
      const patientName = selectedAppointment?.patient?.userId?.name || 'Patient';
      addToast(`✓ Appointment approved for ${patientName}`, 'success');
      setIsApproveDialogOpen(false);
      setSelectedAppointment(null);
      const [appts, todayAppts] = await Promise.all([
        getDoctorAppointments(user.id),
        getTodayAppointments(user.id),
      ]);
      setAppointments(appts);
      setTodayAppointments(todayAppts);
    } catch (error) {
      addToast('Failed to approve appointment', 'error');
    } finally {
      setIsActing(false);
    }
  };

  const handleRejectAppointment = async () => {
    if (!selectedAppointment || !user) return;
    try {
      setIsActing(true);
      await updateAppointmentStatus(selectedAppointment._id, 'rejected', user.id);
      const patientName = selectedAppointment?.patient?.userId?.name || 'Patient';
      addToast(`✓ Appointment rejected for ${patientName}`, 'success');
      setIsRejectDialogOpen(false);
      setSelectedAppointment(null);
      const [appts, todayAppts] = await Promise.all([
        getDoctorAppointments(user.id),
        getTodayAppointments(user.id),
      ]);
      setAppointments(appts);
      setTodayAppointments(todayAppts);
    } catch (error) {
      addToast('Failed to reject appointment', 'error');
    } finally {
      setIsActing(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRoles={['doctor']}>
        <div className="min-h-screen bg-base flex items-center justify-center">
          <Loader variant="heartbeat" size="lg" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['doctor']}>
      <div className="min-h-screen bg-base py-8">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-ink mb-2">{user?.name}</h1>
            <p className="text-ink-soft text-sm mt-1">
              {stats?.totalPatients || 0} patient{stats?.totalPatients !== 1 ? 's' : ''} under care
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Link href="/doctor/appointments">
              <Card variant="glass" interactive>
                <CardBody>
                  <p className="text-3xl mb-2">📅</p>
                  <p className="font-semibold text-ink">All Appointments</p>
                  <p className="text-xs text-ink-soft mt-1">{appointments.length} total</p>
                </CardBody>
              </Card>
            </Link>
            <Card variant="glass">
              <CardBody>
                <p className="text-3xl mb-2">📋</p>
                <p className="font-semibold text-ink">Today</p>
                <p className="text-xs text-ink-soft mt-1">{todayAppointments.length} appointments</p>
              </CardBody>
            </Card>
          </motion.div>

          {/* Appointments List */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card variant="glass" className="mb-8">
              <CardHeader title="All Appointments" subtitle={`${appointments.length} total`} />
              {appointments.length === 0 ? (
                <CardBody>
                  <EmptyState
                    icon="📅"
                    title="No appointments"
                    description="You don't have any scheduled appointments yet."
                  />
                </CardBody>
              ) : (
                <div className="divide-y divide-line">
                  {appointments.map((apt) => (
                    <motion.div
                      key={apt._id}
                      className="p-4 flex items-center justify-between hover:bg-accent-soft/20 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-ink">{apt.patient.userId.name}</p>
                          <Badge
                            variant={
                              apt.status === 'approved'
                                ? 'success'
                                : apt.status === 'pending'
                                  ? 'warning'
                                  : apt.status === 'rejected'
                                    ? 'danger'
                                    : 'default'
                            }
                          >
                            {apt.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-ink-soft mb-1">{apt.specialty} • {apt.reason}</p>
                        <p className="text-xs text-ink-soft">
                          {new Date(apt.requestedDate).toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {apt.status === 'pending' && (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setSelectedAppointment(apt);
                                setIsApproveDialogOpen(true);
                              }}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setSelectedAppointment(apt);
                                setIsRejectDialogOpen(true);
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {apt.status === 'approved' && (
                          <Link href={`/doctor/appointments#${apt._id}`}>
                            <Button variant="secondary" size="sm">
                              Manage
                            </Button>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Today's Schedule */}
          {todayAppointments.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card variant="glass">
                <CardHeader title="Today's Schedule" subtitle={`${todayAppointments.length} appointments`} />
                <div className="divide-y divide-line">
                  {todayAppointments.map((apt) => (
                    <motion.div
                      key={apt._id}
                      className="p-4 flex items-center justify-between hover:bg-accent-soft/20 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <div className="flex-1">
                        <p className="font-mono text-sm font-semibold text-accent">
                          {new Date(apt.requestedDate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="font-semibold text-ink">{apt.patient.userId.name}</p>
                        <p className="text-xs text-ink-soft">{apt.reason}</p>
                      </div>
                      {apt.status === 'approved' && (
                        <Link href={`/doctor/appointments#${apt._id}`}>
                          <Button variant="secondary" size="sm">
                            Manage
                          </Button>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}


          {/* Dialogs */}
          <AlertDialog
            isOpen={isApproveDialogOpen}
            onClose={() => setIsApproveDialogOpen(false)}
            onConfirm={handleApproveAppointment}
            title="Approve Appointment"
            description={`Approve appointment for ${selectedAppointment?.patient?.userId?.name}? This will create a treatment record.`}
            confirmText="Approve"
            isDangerous={false}
            isLoading={isActing}
          />

          <AlertDialog
            isOpen={isRejectDialogOpen}
            onClose={() => setIsRejectDialogOpen(false)}
            onConfirm={handleRejectAppointment}
            title="Reject Appointment"
            description={`Reject appointment for ${selectedAppointment?.patient?.userId?.name}?`}
            confirmText="Reject"
            isDangerous={true}
            isLoading={isActing}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
