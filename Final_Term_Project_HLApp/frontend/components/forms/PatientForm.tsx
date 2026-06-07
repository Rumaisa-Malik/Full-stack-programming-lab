'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, useToast } from '@/components/ui';

interface PatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  initialData?: any;
  isEdit?: boolean;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', 'Other'];

export function PatientForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialData,
  isEdit = false,
}: PatientFormProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'Male',
    contact: '',
    bloodGroup: 'O+',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.userId?.name || '',
        email: initialData.userId?.email || '',
        password: '', // Never pre-fill password
        age: initialData.age?.toString() || '',
        gender: initialData.gender || 'Male',
        contact: initialData.contact || '',
        bloodGroup: initialData.bloodGroup || 'O+',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        age: '',
        gender: 'Male',
        contact: '',
        bloodGroup: 'O+',
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

    if (!formData.age) newErrors.age = 'Age is required';
    else if (parseInt(formData.age) < 0 || parseInt(formData.age) > 150) newErrors.age = 'Enter a valid age';

    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact is required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';

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
                {isEdit ? 'Edit Patient' : 'Add Patient'}
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <Input
                    label="Full Name"
                    placeholder="John Smith"
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
                    placeholder="patient@example.com"
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

                {/* Age */}
                <div>
                  <Input
                    label="Age"
                    type="number"
                    min="0"
                    max="150"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    disabled={isLoading}
                    error={errors.age}
                  />
                  {errors.age && <p className="text-xs text-danger mt-1">{errors.age}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  {errors.gender && <p className="text-xs text-danger mt-1">{errors.gender}</p>}
                </div>

                {/* Contact */}
                <div>
                  <Input
                    label="Contact Number"
                    placeholder="123-456-7890"
                    value={formData.contact}
                    onChange={(e) => handleChange('contact', e.target.value)}
                    disabled={isLoading}
                    error={errors.contact}
                  />
                  {errors.contact && <p className="text-xs text-danger mt-1">{errors.contact}</p>}
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium text-ink-soft mb-2">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => handleChange('bloodGroup', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-4 py-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                  {errors.bloodGroup && <p className="text-xs text-danger mt-1">{errors.bloodGroup}</p>}
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
                  {isLoading ? (isEdit ? 'Updating...' : 'Adding...') : isEdit ? 'Update Patient' : 'Add Patient'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
