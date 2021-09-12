import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../configureStore";

export declare interface IUser {
  name: string;
  id: string;
}
/**
 * If errors occuer with type casting see:https://redux.js.org/tutorials/typescript-quick-start#define-slice-state-and-action-types
 */
export const userInitialState: IUser = { name: "", id: "" };

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: userInitialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    logIn: (state, action: PayloadAction<IUser>) => {
      console.log(state);

      return { ...action.payload };
    },
    logOut: () => {
      return { ...userInitialState };
    },
  },
});

// Other code such as selectors can use the imported `RootState` type
// automatically memoized
export const getUser = (state: RootState) => state.auth.user;
export const { logIn, logOut } = userSlice.actions;
export default userSlice.reducer;
