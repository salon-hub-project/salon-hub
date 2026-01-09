import api from "./axios";
import { showToast } from "../components/ui/toast";

/* TYPES */
export interface CreateServicePayload {
  serviceName: string;
  category: string;
  duration: string; // e.g., "45 minutes"
  price: number;
  isActive: boolean;
  markAsPopularService: boolean;
  description?: string;
}

export interface GetServicesParams {
  page?: number;
  limit?: number;
  serviceName?: string;
  category?: string;
  isActive?: boolean;
}

export interface ServiceResponse {
  _id: string;
  serviceName: string;
  category: string;
  duration: string;
  price: number;
  isActive: boolean;
  markAsPopularService: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicesResponse {
  data: ServiceResponse[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

export const serviceApi = {
  // CREATE SERVICE
  createService: async (payload: CreateServicePayload) => {
    try{
    const res = await api.post("/service", payload);
    showToast({
      message: res?.data?.message || "Service created successfully",
      status: "success"
    })
    return res.data;
    }
    catch(error: any){
      showToast({
        message: error?.response?.data?.message || "Failed to update service",
        status: "error" 
      })
    }
  },

  // GET ALL SERVICES
  getAllServices: async (params: GetServicesParams = {}) => {
    try{
    const { page = 1, limit = 10, serviceName, category, isActive } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    
    if (serviceName) {
      queryParams.append("serviceName", serviceName);
    }
    if (category) {
      queryParams.append("category", category);
    }
    if (isActive !== undefined) {
      queryParams.append("isActive", isActive.toString());
    }

    const res = await api.get(`/service?${queryParams.toString()}`);
    return res.data;
  }
  catch(error: any){
    showToast({
      message: error?.response?.data?.message || "Failes to load services",
      status: "error" 
    })
  }
  },
  // UPDATE SERVICE
updateService: async (serviceId: string, payload: Partial<CreateServicePayload>) => {
  try{
     const res = await api.put(`/service/${serviceId}`, payload);
     showToast({
      message: res?.data?.message || "Service updated successfully",
      status: "success"
     })
     return res.data;
  }
  catch(error: any){
     showToast({
      message: error?.response?.data?.message || "Failed to update service",
      status: "error"
     })
  }
 
},

// DELETE SERVICE
deleteService: async (serviceId: string) => {
  try{
  const res = await api.delete(`/service/${serviceId}`);
  showToast({
    message: res?.data?.message || "Service deleted successfully",
    status: "success"
  })
  return res.data;
  }
  catch(error: any){
    showToast({
      message: error?.response?.data?.message || "Failed to delete data",
      status: "error"
    })
  }
},

};









