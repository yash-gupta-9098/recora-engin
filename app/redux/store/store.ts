import { configureStore } from '@reduxjs/toolkit';
import globalSettingsReducer from '../slices/globalSettingsSlice';



export const store = configureStore({
  reducer: {
   globalSettings: globalSettingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
