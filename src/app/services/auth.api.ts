// import api from './axios';

import api from "./ axios";

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
  login: (payload: LoginPayload) =>
    api.post('/login', payload).then((res) => res.data),

  registerOwner: (payload: RegisterPayload) =>
    api.post('/owner/register', payload).then((res) => res.data),
};
