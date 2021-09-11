import { createSlice } from "@reduxjs/toolkit";

export declare interface IUser {
  name: string;
  id: string;
}

export const userInitialState: IUser = { name: "", id: "" };

export const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    logIn: (state, action) => {
      console.log(state);

      return { ...action.payload };
    },
    logOut: () => {
      return { ...userInitialState };
    },
  },
});

export const { logIn, logOut } = userSlice.actions;
export default userSlice.reducer;
