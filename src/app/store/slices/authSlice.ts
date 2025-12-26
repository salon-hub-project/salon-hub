import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi, LoginPayload, RegisterPayload } from '../../services/auth.api';
import axios from 'axios';

/* TYPES */
export interface User {
  _id?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  registrationSuccess: boolean;
}

/* HELPERS */
const getStoredAuth = () => {
  if (typeof window === 'undefined') return { user: null, token: null };
  return {
    token: localStorage.getItem('authToken'),
    user: JSON.parse(localStorage.getItem('authUser') || 'null'),
  };
};

const stored = getStoredAuth();

/* INITIAL STATE */
const initialState: AuthState = {
  user: stored.user,
  token: stored.token,
  isAuthenticated: !!stored.token,
  isLoading: false,
  error: null,
  registrationSuccess: false,
};

/* THUNKS */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      return await authApi.login(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// export const registerOwner = createAsyncThunk(
//   'auth/register',
//   async (payload: RegisterPayload, { rejectWithValue }) => {
//     try {
//       return await authApi.registerOwner(payload);
//     } catch (err) {
//       return rejectWithValue(err);
//     }
//   }
// );



export const registerOwner = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await authApi.registerOwner(payload);
      return response;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(
          err.response?.data?.message || 'Registration failed'
        );
      }
      return rejectWithValue('Something went wrong');
    }
  }
);
/* SLICE */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },
    clearError: (state) => {
      state.error = null;
    },
    clearRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      /* LOGIN */
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        const token = action.payload.token || action.payload.data?.token;
        const user = action.payload.user || action.payload.data?.user;

        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = token;
        state.user = user;

        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      /* REGISTER */
      .addCase(registerOwner.pending, (state) => {
        state.isLoading = true;
        state.registrationSuccess = false;
      })
      .addCase(registerOwner.fulfilled, (state) => {
        state.isLoading = false;
        state.registrationSuccess = true;
      })
      .addCase(registerOwner.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
      
  },
});

export const { logout,clearError,clearRegistrationSuccess } = authSlice.actions;
export default authSlice.reducer;
