import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ownerApi, Owner } from '../../services/owner.api';

/* STATE TYPE */
interface OwnerState {
  owners: Owner[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
}

/* INITIAL STATE */
const initialState: OwnerState = {
  owners: [],
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  error: null,
};

/* FETCH OWNERS */
export const fetchOwners = createAsyncThunk(
  'owner/fetchOwners',
  async ({ page, limit }: { page: number; limit: number }) => {
    return await ownerApi.getAllOwners(page, limit);
  }
);

/* APPROVE OWNER */
export const approveOwner = createAsyncThunk(
  'owner/approveOwner',
  async (ownerId: string) => {
    return await ownerApi.approveOwner(ownerId);
  }
);

// UPDATE OWNER
export const updateOwner = createAsyncThunk(
  'owner/updateOwner',
  async (
    { ownerId, formData }: { ownerId: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await ownerApi.updateOwner(ownerId, formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Owner update failed'
      );
    }
  }
);


/* DELETE OWNER */
export const deleteOwner = createAsyncThunk(
  'owner/delete',
  async (ownerId: string) => {
    await ownerApi.deleteOwner(ownerId);
    return ownerId; 
  }
);


/* SLICE */
const ownerSlice = createSlice({
  name: 'owner',
  initialState,
  reducers: {
    clearOwnerError: (state) => {
      state.error = null;
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
        console.log('FETCH OWNERS RESPONSE 👉', action.payload);
        state.isLoading = false;
        state.owners = action.payload.owners;
        state.total = action.payload.total;
      })
      .addCase(fetchOwners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // APPROVE OWNER
      .addCase(approveOwner.fulfilled, (state, action) => {
        const updatedOwner = action.payload;

        const index = state.owners.findIndex(
          (owner) => owner._id === updatedOwner._id
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
          (owner) => owner._id === updatedOwner._id
        );
      
        if (index !== -1) {
          state.owners[index] = updatedOwner;
        }
      })
      
      // DELETE OWNER
      .addCase(deleteOwner.fulfilled,(state,action)=>{
        const deletedOwnerId = action.payload
        state.owners = state.owners.filter(owner=>owner._id !== deletedOwnerId)
      })
  },
});

export const { clearOwnerError } = ownerSlice.actions;
export default ownerSlice.reducer;
