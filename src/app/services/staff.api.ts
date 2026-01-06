import { showToast } from "../components/ui/toast";
import api from "./axios";

/* TYPES */
export interface AddStaffPayload {
    email: string;
    password: string;
    fullName: string;
    commissionRate: number;
    role: string;
    assignedServices: string[];
    workingDays: string[];
    phoneNumber: string;
}

export interface UpdateStaffPayload {
    fullName: string;
    commissionRate: number;
    role: string;
    assignedServices: string[];
    workingDays: string[];
}

export const staffApi = {
    // ADD STAFF
    addStaff: async (data: AddStaffPayload) => {
        try{
        const res = await api.post("/staff", data);
        showToast({
          message: res?.data?.message || "Staff created successfully",
          status: "success"
        })
        return res.data;
        }
        catch(error: any){
            showToast({
                message: error?.response?.data?.message || "Failed to create Staff",
                status: "error"
            })
        }
    },
    getAllStaff: async (params?: {
        page?: number;
        limit?: number;
        role?: string;
        dateOfAppointment?: string;
        timeOfAppointment?: string;
    }) => {
        const res = await api.get("/staff", {
            params,
        });
        return res.data;
    },
    getStaffDetails: async (staffId: string) => {
        const res = await api.get(`/staff/${staffId}`);
        return res.data;
    },
    updateStaff: async (staffId: string, data: UpdateStaffPayload) => {
        try{
        const res = await api.put(`/staff/${staffId}`, data);
        showToast({
          message: res?.data?.message || "Staff updated successfully",
          status: "success"
        })
        return res.data;
        }
         catch(error: any){
            showToast({
                message: error?.response?.data?.message || "Failed to update Staff",
                status: "error"
            })
        }
    },
    deleteStaff: async (staffId: string) => {
        try{
        const res = await api.delete(`/staff/${staffId}`);
        showToast({
          message: res?.data?.message || "Staff deleted successfully",
          status: "success"
        })
        return res.data;
        }
         catch(error: any){
            showToast({
                message: error?.response?.data?.message || "Failed to delete Staff",
                status: "error"
            })
        }
    },

};
