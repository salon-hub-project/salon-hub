import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileApi } from '../../services/profile.api';

interface ProfileState {
  isLoading: boolean;
  error: string | null;
  profile: any | null;
}

const initialState: ProfileState = {
  isLoading: false,
  error: null,
  profile: null,
};



// export const createProfile = createAsyncThunk(
//   'profile/create',
//   async (formData: FormData, { rejectWithValue }) => {
//     try {
//       return await profileApi.createProfile(formData);
//     } catch (error: any) {
//       return rejectWithValue(
//         error?.response?.data?.message || 'Profile creation failed'
//       );
//     }
//   }
// );
export const createProfile = createAsyncThunk(
  'profile/create',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await profileApi.createProfile(formData);
      return response.data; // ✅ IMPORTANT
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || 'Profile creation failed'
      );
    }
  }
);


const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default profileSlice.reducer;
