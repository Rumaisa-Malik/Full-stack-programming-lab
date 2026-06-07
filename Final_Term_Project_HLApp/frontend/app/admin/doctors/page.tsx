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
import { DoctorForm } from '@/components/forms/DoctorForm';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { getAllDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor } from '@/lib/adminService';

interface Doctor {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  specialty: string;
  assignedPatients: string[];
  qualifications: string;
  experienceYears: number;
  bio: string;
}

export default function AdminDoctors() {
  const { addToast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // View detail state
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);

  // Delete state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<Doctor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await getAllDoctors();
      setDoctors(data);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      addToast('Failed to load doctors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingDoctor(null);
    setFormOpen(true);
  };

  const handleEditClick = async (doctor: Doctor) => {
    try {
      const fullDoctor = await getDoctor(doctor._id);
      setEditingDoctor(fullDoctor);
      setFormOpen(true);
    } catch (error) {
      console.error('Failed to fetch doctor details:', error);
      addToast('Failed to load doctor details', 'error');
    }
  };

  const handleViewClick = async (doctor: Doctor) => {
    try {
      const fullDoctor = await getDoctor(doctor._id);
      setViewingDoctor(fullDoctor);
    } catch (error) {
      console.error('Failed to fetch doctor details:', error);
      addToast('Failed to load doctor details', 'error');
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setFormLoading(true);
      if (editingDoctor) {
        await updateDoctor(editingDoctor._id, data);
        addToast(`✓ Doctor ${data.name} updated successfully`, 'success');
      } else {
        await createDoctor(data);
        addToast(`✓ Doctor ${data.name} added successfully`, 'success');
      }
      setFormOpen(false);
      setEditingDoctor(null);
      await fetchDoctors();
    } catch (error: any) {
      console.error('Failed to save doctor:', error);
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (doctor: Doctor) => {
    setSelectedForDelete(doctor);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedForDelete) return;
    try {
      setIsDeleting(true);
      await deleteDoctor(selectedForDelete._id);
      addToast(`✓ Doctor ${selectedForDelete.userId.name} deleted successfully`, 'success');
      setDoctors(doctors.filter((d) => d._id !== selectedForDelete._id));
      setDeleteConfirmOpen(false);
      setSelectedForDelete(null);
    } catch (error) {
      console.error('Failed to delete doctor:', error);
      addToast('Failed to delete doctor', 'error');
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
              <h1 className="text-4xl font-bold text-ink mb-2">Manage Doctors</h1>
              <p className="text-ink-soft">View and manage doctor accounts ({doctors.length} total)</p>
            </div>
            <Button
              variant="primary"
              onClick={handleAddClick}
            >
              Add Doctor
            </Button>
          </motion.div>

          {doctors.length === 0 ? (
            <EmptyState
              icon="👨‍⚕️"
              title="No Doctors"
              description="No doctors have been registered yet. Add doctors to assign patients and appointments."
            />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-4"
            >
              {doctors.map((doctor) => (
                <motion.div key={doctor._id} variants={itemVariants}>
                  <Card variant="glass">
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-ink mb-1">{doctor.userId.name}</h3>
                          <p className="text-sm text-ink-soft mb-1">{doctor.specialty}</p>
                          <p className="text-xs text-ink-soft mb-2">
                            {doctor.experienceYears} years experience • {doctor.assignedPatients.length} patient{doctor.assignedPatients.length !== 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-ink-soft">{doctor.userId.email}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="success">Active</Badge>
                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleViewClick(doctor)}
                            >
                              View
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEditClick(doctor)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteClick(doctor)}
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
            title="Delete Doctor"
            description={`Are you sure you want to delete Dr. ${selectedForDelete?.userId.name}? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            isDangerous={true}
            isLoading={isDeleting}
          />

          {/* View Detail Modal */}
          {viewingDoctor && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingDoctor(null)}
            >
              <div onClick={(e) => { e.stopPropagation(); }}>
                <Card variant="glass" className="max-w-2xl w-full">
                <CardHeader title={`Dr. ${viewingDoctor.userId.name}`} subtitle={viewingDoctor.specialty} />
                <CardBody>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-ink-soft mb-1">Email</p>
                        <p className="font-semibold text-ink">{viewingDoctor.userId.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-ink-soft mb-1">Specialty</p>
                        <Badge variant="info">{viewingDoctor.specialty}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-ink-soft mb-1">Experience</p>
                        <p className="font-semibold text-ink">{viewingDoctor.experienceYears} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-ink-soft mb-1">Assigned Patients</p>
                        <p className="font-semibold text-ink">{viewingDoctor.assignedPatients.length}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-ink-soft mb-1">Qualifications</p>
                      <p className="font-semibold text-ink">{viewingDoctor.qualifications}</p>
                    </div>

                    <div>
                      <p className="text-sm text-ink-soft mb-1">Bio</p>
                      <p className="text-ink bg-base rounded-lg p-3">{viewingDoctor.bio}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end mt-6">
                    <Button
                      variant="secondary"
                      onClick={() => setViewingDoctor(null)}
                    >
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleEditClick(viewingDoctor);
                        setViewingDoctor(null);
                      }}
                    >
                      Edit Doctor
                    </Button>
                  </div>
                </CardBody>
              </Card>
              </div>
            </motion.div>
          )}

          {/* Doctor Form Modal */}
          <DoctorForm
            isOpen={formOpen}
            onClose={() => {
              setFormOpen(false);
              setEditingDoctor(null);
            }}
            onSubmit={handleFormSubmit}
            isLoading={formLoading}
            initialData={editingDoctor}
            isEdit={!!editingDoctor}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
