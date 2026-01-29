import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ownerApi, Owner } from "../../services/owner.api";

/* STATE TYPE */
interface OwnerState {
  owners: Owner[];
  selectedOwner: Owner | null;
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
}

/* INITIAL STATE */
const initialState: OwnerState = {
  owners: [],
  selectedOwner: null,
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
};

/* FETCH OWNERS */
export const fetchOwners = createAsyncThunk(
  "owner/fetchOwners",
  async ({ page, limit }: { page: number; limit: number }) => {
    return await ownerApi.getAllOwners(page, limit);
  },
);

export const FetchOwnersDetails = createAsyncThunk(
  "owner/ownerDetails",
  async (id: string) => {
    return await ownerApi.getOwnerDetails(id);
  },
);

/* APPROVE OWNER */
export const approveOwner = createAsyncThunk(
  "owner/approveOwner",
  async (ownerId: string) => {
    return await ownerApi.approveOwner(ownerId);
  },
);

// UPDATE OWNER
export const updateOwner = createAsyncThunk(
  "owner/updateOwner",
  async (
    { ownerId, formData }: { ownerId: string; formData: FormData },
    { rejectWithValue },
  ) => {
    try {
      const response = await ownerApi.updateOwner(ownerId, formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Owner update failed",
      );
    }
  },
);

/* DELETE OWNER */
export const deleteOwner = createAsyncThunk(
  "owner/delete",
  async (ownerId: string) => {
    await ownerApi.deleteOwner(ownerId);
    return ownerId;
  },
);

/* RENEW SUBSCRIPTION */
export const renewSubscription = createAsyncThunk(
  "owner/renewSubscription",
  async (
    { ownerId, months }: { ownerId: string; months: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await ownerApi.renewSubscription(ownerId, months);
      return { ownerId, ...response };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Subscription renewal failed",
      );
    }
  },
);

/* SLICE */
const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    clearOwnerError: (state) => {
      state.error = null;
    },
    clearSelectedOwner: (state) => {
      state.selectedOwner = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH OWNERS
      .addCase(fetchOwners.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOwners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.owners = action.payload.owners;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchOwners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(FetchOwnersDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(FetchOwnersDetails.fulfilled, (state, action) => {
        state.isLoading = false;

        const payload = action.payload;

        if (payload?.owners?.length > 0) {
          state.selectedOwner = payload.owners[0];
        } else if (payload?.owner) {
          state.selectedOwner = payload.owner;
        } else {
          state.selectedOwner = payload; // fallback
        }
      })
      .addCase(FetchOwnersDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load owner details";
      })

      // APPROVE OWNER
      .addCase(approveOwner.fulfilled, (state, action) => {
        const updatedOwner = action.payload;

        const index = state.owners.findIndex(
          (owner) => owner._id === updatedOwner._id,
        );

        if (index !== -1) {
          state.owners[index].isApproved = true;
        }
      })
      //UPDATE OWNER
      .addCase(updateOwner.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOwner = action.payload;
        const index = state.owners.findIndex(
          (owner) => owner._id === updatedOwner._id,
        );

        if (index !== -1) {
          state.owners[index] = updatedOwner;
        }
      })

      // DELETE OWNER
      .addCase(deleteOwner.fulfilled, (state, action) => {
        const deletedOwnerId = action.payload;
        state.owners = state.owners.filter(
          (owner) => owner._id !== deletedOwnerId,
        );
        state.total = Math.max(0, state.total - 1);
      })
      // RENEW SUBSCRIPTION
      .addCase(renewSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(renewSubscription.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(renewSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOwnerError, clearSelectedOwner } = ownerSlice.actions;
export default ownerSlice.reducer;
