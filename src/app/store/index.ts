import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ownerReducer from './slices/ownerSlice';
import profileReducer from './slices/profileSlice';
import { profile } from 'console';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    owner: ownerReducer,
    profile : profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;










