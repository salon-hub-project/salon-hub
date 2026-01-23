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
    target: number;
    targetType: "Weekly" | "Monthly";
    salary: number;
    breakStartTime: string;   // ✅ added
  breakEndTime: string; 
    staffImage?: string | File ;
}

export interface UpdateStaffPayload {
    fullName: string;
    commissionRate: number;
    role: string;
    assignedServices: string[];
    workingDays: string[];
    target?: number;
    targetType?: "Weekly" | "Monthly";
    salary?: number;
     breakStartTime?: string;  // ✅ added
  breakEndTime?: string;    
    staffImage?: string | File ;
}

export interface AvailableStaffPayload {
    timeOfAppointment: string;
    dateOfAppointment: string;
    services: string[];
    comboOffers: string[];
}

export const staffApi = {
    // ADD STAFF
    addStaff: async (data: FormData) => {
        try{
        const res = await api.post("/staff", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
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
    getAllStaffBreakTime: async (payload: AvailableStaffPayload) => {
        const res = await api.post("/staff/availablestaff", payload);
        return res.data;
    },
    getStaffDetails: async (staffId: string) => {
        const res = await api.get(`/staff/${staffId}`);
        return res.data;
    },
    updateStaff: async (staffId: string, data: FormData) => {
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
    resetAchievedAmount: async (targetType: "Weekly" | "Monthly") => {
        try {
            const res = await api.post("/staff/resetachievedamount", { targetType });
            showToast({
                message: res?.data?.message || `Target reset to 0 for ${targetType} successfully`,
                status: "success"
            });
            return res.data;
        } catch (error: any) {
            showToast({
                message: error?.response?.data?.message || "Failed to reset target",
                status: "error"
            });
        }
    },
    updateStaffStatus: async(staffId: string, isActive: boolean) => {
        try{
            const res= await api.post(`/staff/updateactivestatus/${staffId}`, {isActive});
            showToast({
                message: res?.data?.message || "Status updated",
                status: "success"
            })
            return res.data;
        }catch(error: any){
            showToast({
                message: error?.response?.data?.message || "Failed to update status",
                status: "error"
            })
        }
    }

};
