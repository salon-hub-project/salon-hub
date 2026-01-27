import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { profileApi } from "../../services/profile.api";

interface ProfileTimings {
  openingTime: string;
  closingTime: string;
  workingDays: number[];
}
interface ProfileState {
  isLoading: boolean;
  error: string | null;
  profile: any | null;
  timings: ProfileTimings | null;
}


const initialState: ProfileState = {
  isLoading: false,
  error: null,
  profile: null,
  timings: null, 
  
};



export const createProfile = createAsyncThunk(
  "profile/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await profileApi.createProfile(formData);
      // profileApi returns res.data => { success, data, message }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Profile creation failed"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await profileApi.updateProfile(formData);
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Profile update failed"
      );
    }
  }
);

export const getProfile = createAsyncThunk(
  "profile/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileApi.getProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

export const deleteProfile = createAsyncThunk(
  "profile/deleteProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileApi.deleteProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to delete profile"
      );
    }
  }
);

export const fetchProfileTimings = createAsyncThunk(
  "profile/fetchProfileTimings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileApi.getProfileTimings();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch profile timings"
      );
    }
  }
);

export const getStaffProfile = createAsyncThunk(
  "profile/getStaffProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileApi.getStaffProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch staff profile"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
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
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProfile.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = null;
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchProfileTimings.pending, (state) => {
        // state.isLoading = true; // Optional: separate loading state for timings if needed
      })
      .addCase(fetchProfileTimings.fulfilled, (state, action) => {
        state.timings = action.payload;
      })
      .addCase(fetchProfileTimings.rejected, (state, action) => {
        console.error("Failed to fetch timings:", action.payload);
      })
      .addCase(getStaffProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getStaffProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        // Also populate timings for staff if available in the profile response
        const salonData = action.payload?.salonDetails || action.payload;
        if (salonData?.openingTime && salonData?.closingTime) {
          state.timings = {
            openingTime: salonData.openingTime,
            closingTime: salonData.closingTime,
            workingDays: salonData.workingDays || [0, 1, 2, 3, 4, 5, 6],
          };
        }
      })
      .addCase(getStaffProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
