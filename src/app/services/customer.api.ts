// app/services/customer.ts
import api from "./axios";

/* TYPES */
// app/services/customer.ts
export interface AddCustomerPayload {
  fullName: string;
  gender: string;
  DOB: string;
  phoneNumber: string;
  password: string;
  preferredStaff?: string;
  customerTag?: string[];
  email?: string;
  address?: string;
  notes?: string;
}

export interface GetCustomersParams {
  page?: number;
  limit?: number;
  fullName?: string;
  customerTag?: string[];
  gender?: string;
}

export const customerApi = {
  addCustomer: async (data: AddCustomerPayload) => {
    const res = await api.post("/customer", data);
    return res.data;
  },
    getCustomers: async (params: GetCustomersParams) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.fullName) query.append("fullName", params.fullName);
    if (params.gender) query.append("gender", params.gender);
    if (params.customerTag?.length) query.append("customerTag", params.customerTag.join(","));

    const res = await api.get(`/customer?${query.toString()}`);
    return res.data;
  },
   getCustomerById: async (id: string) => {
    const res = await api.get(`/customer/${id}`);
    return res.data.customerDetails; 
  },
};
