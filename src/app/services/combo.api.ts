import api from "./axios";
import { showToast } from "../components/ui/toast";

export interface CreateComboPayload {
  name: string;
  description: string;
  services: string[]; 
  validFrom: string; 
  validTill: string; 
  actualPrice: number;
  discountedPrice: number;
  savedAmount: number;
  savedPercent: number;
  customerEligibility?: string;
  staffCommissionRate: number | null;
  
}


export const comboApi = {
  createComboOffer: async (payload: CreateComboPayload) => {
    try {
      const res = await api.post("/combooffer", payload);
      showToast({
        message: res?.data?.message || "Combo offer created successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to create combo offer",
        status: "error",
      });
      throw error;
    }
  },

  getAllComboOffers: async (params?: { page?: number; limit?: number }) => {
    try {
      const res = await api.get("/combooffer", { params });
      return res.data;
    } catch (error: any) {
      console.error("Failed to fetch combo offers", error);
      throw error;
    }
  },

  getAppointmentCombo: async(params?: {page?:number; limit?:number; appointmentDate: string})=> {
     try{
      const res = await api.post("/combooffer/active",{}, {params});
      console.log(res.data);
      return res.data
     } catch(error: any) {
      console.error("Failed to fetch Combos", error);
      throw error;
     }
   },

  updateComboOffer: async (id: string, payload: CreateComboPayload) => {
    try {
      const res = await api.put(`/combooffer/${id}`, payload);
      showToast({
        message: res?.data?.message || "Combo offer updated successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to update combo offer",
        status: "error",
      });
      throw error;
    }
  },

  deleteComboOffer: async (id: string) => {
    try {
      const res = await api.delete(`/combooffer/${id}`);
      showToast({
        message: res?.data?.message || "Combo offer deleted successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to delete combo offer",
        status: "error",
      });
      throw error;
    }
  },

  getComboOfferById: async (id: string) => {
    try {
      const res = await api.get(`/combooffer/${id}`);
      console.log(res.data)
      return res.data;
    } catch (error: any) {
      console.error("Failed to fetch combo details", error);
      throw error;
    }
  },

  sendComboMessage: async (comboId: string, numbers: string[]) => {
    try {
      const res = await api.post(`/customer/sendmsg?comboId=${comboId}`, {
        numbers,
      });
      showToast({
        message: res?.data?.message || "Messages sent successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to send messages",
        status: "error",
      });
      throw error;
    }
  },
};
