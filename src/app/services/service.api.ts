import api from "./axios";

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
    const res = await api.post("/service", payload);
    return res.data;
  },

  // GET ALL SERVICES
  getAllServices: async (params: GetServicesParams = {}) => {
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
  },
  // UPDATE SERVICE
updateService: async (serviceId: string, payload: Partial<CreateServicePayload>) => {
  const res = await api.put(`/service/${serviceId}`, payload);
  return res.data;
},

// DELETE SERVICE
deleteService: async (serviceId: string) => {
  const res = await api.delete(`/service/${serviceId}`);
  return res.data;
},

};





