// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import config from '../../config';

// // Types
// export interface User {
//   id?: string;
//   _id?: string;
//   email: string;
//   phoneNumber?: string;
//   address?: string;
//   role?: string;
//   firstName?: string;
//   lastName?: string;
//   isVerified?: boolean;
// }

// export interface AuthState {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   error: string | null;
//   registrationSuccess: boolean;
// }

// export interface LoginPayload {
//   email: string;
//   password: string;
// }

// export interface RegisterPayload {
//   email: string;
//   address: string;
//   password: string;
//   phoneNumber: string;
// }

// interface ApiResponse {
//   success?: boolean;
//   message?: string;
//   token?: string;
//   user?: User;
//   data?: {
//     token?: string;
//     user?: User;
//     registrationId?: string;
//   };
// }

// // Helper function to get user from localStorage
// const getUserFromStorage = (): User | null => {
//   if (typeof window === 'undefined') return null;
//   try {
//     const userData = localStorage.getItem('authUser');
//     return userData ? JSON.parse(userData) : null;
//   } catch {
//     return null;
//   }
// };

// // Helper function to get initial auth state
// const getInitialAuthState = (): boolean => {
//   if (typeof window === 'undefined') return false;
//   const token = localStorage.getItem('authToken');
//   const user = getUserFromStorage();
//   return !!(token && user);
// };

// // Initial state
// const initialState: AuthState = {
//   user: getUserFromStorage(),
//   token: typeof window !== 'undefined' ? localStorage.getItem('authToken') : null,
//   isLoading: false,
//   isAuthenticated: getInitialAuthState(),
//   error: null,
//   registrationSuccess: false,
// };

// // Async thunks
// export const loginUser = createAsyncThunk<
//   ApiResponse,
//   LoginPayload,
//   { rejectValue: string }
// >('auth/login', async (payload, { rejectWithValue }) => {
//   try {
//     const response = await fetch(`${config.API_BASE_URL}/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true',
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return rejectWithValue(data.message || 'Login failed');
//     }

//     return data;
//   } catch (error) {
//     return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
//   }
// });

// export const registerOwner = createAsyncThunk<
//   ApiResponse,
//   RegisterPayload,
//   { rejectValue: string }
// >('auth/register', async (payload, { rejectWithValue }) => {
//   try {
//     const response = await fetch(`${config.API_BASE_URL}/owner/register`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'ngrok-skip-browser-warning': 'true',
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return rejectWithValue(data.message || 'Registration failed');
//     }

//     return data;
//   } catch (error) {
//     return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
//   }
// });

// // Slice
// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       state.error = null;
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('authToken');
//         localStorage.removeItem('authUser');
//       }
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearRegistrationSuccess: (state) => {
//       state.registrationSuccess = false;
//     },
//     setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       state.isAuthenticated = true;
//       if (typeof window !== 'undefined') {
//         localStorage.setItem('authToken', action.payload.token);
//         localStorage.setItem('authUser', JSON.stringify(action.payload.user));
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     // Login
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isAuthenticated = true;
//         state.error = null;
        
//         // Handle both response structures: { token, user } or { data: { token, user } }
//         const token = action.payload.token || action.payload.data?.token;
//         const user = action.payload.user || action.payload.data?.user;
        
//         if (token) {
//           state.token = token;
//           if (typeof window !== 'undefined') {
//             localStorage.setItem('authToken', token);
//           }
//         }
        
//         if (user) {
//           state.user = user;
//           if (typeof window !== 'undefined') {
//             localStorage.setItem('authUser', JSON.stringify(user));
//           }
//         }
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isAuthenticated = false;
//         state.error = action.payload || 'Login failed';
//       });

//     // Register
//     builder
//       .addCase(registerOwner.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//         state.registrationSuccess = false;
//       })
//       .addCase(registerOwner.fulfilled, (state) => {
//         state.isLoading = false;
//         state.registrationSuccess = true;
//         state.error = null;
//       })
//       .addCase(registerOwner.rejected, (state, action) => {
//         state.isLoading = false;
//         state.registrationSuccess = false;
//         state.error = action.payload || 'Registration failed';
//       });
//   },
// });

// export const { logout, clearError, clearRegistrationSuccess, setCredentials } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi, LoginPayload, RegisterPayload } from '../../services/auth.api';

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

export const registerOwner = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      return await authApi.registerOwner(payload);
    } catch (err) {
      return rejectWithValue(err);
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
