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

export const staffApi = {
    // ADD STAFF
    addStaff: async (data: AddStaffPayload) => {
        const res = await api.post("/staff", data);
        return res.data;
    },
    getAllStaff: async (params?: {
        page?: number;
        limit?: number;
        role?: string;
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
    deleteStaff: async (staffId: string) => {
        const res = await api.delete(`/staff/${staffId}`);
        return res.data;
    },

};
