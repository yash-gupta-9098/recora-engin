import { configureStore } from "@reduxjs/toolkit";
import setupTabSliceReducer from "./slice/adminSlice/stapes.js"

export const store = configureStore({
    reducer: {
        setupTab: setupTabSliceReducer,
      },
})