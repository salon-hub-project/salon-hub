import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FormKey = string;

interface FormDraftState {
  drafts: Record<FormKey, any>;
}

const initialState: FormDraftState = {
  drafts: {},
};

const formDraftSlice = createSlice({
  name: "formDraft",
  initialState,
  reducers: {
    setFormDraft(
      state,
      action: PayloadAction<{ key: FormKey; data: any }>
    ) {
      state.drafts[action.payload.key] = action.payload.data;
    },

    clearFormDraft(state, action: PayloadAction<FormKey>) {
      delete state.drafts[action.payload];
    },

    clearAllDrafts(state) {
      state.drafts = {};
    },
  },
});

export const {
  setFormDraft,
  clearFormDraft,
  clearAllDrafts,
} = formDraftSlice.actions;

export default formDraftSlice.reducer;
