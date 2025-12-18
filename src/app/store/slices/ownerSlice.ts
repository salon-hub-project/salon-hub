import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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

/* THUNK */
export const fetchOwners = createAsyncThunk(
  'owner/fetchAll',
  async (
    { page, limit }: { page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      return await ownerApi.getAllOwners(page, limit);
    } catch (err) {
      return rejectWithValue(err);
    }
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
      .addCase(fetchOwners.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOwners.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;

        state.owners = action.payload.data 
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchOwners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOwnerError } = ownerSlice.actions;
export default ownerSlice.reducer;
