import api from "./axios";
import { showToast } from "../components/ui/toast";

interface CreateCustomerTagPayload {
  name: string;
}

export const customerTagApi = {
  getAllCustomerTags: async () => {
    try {
      const res = await api.get("/customerRole");
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.message,
        status: "error",
      });
    }
  },

  createCustomerTag: async (payload: CreateCustomerTagPayload) => {
    try {
      const res = await api.post("/customerRole", payload);
      showToast({
        message: res?.data.message || "Customer Tag created successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.message,
        status: "error",
      });
    }
  },

  updateCustomerTag: async (
    customerTagId: string,
    payload: CreateCustomerTagPayload
  ) => {
    try {
      const res = await api.put(`/customerRole/${customerTagId}`, payload);
      showToast({
        message: res?.data.message || "Customer Tag updated successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.message,
        status: "error",
      });
    }
  },

  deleteCustomerTag: async (customerTagId: string) => {
    try {
      const res = await api.delete(`/customerRole/${customerTagId}`);
      showToast({
        message: res?.data.message || "Customer Tag deleted successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.message,
        status: "error",
      });
    }
  },
};
