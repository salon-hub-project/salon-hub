import { showToast } from "../components/ui/toast";
import api from "./axios";

export interface createRolePayload {
  name: string;
}

export const rolesApi = {
  getAllRoles: async () => {
    try {
      const res = await api.get(`/staffRole`);
      console.log(res.data);
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.message || "Failed to fetch roles",
        status: "error",
      });
    }
  },

  createRoles: async (payload: createRolePayload) => {
    try {
      const res = await api.post(`/staffRole`, payload);
      console.log(res.data);
      showToast({
        message: res?.data?.message || "Role created successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.message || "Failed to create role",
        status: "error",
      });
    }
  },

  updateRole: async (roleId: string, payload: createRolePayload) => {
    try {
      const res = await api.put(`/staffRole/${roleId}`, payload);
      console.log(res.data);
      showToast({
        message: res?.data?.message || "Role updated successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.message || "Failed to update role",
        status: "error",
      });
    }
  },

  deleteRole: async (roleId: string) => {
    try {
      const res = await api.delete(`/staffRole/${roleId}`);
      console.log(res.data);
      showToast({
        message: res?.data?.message || "Role deleted successfully",
        status: "success",
      });
      return res.data;
    } catch (error: any) {
      showToast({
        message: error?.response?.message || "Failed to delete role",
        status: "error",
      });
    }
  },
};
