import axiosInstance from './axios';

export interface DashboardStats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  pendingAppointments: number;
  specialtyDistribution: SpecialtyStats[];
}

export interface SpecialtyStats {
  specialty: string;
  doctors: number;
  patients: number;
}

// Get all dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [doctors, patients, appointments] = await Promise.all([
      axiosInstance.get('/doctors'),
      axiosInstance.get('/patients'),
      axiosInstance.get('/appointments'),
    ]);

    const totalDoctors = doctors.data.length;
    const totalPatients = patients.data.length;
    const totalUsers = totalDoctors + totalPatients; // Admin, doctors, patients
    const pendingCount = (appointments.data || []).filter(
      (apt: any) => apt.status === 'pending'
    ).length;

    // Compute specialty distribution from real data
    const specialtyMap: { [key: string]: { doctors: Set<string>; patients: Set<string> } } = {};

    // Count doctors by specialty
    (doctors.data || []).forEach((doctor: any) => {
      if (!specialtyMap[doctor.specialty]) {
        specialtyMap[doctor.specialty] = { doctors: new Set(), patients: new Set() };
      }
      specialtyMap[doctor.specialty].doctors.add(doctor._id);
    });

    // Count patients by specialty (via assigned doctor)
    (patients.data || []).forEach((patient: any) => {
      if (patient.assignedDoctor) {
        const doctor = doctors.data.find((d: any) => d._id === patient.assignedDoctor);
        if (doctor) {
          specialtyMap[doctor.specialty].patients.add(patient._id);
        }
      }
    });

    const specialtyDistribution: SpecialtyStats[] = Object.entries(specialtyMap).map(
      ([specialty, data]) => ({
        specialty,
        doctors: data.doctors.size,
        patients: data.patients.size,
      })
    );

    return {
      totalUsers,
      totalDoctors,
      totalPatients,
      pendingAppointments: pendingCount,
      specialtyDistribution,
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    throw error;
  }
}

// Get all doctors
export async function getAllDoctors() {
  try {
    const response = await axiosInstance.get('/doctors');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
    throw error;
  }
}

// Get single doctor
export async function getDoctor(doctorId: string) {
  try {
    const response = await axiosInstance.get(`/doctors/${doctorId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch doctor:', error);
    throw error;
  }
}

// Get all patients
export async function getAllPatients() {
  try {
    const response = await axiosInstance.get('/patients');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    throw error;
  }
}

// Get single patient
export async function getPatient(patientId: string) {
  try {
    const response = await axiosInstance.get(`/patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch patient:', error);
    throw error;
  }
}

// Create doctor (with User creation)
export async function createDoctor(doctorData: any) {
  try {
    const response = await axiosInstance.post('/doctors', {
      name: doctorData.name,
      email: doctorData.email,
      password: doctorData.password,
      specialty: doctorData.specialty,
      qualifications: doctorData.qualifications,
      experienceYears: doctorData.experienceYears,
      bio: doctorData.bio,
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to create doctor:', error);
    throw error;
  }
}

// Update doctor
export async function updateDoctor(doctorId: string, doctorData: any) {
  try {
    const response = await axiosInstance.patch(`/doctors/${doctorId}`, doctorData);
    return response.data;
  } catch (error) {
    console.error('Failed to update doctor:', error);
    throw error;
  }
}

// Delete doctor
export async function deleteDoctor(doctorId: string) {
  try {
    const response = await axiosInstance.delete(`/doctors/${doctorId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete doctor:', error);
    throw error;
  }
}

// Create patient (with User creation)
export async function createPatient(patientData: any) {
  try {
    const response = await axiosInstance.post('/patients', {
      name: patientData.name,
      email: patientData.email,
      password: patientData.password,
      age: patientData.age,
      gender: patientData.gender,
      contact: patientData.contact,
      bloodGroup: patientData.bloodGroup,
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to create patient:', error);
    throw error;
  }
}

// Update patient
export async function updatePatient(patientId: string, patientData: any) {
  try {
    const response = await axiosInstance.patch(`/patients/${patientId}`, patientData);
    return response.data;
  } catch (error) {
    console.error('Failed to update patient:', error);
    throw error;
  }
}

// Delete patient
export async function deletePatient(patientId: string) {
  try {
    const response = await axiosInstance.delete(`/patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete patient:', error);
    throw error;
  }
}

// Assign doctor to patient
export async function assignDoctorToPatient(patientId: string, doctorId: string) {
  try {
    const response = await axiosInstance.post('/patients/assign-doctor', {
      patientId,
      doctorId,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to assign doctor:', error);
    throw error;
  }
}

// Get all appointments
export async function getAllAppointments() {
  try {
    const response = await axiosInstance.get('/appointments');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    throw error;
  }
}

// Update appointment status
export async function updateAppointmentStatus(appointmentId: string, status: string, doctorId?: string) {
  try {
    const response = await axiosInstance.patch(`/appointments/${appointmentId}/status`, {
      status,
      doctorId,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update appointment status:', error);
    throw error;
  }
}

// Delete appointment
export async function deleteAppointment(appointmentId: string) {
  try {
    const response = await axiosInstance.delete(`/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete appointment:', error);
    throw error;
  }
}
