import { createSlice } from "@reduxjs/toolkit";
interface IInitialState {
  isOpen: boolean;
}
const initialState: IInitialState = {
  isOpen: false,
};
const proModalSlice = createSlice({
  name: "pro-modal",
  initialState,
  reducers: {
    onOpen: (state) => {
      state.isOpen = true;
    },
    onClose: (state) => {
      state.isOpen = false;
    },
  },
});

export const { onClose, onOpen } = proModalSlice.actions;
export default proModalSlice.reducer;
