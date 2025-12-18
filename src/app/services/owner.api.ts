// import api from './axios';

import api from "./ axios";

/* TYPES */
export interface Owner {
  _id: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  isVerified?: boolean;
  createdAt?: string;
}

export interface OwnersResponse {
  owners: Owner[];
  total: number;
  page: number;
  limit: number;
}

export const ownerApi = {
  getAllOwners: (page = 1, limit = 10) =>
    api
      .get(`/owner/all?page=${page}&limit=${limit}`)
      .then((res) => res.data),
};
