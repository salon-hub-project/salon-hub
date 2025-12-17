import config from '../config';

export interface RegisterOwnerPayload {
  email: string;
  address: string;
  password: string;
  phoneNumber: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export const apiService = {
  async registerOwner(payload: RegisterOwnerPayload): Promise<ApiResponse> {
    const response = await fetch(`${config.API_BASE_URL}/owner/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  },

  async login(payload: LoginPayload): Promise<ApiResponse> {
    const response = await fetch(`${config.API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },
};

export default apiService;
