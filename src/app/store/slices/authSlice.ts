import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import config from '../../config';

// Types
export interface User {
  id?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  registrationSuccess: boolean;
}

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

interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    token?: string;
    user?: User;
    registrationId?: string;
  };
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('authToken') : null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
  registrationSuccess: false,
};

// Async thunks
export const loginUser = createAsyncThunk<
  ApiResponse,
  LoginPayload,
  { rejectValue: string }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
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
      return rejectWithValue(data.message || 'Login failed');
    }

    return data;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
  }
});

export const registerOwner = createAsyncThunk<
  ApiResponse,
  RegisterPayload,
  { rejectValue: string }
>('auth/register', async (payload, { rejectWithValue }) => {
  try {
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
      return rejectWithValue(data.message || 'Registration failed');
    }

    return data;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
  }
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.error = null;
        
        if (action.payload.data?.token) {
          state.token = action.payload.data.token;
          if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', action.payload.data.token);
          }
        }
        
        if (action.payload.data?.user) {
          state.user = action.payload.data.user;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload || 'Login failed';
      });

    // Register
    builder
      .addCase(registerOwner.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerOwner.fulfilled, (state) => {
        state.isLoading = false;
        state.registrationSuccess = true;
        state.error = null;
      })
      .addCase(registerOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.registrationSuccess = false;
        state.error = action.payload || 'Registration failed';
      });
  },
});

export const { logout, clearError, clearRegistrationSuccess, setCredentials } = authSlice.actions;
export default authSlice.reducer;

