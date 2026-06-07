'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Loader,
  useToast,
  EmptyState,
} from '@/components/ui';
import { VisitForm } from '@/components/forms/VisitForm';
import { FollowUpForm } from '@/components/forms/FollowUpForm';
import { PrescriptionForm } from '@/components/forms/PrescriptionForm';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { useAuth } from '@/lib/AuthContext';
import {
  getDoctorAppointments,
  getPatientTreatments,
  addVisitToTreatment,
  scheduleFollowUp,
  createPrescription,
  updateAppointmentStatus,
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
}

interface Treatment {
  _id: string;
  status: 'active' | 'monitoring' | 'completed';
  visits: any[];
  followUps: any[];
}

export default function DoctorAppointments() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [treatments, setTreatments] = useState<{ [key: string]: Treatment }>({});
  const [loading, setLoading] = useState(true);
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null);
  const [visitFormOpen, setVisitFormOpen] = useState(false);
  const [followUpFormOpen, setFollowUpFormOpen] = useState(false);
  const [prescriptionFormOpen, setPrescriptionFormOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [completingAppointmentId, setCompletingAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const appts = await getDoctorAppointments(user!.id);
      setAppointments(appts);

      const treatmentsMap: { [key: string]: Treatment } = {};
      for (const apt of appts) {
        try {
          const patientTreatments = await getPatientTreatments(apt.patient._id);
          treatmentsMap[apt.patient._id] = patientTreatments[0];
        } catch (error) {
          // Skip if no treatments
        }
      }
      setTreatments(treatmentsMap);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      addToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordVisit = async (data: any) => {
    if (!selectedAppointment || !treatments[selectedAppointment.patient._id]) {
      addToast('No active treatment found', 'error');
      return;
    }
    setFormLoading(true);
    try {
      const treatmentId = treatments[selectedAppointment.patient._id]._id;
      await addVisitToTreatment(treatmentId, data);
      addToast('✓ Visit recorded', 'success');
      setVisitFormOpen(false);
      setSelectedAppointment(null);
      // Refresh silently in the background - don't wait for it
      setFormLoading(false);
      fetchAppointments().catch(() => {});
    } catch (error: any) {
      setFormLoading(false);
      addToast(error.response?.data?.error || 'Failed to record visit', 'error');
    }
  };

  const handleScheduleFollowUp = async (scheduledDate: string) => {
    if (!selectedAppointment || !treatments[selectedAppointment.patient._id]) {
      addToast('No active treatment found', 'error');
      return;
    }
    setFormLoading(true);
    try {
      const treatmentId = treatments[selectedAppointment.patient._id]._id;
      await scheduleFollowUp(treatmentId, { scheduledDate });
      addToast('✓ Follow-up scheduled', 'success');
      setFollowUpFormOpen(false);
      setSelectedAppointment(null);
      setFormLoading(false);
      // Refresh silently in the background - don't wait for it
      fetchAppointments().catch(() => {});
    } catch (error: any) {
      setFormLoading(false);
      addToast(error.response?.data?.error || 'Failed to schedule follow-up', 'error');
    }
  };

  const handleAddPrescription = async (medications: any[], notes: string) => {
    if (!selectedAppointment || !treatments[selectedAppointment.patient._id]) {
      addToast('No active treatment found', 'error');
      return;
    }
    setFormLoading(true);
    try {
      const treatment = treatments[selectedAppointment.patient._id];
      await createPrescription({
        treatmentId: treatment._id,
        appointmentId: selectedAppointment._id,
        patientId: selectedAppointment.patient._id,
        doctorId: user!.id,
        medications,
        notes,
      });
      addToast('✓ Prescription added', 'success');
      setPrescriptionFormOpen(false);
      setSelectedAppointment(null);
      setFormLoading(false);
      // Refresh silently in the background - don't wait for it
      fetchAppointments().catch(() => {});
    } catch (error: any) {
      setFormLoading(false);
      addToast(error.response?.data?.error || 'Failed to add prescription', 'error');
    }
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    if (!user) return;
    setCompletingAppointmentId(appointmentId);
    try {
      await updateAppointmentStatus(appointmentId, 'completed', user.id);
      addToast('✓ Appointment completed', 'success');
      setCompletingAppointmentId(null);
      fetchAppointments().catch(() => {});
    } catch (error: any) {
      setCompletingAppointmentId(null);
      addToast(error.response?.data?.error || 'Failed to complete appointment', 'error');
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
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-ink mb-2">My Appointments</h1>
          <p className="text-ink-soft mb-8">Record visits, schedule follow-ups, add prescriptions</p>

          {appointments.length === 0 ? (
            <EmptyState icon="📅" title="No Appointments" description="No appointments yet." />
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => {
                const treatment = treatments[appointment.patient._id];
                const isExpanded = expandedAppointment === appointment._id;

                return (
                  <Card key={appointment._id} variant="glass" className="cursor-pointer" onClick={() => setExpandedAppointment(isExpanded ? null : appointment._id)}>
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-ink">{appointment.patient.userId.name}</h3>
                          <p className="text-sm text-ink-soft">{appointment.specialty} • {appointment.reason}</p>
                          <p className="text-xs text-ink-soft">{new Date(appointment.requestedDate).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={appointment.status === 'approved' ? 'success' : 'warning'}>{appointment.status}</Badge>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-line space-y-3">
                          {treatment ? (
                            <>
                              <div className="text-sm">
                                <p className="text-ink-soft">Visits: {treatment.visits?.length || 0}</p>
                              </div>
                              {appointment.status === 'approved' && (
                                <div className="flex gap-2 flex-wrap">
                                  <Button variant="secondary" size="sm" onClick={() => { setSelectedAppointment(appointment); setVisitFormOpen(true); }}>Record Visit</Button>
                                  <Button variant="secondary" size="sm" onClick={() => { setSelectedAppointment(appointment); setFollowUpFormOpen(true); }}>Follow-up</Button>
                                  <Button variant="primary" size="sm" onClick={() => { setSelectedAppointment(appointment); setPrescriptionFormOpen(true); }}>Prescription</Button>
                                  <Button variant="success" size="sm" onClick={() => handleCompleteAppointment(appointment._id)} isLoading={completingAppointmentId === appointment._id}>Complete</Button>
                                </div>
                              )}
                            </>
                          ) : (
                            <p className="text-sm text-ink-soft">No treatment yet</p>
                          )}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}

          <VisitForm isOpen={visitFormOpen} onClose={() => setVisitFormOpen(false)} onSubmit={handleRecordVisit} isLoading={formLoading} />
          <FollowUpForm isOpen={followUpFormOpen} onClose={() => setFollowUpFormOpen(false)} onSubmit={handleScheduleFollowUp} isLoading={formLoading} />
          <PrescriptionForm isOpen={prescriptionFormOpen} onClose={() => setPrescriptionFormOpen(false)} onSubmit={handleAddPrescription} isLoading={formLoading} />
        </div>
      </div>
    </ProtectedRoute>
  );
}

