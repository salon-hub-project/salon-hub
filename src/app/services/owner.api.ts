import api from "./axios";
import { showToast } from "../components/ui/toast";

/* TYPES */
export interface Owner {
  _id: string;
  userId: {
    email: string;
    phoneNumber?: string;
  };
  isApproved: boolean;
  createdAt?: string;
}

export interface OwnersResponse {
  owners: Owner[];
  total: number;
  page: number;
  limit: number;
}

export const ownerApi = {
  // GET ALL OWNERS
  getAllOwners: async (page = 1, limit = 10) => {
    try {
      const res = await api.get(`/owner?page=${page}&limit=${limit}`);
      return {
        owners: res.data.data,
        total: res.data.pagination.total,
        page: res.data.pagination.page,
        limit: res.data.pagination.limit,
      };
    } catch (error: any) {
      showToast({
        message: "Failed to fetch owners",
        status: "error",
      });
      throw error;
    }
  },

  getOwnerDetails: async (id: string) => {
    try {
      const res = await api.get(`/owner/${id}`);
      return res.data;
    } catch (error: any) {
      showToast({
        message: "Failed to fetch owners",
        status: "error",
      });
      throw error;
    }
  },

  // APPROVE OWNER
  approveOwner: async (ownerId: string) => {
    try {
      const res = await api.post(`/approve/${ownerId}`);
      showToast({
        message: res?.data?.message || "Owner approved successfully ✅",
        status: "success",
      });
      return res.data.owner;
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to approve owner",
        status: "error",
      });
      throw error;
    }
  },

  // UPDATE OWNER
  updateOwner: async (ownerId: string, data: FormData) => {
    try {
      const res = await api.put(`/owner/${ownerId}`, data);
      showToast({
        message: res?.data?.message || "Owner updated successfully ✨",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to update owner",
        status: "error",
      });
      throw error;
    }
  },

  // DELETE OWNER
  deleteOwner: async (ownerId: string) => {
    try {
      const res = await api.delete(`/owner/${ownerId}`);
      showToast({
        message: res?.data?.message || "Owner deleted successfully 🗑️",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.message || "Failed to delete owner",
        status: "error",
      });
      throw error;
    }
  },

  // RENEW SUBSCRIPTION
  renewSubscription: async (ownerId: string, months: number) => {
    try {
      const res = await api.post(`/renew/${ownerId}`, { months });
      showToast({
        message:
          res?.data?.message || `Subscription extended by ${months} months`,
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.message || "Failed to renew subscription",
        status: "error",
      });
      throw error;
    }
  },

  // GET TOTAL SALONS COUNT
  getTotalSalonsCount: async () => {
    try {
      const res = await api.get("/owner/totalsalons");
      return res.data.totalSalons;
    } catch (error: any) {
      console.error("Failed to fetch total salons count:", error);
      throw error;
    }
  },

  // GET ACTIVE SALONS COUNT
  getActiveSalonsCount: async () => {
    try {
      const res = await api.get("/owner/activesalons");
      return res.data.totalActiveSalons;
    } catch (error: any) {
      console.error("Failed to fetch active salons count:", error);
      throw error;
    }
  },

  // GET EXPIRED SALONS COUNT
  getExpiredSalonsCount: async () => {
    try {
      const res = await api.get("/owner/expiredsalons");
      return res.data.totalExpiredSalons;
    } catch (error: any) {
      console.error("Failed to fetch expired salons count:", error);
      throw error;
    }
  },

  // GET RECENT ONBOARDED SALONS
  getRecentOnboardedSalons: async () => {
    try {
      const res = await api.get("/owner/recentonboardedsalons");
      return res.data.data;
    } catch (error: any) {
      console.error("Failed to fetch recent onboarded salons:", error);
      throw error;
    }
  },

  // GET EXPIRING SALONS
  getExpiringSalons: async () => {
    try {
      const res = await api.get("/owner/expiringsalons");
      return res.data.data;
    } catch (error: any) {
      console.error("Failed to fetch expiring salons:", error);
      throw error;
    }
  },
};
