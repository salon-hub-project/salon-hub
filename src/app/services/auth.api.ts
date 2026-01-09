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

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
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
      let message = error?.response?.data?.message || "Login failed";
      if (error?.response?.status === 403) {
        message =
          "Your account is not approved yet. Please contact the super admin.";
      }
      showToast({
        message,
        status: "error",
      });
      throw message;
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
        message: error?.response?.data?.errors || "Registration failed",
        status: "error",
      });
      throw error;
    }
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    try {
      const res = await api.post("/forgotpassword", payload);
      showToast({
        message: res?.data?.message || "Password reset email sent successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to send reset email",
        status: "error",
      });
      throw error;
    }
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    try {
      const res = await api.post("/reset", payload);
      showToast({
        message: res?.data?.message || "Password reset successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to reset password",
        status: "error",
      });
      throw error;
    }
  },
};
