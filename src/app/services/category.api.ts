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
    const res = await api.post('/category', payload);
    return res.data;
  },
  deleteCategory: async (categoryId: string) => {
    const res = await api.delete(`/category/${categoryId}`);
    return res.data;
  },
  updateCategory: async (categoryId: string, payload: CreateCategoryPayload) => {
    const res = await api.put(`/category/${categoryId}`, payload);
    return res.data;
  },
  getAllCategories: async (params: GetCategoriesParams = {}) => {
    const { page = 1, limit = 10 } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    const res = await api.get(`/category?${queryParams.toString()}`);
    return res.data;
  },
};
