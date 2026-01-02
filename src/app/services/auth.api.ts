import api from "./axios";
import { showToast } from "../components/ui/toast";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  address: string;
  password: string;
  phoneNumber: string;
}

export const authApi = {
  login: async (payload: LoginPayload) => {
    try {
      const res = await api.post("/login", payload);
      showToast({
        message: res?.data?.message || "Login Successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      console.log(error)
      showToast({
        message: error?.response?.data?.message || "Login failed",
        status: "error",
      });
      throw error;
    }
  },

  registerOwner: async (payload: RegisterPayload) => {
    try {
      const res = await api.post("/owner", payload);
      showToast({
        message: res?.data?.message || "Registerd successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Registration failed",
        status: "error",
      });
      throw error;
    }
  },
};
