// app/services/customer.ts
import { showToast } from "../components/ui/toast";
import api from "./axios";

/* TYPES */
// app/services/customer.ts
export interface AddCustomerPayload {
  fullName: string;
  gender: string;
  DOB: string;
  phoneNumber: string;
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
  type?: string;
}

export interface UpdateCustomerPayload {
  fullName: string;
  gender: string;
  DOB: string;
  preferredStaff?: string;
  customerTag?: string[];
  customerEligibility?: any;
}

export const customerApi = {
  addCustomer: async (data: AddCustomerPayload) => {
    try {
      const res = await api.post("/customer", data);
      showToast({
        message: res?.data?.message || "Create Customer Successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to create Customer",
        status: "error",
      });
    }
  },

  getCustomers: async (params: GetCustomersParams) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.fullName) query.append("fullName", params.fullName);
    if (params.gender) query.append("gender", params.gender);
    if (params.customerTag?.length)
      query.append("customerTag", params.customerTag.join(","));
    if(params.type) query.append('type', params.type);

    const res = await api.get(`/customer?${query.toString()}`);
    return res.data;
  },
  getCustomerById: async (id: string) => {
    const res = await api.get(`/customer/${id}`);
    return res.data.customerDetails;
  },
  updateCustomer: async (id: string, data: UpdateCustomerPayload) => {
    try {
      const payload: any = { ...data };

      if (
        payload.customerEligibility &&
        typeof payload.customerEligibility === "object" &&
        payload.customerEligibility._id
      ) {
        payload.customerEligibility = payload.customerEligibility._id;
      }

      if (!payload.customerEligibility) {
        delete payload.customerEligibility;
      }

      const res = await api.put(`/customer/${id}`, payload);
      showToast({
        message: res?.data?.message || "Customer updated successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to Update Customer",
        status: "error",
      });
    }
  },
  deleteCustomer: async (id: string) => {
    try {
      const res = await api.delete(`/customer/${id}`);
      showToast({
        message: res?.data?.message || "Customer deleted successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to delete customer",
        status: "error",
      });
    }
  },
};
