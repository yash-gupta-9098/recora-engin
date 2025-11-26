import { configureStore } from '@reduxjs/toolkit';
import globalSettingsReducer from '../slices/globalSettingsSlice';
import { widgetReducer } from '../slices/pageWidgetConfigSlice';
import { productDataReducer } from '../slices/productDataSlice';


export const store = configureStore({
  reducer: {
   globalSettings: globalSettingsReducer,
   widgetSlice: widgetReducer,
   productData: productDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
