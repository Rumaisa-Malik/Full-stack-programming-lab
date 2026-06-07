import axiosInstance from './axios';
import { getPatientTreatments } from './doctorService';

export interface PatientProfile {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  age?: number;
  gender?: string;
  contact?: string;
  bloodGroup?: string;
  assignedDoctor?: string;
  medicalHistory?: string[];
}

export interface Appointment {
  _id: string;
  patient: string;
  doctor?: string;
  specialty: string;
  requestedDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
}

export interface Doctor {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  specialty: string;
  qualifications: string;
  experienceYears: number;
  bio: string;
}

export interface BookingData {
  userId: string;
  doctorId: string;
  specialty: string;
  requestedDate: string;
  reason: string;
}

// Get patient's ID from User._id (first step)
async function getPatientIdByUserId(userId: string): Promise<string> {
  try {
    const response = await axiosInstance.get(`/patients/by-user/${userId}`);
    return response.data._id;
  } catch (error) {
    console.error('Failed to fetch patient ID:', error);
    throw error;
  }
}

// Get logged-in patient's profile by User ID
export async function getPatientData(userId: string) {
  try {
    const response = await axiosInstance.get(`/patients/by-user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch patient data:', error);
    throw error;
  }
}

// Get patient's appointments
export async function getPatientAppointments(userId: string) {
  try {
    const patientId = await getPatientIdByUserId(userId);
    const response = await axiosInstance.get(`/appointments/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch patient appointments:', error);
    throw error;
  }
}

// Get doctors filtered by specialty
export async function getDoctorsBySpecialty(specialty: string) {
  try {
    const response = await axiosInstance.get(`/doctors/specialty/${specialty}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch doctors by specialty:', error);
    throw error;
  }
}

// Book an appointment (POST to DB)
export async function bookAppointment(appointmentData: BookingData) {
  try {
    console.log('[BookAppointment] Starting with userId:', appointmentData.userId);

    const patientId = await getPatientIdByUserId(appointmentData.userId);
    console.log('[BookAppointment] Resolved patientId:', patientId);

    // Capitalize specialty (e.g., 'cardiology' -> 'Cardiology')
    const capitalizedSpecialty =
      appointmentData.specialty.charAt(0).toUpperCase() +
      appointmentData.specialty.slice(1);

    const payload = {
      patientId,
      doctor: appointmentData.doctorId,
      specialty: capitalizedSpecialty,
      requestedDate: appointmentData.requestedDate,
      reason: appointmentData.reason,
    };
    console.log('[BookAppointment] Posting payload:', payload);

    const response = await axiosInstance.post('/appointments', payload);
    console.log('[BookAppointment] Success response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[BookAppointment] Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
}

// Get patient's treatments (reuse doctorService)
export async function getPatientTreatmentsData(userId: string) {
  try {
    const patientId = await getPatientIdByUserId(userId);
    return await getPatientTreatments(patientId);
  } catch (error) {
    console.error('Failed to fetch patient treatments:', error);
    throw error;
  }
}

// Get patient's prescriptions
export async function getPatientPrescriptions(userId: string) {
  try {
    const patientId = await getPatientIdByUserId(userId);
    const response = await axiosInstance.get(`/prescriptions/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch patient prescriptions:', error);
    throw error;
  }
}
