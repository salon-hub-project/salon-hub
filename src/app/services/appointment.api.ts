import api from "./axios";
import { showToast } from "../components/ui/toast";

export interface CreateAppointmentPayload {
  customerId: string;
  services: string[];
  staffId: string;
  comboOffers?: string[];
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm
  notes?: string;
}

export const appointmentApi = {
  createAppointment: async (payload: CreateAppointmentPayload) => {
    try {
      const res = await api.post("/appointment", payload);
      showToast({
        message: res?.data?.message || "Appointment created successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.message || "Failed to create appointment",
        status: "error",
      });
      throw error;
    }
  },
  getAllAppointments: async (params?: { page?: number; limit?: number }) => {
    try {
      const res = await api.get("/appointment", { params });
      // Ensure we ALWAYS return an array
      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (error) {
      console.error("Failed to fetch appointments", error);
      throw error;
    }
  },
  // getStaffAppointments: async (params?: {
  //   page?: number;
  //   limit?: number;
  //   staffId?: string;
  // }) => {
  //   try {
  //     const { staffId, ...rest } = params || {};
  //     const url = staffId
  //       ? `/staff/appointments/${staffId}`
  //       : "/staff/appointments";

  //     const res = await api.get(url, { params: rest });
  //     // Ensure we ALWAYS return an array
  //     return Array.isArray(res.data?.appointmentDetails)
  //       ? res.data.appointmentDetails
  //       : [];
  //   } catch (error) {
  //     console.error("Failed to fetch appointments", error);
  //     throw error;
  //   }
  // },
  getStaffAppointments: async (params?: {
    page?: number;
    limit?: number;
    staffId?: string;
    role?: "OWNER" | "STAFF";
  }) => {
    try {
      const { staffId, role, ...rest } = params || {};
  
      // 🔑 ROLE BASED API SELECTION
      const url =
        role === "STAFF"
          ? "/staff/appointments" // staff logged in (JWT based)
          : staffId
          ? `/staff/appointments/${staffId}` // owner viewing staff appointments
          : "/staff/appointments";
  
      const res = await api.get(url, { params: rest });
  
      return Array.isArray(res.data?.appointmentDetails)
        ? res.data.appointmentDetails
        : [];
    } catch (error) {
      console.error("Failed to fetch staff appointments", error);
      throw error;
    }
  },
  
  getAppointmentDetails: async (appointmentId: string) => {
    try {
      const res = await api.get(`/appointment/${appointmentId}`);
      return res.data?.data;
    } catch (error: any) {
      console.error("Failed to fetch appointment details:", error);
      throw error;
    }
  },
  updateAppointmentStatus: async (appointmentId: string) => {
    try {
      const res = await api.put(`/appointment/${appointmentId}`, {
        status: "Completed",
      });
      showToast({
        message: res?.data?.message || "Service Completed",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to update appointment status",
        status: "error",
      });
      console.error("Failed to update appointment status:", error);
      throw error;
    }
  },
};
