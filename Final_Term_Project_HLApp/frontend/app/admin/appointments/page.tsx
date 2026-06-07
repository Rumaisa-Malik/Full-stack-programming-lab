'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Badge,
  useToast,
  Loader,
  EmptyState,
  AlertDialog,
} from '@/components/ui';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import {
  getAllAppointments,
  getAllDoctors,
  updateAppointmentStatus,
  deleteAppointment,
} from '@/lib/adminService';

interface Doctor {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  specialty: string;
}

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
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
}

export default function ManageAppointments() {
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isActing, setIsActing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aptsData, docsData] = await Promise.all([
        getAllAppointments(),
        getAllDoctors(),
      ]);
      setAppointments(aptsData);
      setDoctors(docsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      addToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments =
    filterStatus === 'all'
      ? appointments
      : appointments.filter((apt) => apt.status === filterStatus);

  const handleAssignDoctor = async () => {
    if (!selectedAppointment || !selectedDoctor) {
      addToast('Please select a doctor', 'error');
      return;
    }

    try {
      setIsActing(true);
      await updateAppointmentStatus(
        selectedAppointment._id,
        'approved',
        selectedDoctor
      );
      addToast('✓ Doctor assigned and appointment approved', 'success');
      setAssignDialogOpen(false);
      setSelectedAppointment(null);
      setSelectedDoctor('');
      await fetchData();
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Failed to assign doctor', 'error');
    } finally {
      setIsActing(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedAppointment) return;

    try {
      setIsActing(true);
      await updateAppointmentStatus(selectedAppointment._id, 'approved');
      addToast('✓ Appointment approved', 'success');
      setApproveDialogOpen(false);
      setSelectedAppointment(null);
      await fetchData();
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Failed to approve appointment', 'error');
    } finally {
      setIsActing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedAppointment) return;

    try {
      setIsActing(true);
      await updateAppointmentStatus(selectedAppointment._id, 'rejected');
      addToast('✓ Appointment rejected', 'success');
      setRejectDialogOpen(false);
      setSelectedAppointment(null);
      await fetchData();
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Failed to reject appointment', 'error');
    } finally {
      setIsActing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;

    try {
      setIsActing(true);
      await deleteAppointment(selectedAppointment._id);
      addToast('✓ Appointment deleted', 'success');
      setDeleteDialogOpen(false);
      setSelectedAppointment(null);
      await fetchData();
    } catch (error: any) {
      addToast(error.response?.data?.error || 'Failed to delete appointment', 'error');
    } finally {
      setIsActing(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRoles={['admin']}>
        <div className="min-h-screen bg-base flex items-center justify-center">
          <Loader variant="heartbeat" size="lg" />
        </div>
      </ProtectedRoute>
    );
  }

  const statusCounts = {
    pending: appointments.filter((a) => a.status === 'pending').length,
    approved: appointments.filter((a) => a.status === 'approved').length,
    rejected: appointments.filter((a) => a.status === 'rejected').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
  };

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <div className="min-h-screen bg-base py-8">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-ink mb-2">Manage Appointments</h1>
            <p className="text-ink-soft">Review, approve, reject, and assign doctors to patient appointments</p>
          </motion.div>

          {/* Status Filter */}
          <motion.div
            className="flex gap-2 mb-8 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {['all', 'pending', 'approved', 'rejected', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-accent text-white'
                    : 'bg-surface text-ink hover:bg-accent-soft'
                }`}
              >
                {status === 'all'
                  ? 'All'
                  : status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && ` (${statusCounts[status as keyof typeof statusCounts]})`}
              </button>
            ))}
          </motion.div>

          {/* Appointments List */}
          {filteredAppointments.length === 0 ? (
            <Card variant="glass">
              <CardBody>
                <EmptyState
                  icon="📅"
                  title="No appointments"
                  description={`No ${filterStatus === 'all' ? '' : filterStatus + ' '}appointments found.`}
                />
              </CardBody>
            </Card>
          ) : (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
            >
              {filteredAppointments.map((appointment) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card variant="glass" className="hover:shadow-lg transition-shadow">
                    <CardBody>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Patient & Appointment Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div>
                              <p className="font-semibold text-ink text-lg">
                                {appointment.patient?.userId?.name || 'Patient Info Unavailable'}
                              </p>
                              <p className="text-sm text-ink-soft">
                                {appointment.patient?.userId?.email || 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                            <div>
                              <p className="text-ink-soft">Specialty</p>
                              <p className="font-medium text-ink">{appointment.specialty}</p>
                            </div>
                            <div>
                              <p className="text-ink-soft">Reason</p>
                              <p className="font-medium text-ink">{appointment.reason}</p>
                            </div>
                            <div>
                              <p className="text-ink-soft">Requested Date</p>
                              <p className="font-medium text-ink">
                                {new Date(appointment.requestedDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-ink-soft">Status</p>
                              <Badge
                                variant={
                                  appointment.status === 'approved'
                                    ? 'success'
                                    : appointment.status === 'pending'
                                      ? 'warning'
                                      : appointment.status === 'rejected'
                                        ? 'danger'
                                        : 'default'
                                }
                              >
                                {appointment.status.charAt(0).toUpperCase() +
                                  appointment.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 md:flex-col flex-wrap md:flex-nowrap">
                          {appointment.status === 'pending' && (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setAssignDialogOpen(true);
                                }}
                              >
                                Assign Doctor
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setApproveDialogOpen(true);
                                }}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setRejectDialogOpen(true);
                                }}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                          {appointment.status !== 'pending' && (
                            <p className="text-sm text-ink-soft">
                              {appointment.status === 'approved'
                                ? 'Approved'
                                : appointment.status === 'rejected'
                                  ? 'Rejected'
                                  : 'Completed'}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Assign Doctor Dialog */}
          {assignDialogOpen && selectedAppointment && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h3 className="text-2xl font-bold text-ink mb-4">Assign Doctor</h3>
                <p className="text-ink-soft mb-6">
                  Assign a doctor to {selectedAppointment.patient.userId.name}'s{' '}
                  {selectedAppointment.specialty} appointment
                </p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-ink mb-2">
                    Select Doctor
                  </label>
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="w-full px-4 py-2 border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-ink"
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors
                      .filter((doc) => doc.specialty === selectedAppointment.specialty)
                      .map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          {doctor.userId.name} ({doctor.specialty})
                        </option>
                      ))}
                  </select>
                  {doctors.filter((d) => d.specialty === selectedAppointment.specialty)
                    .length === 0 && (
                    <p className="text-sm text-danger mt-2">
                      No doctors available for {selectedAppointment.specialty}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setAssignDialogOpen(false);
                      setSelectedDoctor('');
                    }}
                    disabled={isActing}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleAssignDoctor}
                    disabled={!selectedDoctor || isActing}
                    className="flex-1"
                  >
                    {isActing ? 'Assigning...' : 'Assign & Approve'}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Approve Dialog */}
          <AlertDialog
            isOpen={approveDialogOpen}
            onClose={() => setApproveDialogOpen(false)}
            onConfirm={handleApprove}
            title="Approve Appointment"
            description={`Approve appointment for ${selectedAppointment?.patient?.userId?.name}? A treatment record will be created.`}
            confirmText="Approve"
            isDangerous={false}
            isLoading={isActing}
          />

          {/* Reject Dialog */}
          <AlertDialog
            isOpen={rejectDialogOpen}
            onClose={() => setRejectDialogOpen(false)}
            onConfirm={handleReject}
            title="Reject Appointment"
            description={`Reject appointment for ${selectedAppointment?.patient?.userId?.name}?`}
            confirmText="Reject"
            isDangerous={true}
            isLoading={isActing}
          />

          {/* Delete Dialog */}
          <AlertDialog
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={handleDelete}
            title="Delete Appointment"
            description={`Permanently delete appointment for ${selectedAppointment?.patient?.userId?.name}? This action cannot be undone.`}
            confirmText="Delete"
            isDangerous={true}
            isLoading={isActing}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
