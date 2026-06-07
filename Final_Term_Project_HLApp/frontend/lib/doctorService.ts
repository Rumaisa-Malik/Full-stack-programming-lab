import axiosInstance from './axios';

// Extract doctor info from JWT token
export function getDoctorFromToken() {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

// Get doctor's ID from User._id (first step)
export async function getDoctorIdByUserId(userId: string): Promise<string> {
  try {
    const response = await axiosInstance.get(`/doctors/by-user/${userId}`);
    return response.data._id;
  } catch (error) {
    console.error('Failed to fetch doctor ID:', error);
    throw error;
  }
}

// Appointments
export async function getDoctorAppointments(userId: string) {
  try {
    const doctorId = await getDoctorIdByUserId(userId);
    const response = await axiosInstance.get(`/appointments/doctor/${doctorId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    throw error;
  }
}

export async function getTodayAppointments(doctorId: string) {
  try {
    const appointments = await getDoctorAppointments(doctorId);
    const today = new Date().toDateString();
    return appointments.filter((apt: any) =>
      new Date(apt.requestedDate).toDateString() === today && apt.status === 'approved'
    );
  } catch (error) {
    console.error('Failed to fetch today appointments:', error);
    throw error;
  }
}

export async function getAppointmentById(appointmentId: string) {
  try {
    const response = await axiosInstance.get(`/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch appointment:', error);
    throw error;
  }
}

export async function updateAppointmentStatus(appointmentId: string, status: 'approved' | 'rejected' | 'pending' | 'completed', userId: string) {
  try {
    const doctorId = await getDoctorIdByUserId(userId);
    const response = await axiosInstance.patch(`/appointments/${appointmentId}/status`, {
      status,
      doctorId
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update appointment status:', error);
    throw error;
  }
}

export async function rescheduleAppointment(appointmentId: string, newDate: string) {
  try {
    const response = await axiosInstance.patch(`/appointments/${appointmentId}`, { appointmentDate: newDate });
    return response.data;
  } catch (error) {
    console.error('Failed to reschedule appointment:', error);
    throw error;
  }
}

// Patients
export async function getDoctorPatients(userId: string) {
  try {
    const doctorId = await getDoctorIdByUserId(userId);
    const response = await axiosInstance.get(`/doctors/${doctorId}/patients`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    throw error;
  }
}

export async function getPatientById(patientId: string) {
  try {
    const response = await axiosInstance.get(`/patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch patient:', error);
    throw error;
  }
}

export async function updatePatient(patientId: string, data: any) {
  try {
    const response = await axiosInstance.patch(`/patients/${patientId}`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update patient:', error);
    throw error;
  }
}

// Treatments
export async function getPatientTreatments(patientId: string) {
  try {
    const response = await axiosInstance.get(`/treatments/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch treatments:', error);
    throw error;
  }
}

export async function getDoctorPatientTreatments(doctorId: string, patientId: string) {
  try {
    const response = await axiosInstance.get(`/treatments/doctor/${doctorId}/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch doctor patient treatments:', error);
    throw error;
  }
}

export async function getDoctorTreatmentStats(doctorId: string) {
  try {
    const appointments = await getDoctorAppointments(doctorId);
    const treatments = await axiosInstance.get('/treatments');

    // Filter treatments for this doctor's patients
    const doctorTreatments = treatments.data.filter((t: any) =>
      t.doctor === doctorId || t.doctorId === doctorId
    );

    return {
      activeCount: doctorTreatments.filter((t: any) => t.status === 'active').length,
      pendingReviews: appointments.filter((a: any) => a.status === 'pending').length,
      totalPatients: new Set(appointments.map((a: any) => a.patient)).size,
    };
  } catch (error) {
    console.error('Failed to fetch treatment stats:', error);
    throw error;
  }
}

export async function updateTreatmentStatus(treatmentId: string, status: string) {
  try {
    const response = await axiosInstance.patch(`/treatments/${treatmentId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Failed to update treatment status:', error);
    throw error;
  }
}

export async function addVisitToTreatment(treatmentId: string, visitData: any) {
  try {
    const response = await axiosInstance.post(`/treatments/${treatmentId}/visit`, visitData);
    return response.data;
  } catch (error) {
    console.error('Failed to add visit:', error);
    throw error;
  }
}

export async function scheduleFollowUp(treatmentId: string, followUpData: any) {
  try {
    const response = await axiosInstance.post(`/treatments/${treatmentId}/followup`, followUpData);
    return response.data;
  } catch (error) {
    console.error('Failed to schedule follow-up:', error);
    throw error;
  }
}

// Prescriptions
export async function createPrescription(prescriptionData: any) {
  try {
    const response = await axiosInstance.post('/prescriptions', prescriptionData);
    return response.data;
  } catch (error) {
    console.error('Failed to create prescription:', error);
    throw error;
  }
}

export async function getPatientPrescriptions(patientId: string) {
  try {
    const response = await axiosInstance.get(`/prescriptions/patient/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch prescriptions:', error);
    throw error;
  }
}

export async function getTreatmentPrescriptions(treatmentId: string) {
  try {
    const response = await axiosInstance.get(`/prescriptions/treatment/${treatmentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch treatment prescriptions:', error);
    throw error;
  }
}
