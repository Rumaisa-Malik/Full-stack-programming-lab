'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, useToast } from '@/components/ui';

interface DoctorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  initialData?: any;
  isEdit?: boolean;
}

const SPECIALTIES = ['Cardiology', 'Neurology', 'Orthopedics', 'Dentistry', 'Pulmonology', 'Gastroenterology'];

export function DoctorForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialData,
  isEdit = false,
}: DoctorFormProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: 'Cardiology',
    qualifications: '',
    experienceYears: '1',
    bio: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.userId?.name || '',
        email: initialData.userId?.email || '',
        password: '', // Never pre-fill password
        specialty: initialData.specialty || 'Cardiology',
        qualifications: initialData.qualifications || '',
        experienceYears: initialData.experienceYears?.toString() || '1',
        bio: initialData.bio || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        specialty: 'Cardiology',
        qualifications: '',
        experienceYears: '1',
        bio: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!isEdit && !formData.password) newErrors.password = 'Password is required';
    else if (!isEdit && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!formData.specialty) newErrors.specialty = 'Specialty is required';
    if (!formData.qualifications.trim()) newErrors.qualifications = 'Qualifications are required';
    if (!formData.experienceYears) newErrors.experienceYears = 'Experience is required';
    else if (parseInt(formData.experienceYears) < 0) newErrors.experienceYears = 'Experience must be 0 or more';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const dataToSubmit = isEdit
        ? { ...formData, password: formData.password || undefined }
        : formData;

      // Remove empty password for edit
      if (isEdit && !dataToSubmit.password) {
        delete dataToSubmit.password;
      }

      await onSubmit(dataToSubmit);
      onClose();
    } catch (error: any) {
      addToast(error.response?.data?.error || 'An error occurred', 'error');
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <motion.div
              className="glass rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-ink mb-6">
                {isEdit ? 'Edit Doctor' : 'Add Doctor'}
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <Input
                    label="Full Name"
                    placeholder="Dr. John Doe"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    disabled={isLoading}
                    error={errors.name}
                  />
                  {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <Input
                    label="Email"
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    disabled={isLoading}
                    error={errors.email}
                  />
                  {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <Input
                    label={isEdit ? 'Password (leave blank to keep current)' : 'Password'}
                    type="password"
                    placeholder={isEdit ? '••••••' : 'Secure password (min 6 chars)'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    disabled={isLoading}
                    error={errors.password}
                  />
                  {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
                </div>

                {/* Specialty */}
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-2">Specialty</label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => handleChange('specialty', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {SPECIALTIES.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                  {errors.specialty && <p className="text-xs text-danger mt-1">{errors.specialty}</p>}
                </div>

                {/* Qualifications */}
                <div>
                  <Input
                    label="Qualifications"
                    placeholder="e.g. MD, Board Certified"
                    value={formData.qualifications}
                    onChange={(e) => handleChange('qualifications', e.target.value)}
                    disabled={isLoading}
                    error={errors.qualifications}
                  />
                  {errors.qualifications && <p className="text-xs text-danger mt-1">{errors.qualifications}</p>}
                </div>

                {/* Experience Years */}
                <div>
                  <Input
                    label="Years of Experience"
                    type="number"
                    min="0"
                    max="70"
                    value={formData.experienceYears}
                    onChange={(e) => handleChange('experienceYears', e.target.value)}
                    disabled={isLoading}
                    error={errors.experienceYears}
                  />
                  {errors.experienceYears && <p className="text-xs text-danger mt-1">{errors.experienceYears}</p>}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-2">Professional Bio</label>
                  <textarea
                    placeholder="Brief professional background..."
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    disabled={isLoading}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  />
                  {errors.bio && <p className="text-xs text-danger mt-1">{errors.bio}</p>}
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-8">
                <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (isEdit ? 'Updating...' : 'Adding...') : isEdit ? 'Update Doctor' : 'Add Doctor'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
