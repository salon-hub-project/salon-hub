import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ownerReducer from './slices/ownerSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    owner: ownerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;




