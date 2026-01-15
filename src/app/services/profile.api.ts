import api from "./axios";
import { showToast } from "../components/ui/toast";

export interface CreateProfilePayload {
  salonName: string;
  ownerName: string;
  salonImage: File;
}

export const profileApi = {
  createProfile: async (formData: FormData) => {
    try {
      const res = await api.post("/profile", formData);
      showToast({
        message: res?.data?.message || "Profile created successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to create profile",
        status: "error",
      });
      throw error;
    }
  },

  updateProfile: async (formData: FormData) => {
    try {
      const res = await api.put("/profile", formData);
      showToast({
        message: res?.data?.message || "Profile updated successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to update profile",
        status: "error",
      });
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const res = await api.get("/profile");
      return res.data;
    } catch (error: any) {
      // showToast({
      //   message: error?.response?.data?.message || "Failed to fetch profile",
      //   status: "error",
      // });
      throw error;
    }
  },

  deleteProfile: async () => {
    try {
      const res = await api.delete("/profile");
      showToast({
        message: res?.data?.message || "Profile deleted successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to delete profile",
        status: "error",
      });
      throw error;
    }
  },
  getProfileTimings: async () => {
    try {
      const res = await api.get("/profile/timings");
      console.log(res.data);
      return res.data;
    } catch (error: any) {
      throw error;
    }
  },
};
