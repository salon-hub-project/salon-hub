import api from "./axios";
import { showToast } from "../components/ui/toast";

export interface CreateAppointmentPayload {
  customerId: string;
  services: string[];
  staffId: string;
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
        message: error?.response?.data?.message || "Failed to create appointment",
        status: "error",
      });
      throw error;
    }
  },
  getAllAppointments: async (params?: { page?: number; limit?: number }) => {
    try {
      const res = await api.get("/appointment", { params });
      return res.data;
    } catch (error: any) {
      console.error("Failed to fetch appointments", error);
      throw error;
    }
  },
  getStaffAppointments: async (staffId: string) => {
    try {
      const res = await api.get(`/staff/appointments/${staffId}`);
      return res.data;
    } catch (error: any) {
      console.error("Failed to fetch staff appointments", error);
      throw error;
    }
  },
};
