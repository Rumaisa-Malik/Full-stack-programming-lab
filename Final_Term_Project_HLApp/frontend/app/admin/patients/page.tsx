'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardBody,
  CardHeader,
  Badge,
  Button,
  EmptyState,
  Loader,
  useToast,
  AlertDialog,
} from '@/components/ui';
import { PatientForm } from '@/components/forms/PatientForm';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import {
  getAllPatients,
  getPatient,
  getAllDoctors,
  createPatient,
  updatePatient,
  deletePatient,
  assignDoctorToPatient,
} from '@/lib/adminService';

interface Doctor {
  _id: string;
  userId: {
    name: string;
  };
  specialty: string;
}

interface Patient {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  age?: number;
  gender?: string;
  bloodGroup?: string;
  contact?: string;
  assignedDoctor?: string;
  medicalHistory: string[];
}

export default function AdminPatients() {
  const { addToast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // View detail state
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);

  // Assign doctor state
  const [assignOpen, setAssignOpen] = useState(false);
  const [assigningPatient, setAssigningPatient] = useState<Patient | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Delete state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<Patient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patientData, doctorData] = await Promise.all([
        getAllPatients(),
        getAllDoctors(),
      ]);
      setPatients(patientData);
      setDoctors(doctorData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      addToast('Failed to load patients and doctors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingPatient(null);
    setFormOpen(true);
  };

  const handleEditClick = async (patient: Patient) => {
    try {
      const fullPatient = await getPatient(patient._id);
      setEditingPatient(fullPatient);
      setFormOpen(true);
    } catch (error) {
      console.error('Failed to fetch patient details:', error);
      addToast('Failed to load patient details', 'error');
    }
  };

  const handleViewClick = async (patient: Patient) => {
    try {
      const fullPatient = await getPatient(patient._id);
      setViewingPatient(fullPatient);
    } catch (error) {
      console.error('Failed to fetch patient details:', error);
      addToast('Failed to load patient details', 'error');
    }
  };

  const handleAssignClick = (patient: Patient) => {
    setAssigningPatient(patient);
    setSelectedDoctor(patient.assignedDoctor || '');
    setAssignOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setFormLoading(true);
      if (editingPatient) {
        await updatePatient(editingPatient._id, data);
        addToast(`✓ Patient ${data.name} updated successfully`, 'success');
      } else {
        await createPatient(data);
        addToast(`✓ Patient ${data.name} added successfully`, 'success');
      }
      setFormOpen(false);
      setEditingPatient(null);
      await fetchData();
    } catch (error: any) {
      console.error('Failed to save patient:', error);
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmAssign = async () => {
    if (!assigningPatient || !selectedDoctor) {
      addToast('Please select a doctor', 'error');
      return;
    }

    try {
      setIsAssigning(true);
      await assignDoctorToPatient(assigningPatient._id, selectedDoctor);
      addToast('✓ Doctor assigned successfully', 'success');
      setAssignOpen(false);
      setAssigningPatient(null);
      await fetchData();
    } catch (error: any) {
      console.error('Failed to assign doctor:', error);
      addToast(error.response?.data?.error || 'Failed to assign doctor', 'error');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleDeleteClick = (patient: Patient) => {
    setSelectedForDelete(patient);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedForDelete) return;
    try {
      setIsDeleting(true);
      await deletePatient(selectedForDelete._id);
      addToast(`✓ Patient ${selectedForDelete.userId.name} deleted successfully`, 'success');
      setPatients(patients.filter((p) => p._id !== selectedForDelete._id));
      setDeleteConfirmOpen(false);
      setSelectedForDelete(null);
    } catch (error) {
      console.error('Failed to delete patient:', error);
      addToast('Failed to delete patient', 'error');
    } finally {
      setIsDeleting(false);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const getAssignedDoctorName = (doctorId: string) => {
    const doctor = doctors.find((d) => d._id === doctorId);
    return doctor ? `Dr. ${doctor.userId.name}` : 'Not assigned';
  };

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <div className="min-h-screen bg-base py-8">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="mb-8 flex justify-between items-start"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h1 className="text-4xl font-bold text-ink mb-2">Manage Patients</h1>
              <p className="text-ink-soft">View and manage patient accounts ({patients.length} total)</p>
            </div>
            <Button variant="primary" onClick={handleAddClick}>
              Add Patient
            </Button>
          </motion.div>

          {patients.length === 0 ? (
            <EmptyState
              icon="👤"
              title="No Patients"
              description="No patients have been registered yet. Patients will register through the sign-up flow."
            />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-4"
            >
              {patients.map((patient) => (
                <motion.div key={patient._id} variants={itemVariants}>
                  <Card variant="glass">
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-ink mb-1">{patient.userId.name}</h3>
                          <p className="text-sm text-ink-soft mb-2">{patient.userId.email}</p>
                          <p className="text-xs text-ink-soft mb-2">
                            Age: {patient.age} • Blood Group: {patient.bloodGroup}
                          </p>
                          <p className="text-xs text-ink-soft">
                            Assigned Doctor: {patient.assignedDoctor ? getAssignedDoctorName(patient.assignedDoctor) : <span className="text-accent">Not assigned</span>}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="success">Active</Badge>
                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleViewClick(patient)}
                            >
                              View
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEditClick(patient)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleAssignClick(patient)}
                            >
                              Assign Doctor
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteClick(patient)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            isOpen={deleteConfirmOpen}
            onClose={() => setDeleteConfirmOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Delete Patient"
            description={`Are you sure you want to delete ${selectedForDelete?.userId.name}? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            isDangerous={true}
            isLoading={isDeleting}
          />

          {/* View Detail Modal */}
          {viewingPatient && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingPatient(null)}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <Card variant="glass" className="max-w-2xl w-full">
                <CardHeader title={viewingPatient.userId.name} subtitle="Patient Details" />
                <CardBody>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-ink-soft mb-1">Email</p>
                        <p className="font-semibold text-ink">{viewingPatient.userId.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-ink-soft mb-1">Age</p>
                        <p className="font-semibold text-ink">{viewingPatient.age}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-ink-soft mb-1">Gender</p>
                        <p className="font-semibold text-ink">{viewingPatient.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-ink-soft mb-1">Blood Group</p>
                        <Badge variant="info">{viewingPatient.bloodGroup}</Badge>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-ink-soft mb-1">Contact</p>
                      <p className="font-semibold text-ink">{viewingPatient.contact}</p>
                    </div>

                    <div>
                      <p className="text-sm text-ink-soft mb-1">Assigned Doctor</p>
                      <p className="font-semibold text-ink">
                        {viewingPatient.assignedDoctor ? getAssignedDoctorName(viewingPatient.assignedDoctor) : <span className="text-accent">Not assigned</span>}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-ink-soft mb-1">Medical History</p>
                      <p className="font-semibold text-ink">{viewingPatient.medicalHistory?.length || 0} treatment records</p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end mt-6">
                    <Button variant="secondary" onClick={() => setViewingPatient(null)}>
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleEditClick(viewingPatient);
                        setViewingPatient(null);
                      }}
                    >
                      Edit Patient
                    </Button>
                  </div>
                </CardBody>
              </Card>
              </div>
            </motion.div>
          )}

          {/* Assign Doctor Modal */}
          {assignOpen && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAssignOpen(false)}
            >
              <div onClick={(e) => { e.stopPropagation(); }}>
                <Card variant="glass" className="max-w-md w-full">
                <CardHeader title="Assign Doctor to Patient" subtitle={`${assigningPatient?.userId.name}`} />
                <CardBody>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-ink-soft mb-2">Select Doctor</label>
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      disabled={isAssigning}
                      className="w-full px-4 py-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                    >
                      <option value="">Choose a doctor...</option>
                      {doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                          Dr. {doctor.userId.name} - {doctor.specialty}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Button variant="secondary" onClick={() => setAssignOpen(false)} disabled={isAssigning}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleConfirmAssign}
                      disabled={isAssigning || !selectedDoctor}
                    >
                      {isAssigning ? 'Assigning...' : 'Assign Doctor'}
                    </Button>
                  </div>
                </CardBody>
              </Card>
              </div>
            </motion.div>
          )}

          {/* Patient Form Modal */}
          <PatientForm
            isOpen={formOpen}
            onClose={() => {
              setFormOpen(false);
              setEditingPatient(null);
            }}
            onSubmit={handleFormSubmit}
            isLoading={formLoading}
            initialData={editingPatient}
            isEdit={!!editingPatient}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
