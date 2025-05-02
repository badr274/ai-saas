import { configureStore } from "@reduxjs/toolkit";
import proModalSlice from "./features/ProModalSlice";
export const store = configureStore({
  reducer: {
    proModalSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
