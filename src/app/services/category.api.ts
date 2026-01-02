import { showToast } from '../components/ui/toast';
import api from './axios';

export interface CreateCategoryPayload {
  name: string;
}

export interface CategoryResponse {
  _id: string;
  name: string;
  createdAt?: string;
}

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
}

export const categoryApi = {
  createCategory: async (payload: CreateCategoryPayload) => {
    try{
    const res = await api.post('/category', payload);
    showToast({
      message: res?.data?.message || "Category created successfully",
      status: "success"
    })
    return res.data;
    }
    catch(error: any){
      showToast({
        message: error?.response?.data?.message || "Failed to create category",
        status: "error"
      })
    }
  },
  deleteCategory: async (categoryId: string) => {
    try{
    const res = await api.delete(`/category/${categoryId}`);
    showToast({
      message: res?.data?.message || "Category created successfully",
      status: "success"
    })
    return res.data;
  }
    catch(error: any){
      showToast({
        message: error?.response?.data?.message || "Failed to delete category",
        status: "error"
      })
    }
  },
  updateCategory: async (categoryId: string, payload: CreateCategoryPayload) => {
    try{
    const res = await api.put(`/category/${categoryId}`, payload);
    showToast({
      message: res?.data?.message || "Category updated successfully",
      status: "success"
    })
    return res.data;
    }
    catch(error: any){
      showToast({
        message: error?.response?.data?.message || "Failed to update category",
        status: "error"
      })
    }
  },
  getAllCategories: async (params: GetCategoriesParams = {}) => {
    try{
    const { page = 1, limit = 10 } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    const res = await api.get(`/category?${queryParams.toString()}`);
    return res.data;
    }
    catch(error: any){
      showToast({
        message: error?.response?.data?.message || "Failed to fetch categories",
        status: "error"
      })
    }
  },
};
