import api from "./axios";

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
    const res = await api.get(`/owner?page=${page}&limit=${limit}`);

    return {
      owners: res.data.data,
      total: res.data.pagination.total,
      page: res.data.pagination.page,
      limit: res.data.pagination.limit,
    };
  },

  // APPROVE OWNER
  approveOwner: async (ownerId: string) => {
    const res = await api.post(`/approve/${ownerId}`);
    return res.data.owner;
  },

  // UPDATE OWNER
  updateOwner: async(ownerId: string, data: FormData) => {
    const res= await api.put(`/owner/${ownerId}`, data)
    return res.data;
  },
  
  // delete owner 
  deleteOwner :async(ownerId :string)=>{
    const res = await api.delete(`/owner/${ownerId}`);
    return res.data;
  }

};
