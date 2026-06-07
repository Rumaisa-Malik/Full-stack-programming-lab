'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { useAuth } from '@/lib/AuthContext';
import { SpecialtyCard } from '@/components/SpecialtyCard';
import { Button, Card, CardHeader, CardBody, Input, Badge, AlertDialog, useToast, Loader, EmptyState } from '@/components/ui';
import {
  getDoctorsBySpecialty,
  bookAppointment,
} from '@/lib/patientService';

type SpecialtyName = 'dentistry' | 'orthopedics' | 'cardiology' | 'neurology' | 'pulmonology' | 'gastroenterology';

type BookingStep = 'specialty' | 'doctor' | 'datetime' | 'confirm';

const specialties = [
  { name: 'dentistry' as SpecialtyName, label: 'Dentistry' },
  { name: 'orthopedics' as SpecialtyName, label: 'Orthopedics' },
  { name: 'cardiology' as SpecialtyName, label: 'Cardiology' },
  { name: 'neurology' as SpecialtyName, label: 'Neurology' },
  { name: 'pulmonology' as SpecialtyName, label: 'Pulmonology' },
  { name: 'gastroenterology' as SpecialtyName, label: 'Gastroenterology' },
];

interface Doctor {
  _id: string;
  userId: {
    name: string;
  };
  specialty: string;
}

export default function BookAppointmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const [step, setStep] = useState<BookingStep>('specialty');
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyName | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [reason, setReason] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Fetch doctors when specialty is selected
  useEffect(() => {
    if (!selectedSpecialty) return;

    let isMounted = true;

    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        // Capitalize specialty for API call (e.g., 'cardiology' -> 'Cardiology')
        const capitalizedSpecialty =
          selectedSpecialty.charAt(0).toUpperCase() + selectedSpecialty.slice(1);
        const data = await getDoctorsBySpecialty(capitalizedSpecialty);

        if (!isMounted) return;
        setDoctors(data);

        if (data.length === 0) {
          addToast('No doctors available for this specialty', 'warning');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch doctors:', error);
          addToast('Failed to load doctors', 'error');
          setDoctors([]);
        }
      } finally {
        if (isMounted) {
          setLoadingDoctors(false);
        }
      }
    };

    fetchDoctors();
    return () => {
      isMounted = false;
    };
  }, [selectedSpecialty, addToast]);

  const handleSpecialtySelect = (specialty: SpecialtyName) => {
    setSelectedSpecialty(specialty);
    setSelectedDoctorId(null);
    setStep('doctor');
  };

  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setStep('datetime');
  };

  const handleBack = () => {
    if (step === 'confirm') {
      setStep('datetime');
    } else if (step === 'datetime') {
      setSelectedDoctorId(null);
      setStep('doctor');
    } else if (step === 'doctor') {
      setSelectedSpecialty(null);
      setStep('specialty');
    }
  };

  const handleConfirmBooking = async () => {
    if (!user || !selectedSpecialty || !selectedDoctorId || !appointmentDate || !reason) {
      addToast('Please fill in all fields', 'error');
      return;
    }

    try {
      setIsBookingLoading(true);

      // Post the appointment to the database
      await bookAppointment({
        userId: user.id,
        doctorId: selectedDoctorId!,
        specialty: selectedSpecialty,
        requestedDate: appointmentDate,
        reason,
      });

      addToast('✓ Appointment booked successfully!', 'success');
      setIsConfirmDialogOpen(false);

      // Reset form
      setStep('specialty');
      setSelectedSpecialty(null);
      setSelectedDoctorId(null);
      setAppointmentDate('');
      setReason('');

      // Redirect to patient dashboard
      setTimeout(() => {
        router.push('/patient/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Failed to book appointment:', error);
      addToast('Failed to book appointment. Please try again.', 'error');
    } finally {
      setIsBookingLoading(false);
    }
  };

  const isStepValid = {
    specialty: selectedSpecialty !== null,
    doctor: selectedDoctorId !== null,
    datetime: appointmentDate !== '' && reason !== '',
    confirm: true,
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const selectedDoctor = doctors.find((d) => d._id === selectedDoctorId);
  const selectedSpecialtyLabel = specialties.find((s) => s.name === selectedSpecialty)?.label;

  return (
    <ProtectedRoute requiredRoles={['patient']}>
      <div className="min-h-screen bg-base py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb / Progress */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-ink mb-2">Book an Appointment</h1>
            <p className="text-ink-soft mb-6">Follow the guided diagnostic path to schedule your visit</p>

            {/* Progress indicator */}
            <div className="flex items-center gap-2">
              {(['specialty', 'doctor', 'datetime', 'confirm'] as const).map((s, idx) => (
                <motion.div key={s} className="flex items-center">
                  <motion.div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold
                      ${step === s ? 'bg-accent text-white ring-2 ring-accent ring-offset-2' : ''}
                      ${(['specialty', 'doctor', 'datetime', 'confirm'].indexOf(step) > idx) ? 'bg-success text-white' : 'bg-line text-ink-soft'}
                    `}
                    initial={false}
                    animate={{ scale: step === s ? 1.1 : 1 }}
                  >
                    {idx + 1}
                  </motion.div>
                  {idx < 3 && (
                    <motion.div
                      className="w-12 h-1 mx-1 rounded-full bg-line"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: (['specialty', 'doctor', 'datetime', 'confirm'].indexOf(step) > idx) ? 1 : 0 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Step 1: Specialty Selection */}
          {step === 'specialty' && (
            <motion.div
              key="specialty"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Card variant="glass">
                <CardHeader title="Step 1: Select Your Specialty" subtitle="Choose the medical specialty you need" />
                <CardBody>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {specialties.map((specialty) => (
                      <SpecialtyCard
                        key={specialty.name}
                        name={specialty.name}
                        label={specialty.label}
                        selected={selectedSpecialty === specialty.name}
                        onSelect={handleSpecialtySelect}
                      />
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <Button
                      variant="primary"
                      disabled={!isStepValid.specialty}
                      onClick={() => setStep('doctor')}
                    >
                      Continue
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Doctor Selection */}
          {step === 'doctor' && selectedSpecialty && (
            <motion.div
              key="doctor"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Card variant="glass">
                <CardHeader
                  title="Step 2: Choose Your Doctor"
                  subtitle={`Available ${selectedSpecialtyLabel} specialists`}
                />
                <CardBody>
                  {loadingDoctors ? (
                    <div className="py-8 text-center">
                      <Loader variant="heartbeat" size="md" />
                    </div>
                  ) : doctors.length === 0 ? (
                    <EmptyState
                      icon="👨‍⚕️"
                      title="No doctors available"
                      description={`No ${selectedSpecialtyLabel} specialists are currently available. Please try another specialty.`}
                    />
                  ) : (
                    <>
                      <div className="space-y-3 mb-8">
                        {doctors.map((doctor) => (
                          <motion.button
                            key={doctor._id}
                            onClick={() => handleDoctorSelect(doctor._id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                              w-full p-4 rounded-lg text-left transition-all
                              ${
                                selectedDoctorId === doctor._id
                                  ? 'bg-accent text-white ring-2 ring-accent ring-offset-2'
                                  : 'glass hover:bg-accent-soft'
                              }
                            `}
                          >
                            <p className="font-semibold">{doctor.userId.name}</p>
                            <p className={`text-sm ${selectedDoctorId === doctor._id ? 'text-white/80' : 'text-ink-soft'}`}>
                              {selectedSpecialtyLabel} Specialist
                            </p>
                          </motion.button>
                        ))}
                      </div>
                      <div className="flex gap-3 justify-between">
                        <Button variant="secondary" onClick={handleBack}>
                          Back
                        </Button>
                        <Button
                          variant="primary"
                          disabled={!isStepValid.doctor}
                          onClick={() => setStep('datetime')}
                        >
                          Continue
                        </Button>
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Date & Time */}
          {step === 'datetime' && selectedSpecialty && selectedDoctorId && (
            <motion.div
              key="datetime"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Card variant="glass">
                <CardHeader
                  title="Step 3: Select Date & Time"
                  subtitle="Choose your preferred appointment slot"
                />
                <CardBody>
                  <Input
                    label="Preferred Date & Time"
                    type="datetime-local"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                  />
                  <Input
                    label="Reason for Visit"
                    placeholder="Describe your symptoms or reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                  <div className="mt-8 flex gap-3 justify-between">
                    <Button variant="secondary" onClick={handleBack}>
                      Back
                    </Button>
                    <Button
                      variant="primary"
                      disabled={!isStepValid.datetime}
                      onClick={() => setStep('confirm')}
                    >
                      Review
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {step === 'confirm' && selectedSpecialty && selectedDoctorId && selectedDoctor && (
            <motion.div
              key="confirm"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Card variant="glass">
                <CardHeader title="Step 4: Confirm Your Appointment" subtitle="Review your booking details" />
                <CardBody>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center p-4 bg-base rounded-lg">
                      <span className="text-ink-soft">Specialty:</span>
                      <Badge variant="info">{selectedSpecialtyLabel}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-base rounded-lg">
                      <span className="text-ink-soft">Doctor:</span>
                      <span className="font-semibold text-ink">{selectedDoctor.userId.name}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-base rounded-lg">
                      <span className="text-ink-soft">Date & Time:</span>
                      <span className="font-semibold text-ink">
                        {new Date(appointmentDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-base rounded-lg">
                      <span className="text-ink-soft">Reason:</span>
                      <span className="font-semibold text-ink text-right max-w-xs">{reason}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-between">
                    <Button variant="secondary" onClick={handleBack}>
                      Back
                    </Button>
                    <Button variant="primary" onClick={() => setIsConfirmDialogOpen(true)}>
                      Confirm & Book
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}

          {/* Confirmation Dialog */}
          <AlertDialog
            isOpen={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={handleConfirmBooking}
            title="Confirm Your Appointment"
            description="Please review your details. You'll receive a confirmation email and SMS reminder."
            confirmText="Book Appointment"
            cancelText="Go Back"
            isLoading={isBookingLoading}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
