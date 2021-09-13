import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  Dispatch,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../../config/axiosInstance";
import { LOG_IN_ENDPOINT } from "../../config/config";
import { RootState } from "../configureStore";
import { AppThunk } from "../middleware/thunkMiddleware";

export declare interface IUser {
  name: string;
  id: string;
  loading?: boolean;
  error?: string;
}
/**
 * If errors occuer with type casting see:https://redux.js.org/tutorials/typescript-quick-start#define-slice-state-and-action-types
 */
export const userInitialState: IUser = {
  name: "",
  id: "",
  loading: false,
  error: "",
};
export declare interface IUserResponse {
  id: IUser["id"];
  name: IUser["name"];
}
export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: userInitialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    userLoading: (state) => {
      state.loading = true;
    },
    userLogged: (state, action: PayloadAction<IUser>) => {
      // state.loading = false;
      return { ...action.payload };
    },
    userLoggedOut: () => {
      return { ...userInitialState };
    },
    userLogInFailed: (user, action: PayloadAction<string>) => {
      user.error = action.payload;
      user.loading = false;
    },
  },
});

const { userLogged, userLoggedOut, userLoading, userLogInFailed } =
  userSlice.actions;
export default userSlice.reducer;

// Other code such as selectors can use the imported `RootState` type
// automatically memoized

//SELECTORS
export const getUser = (state: RootState) => state.auth.user;

// FUNCTION ACTIONS
export const logIn =
  (username: string, password: string): AppThunk =>
  async (dispatch) => {
    console.log(username, password);

    // start the loading
    dispatch(userLoading());
    // call the api
    try {
      const res = await axiosInstance.get("/users/1");
      const { id, name } = res.data as IUserResponse;
      // pass the error to override previous errors
      return dispatch(userLogged({ id, name, error: "", loading: false }));
    } catch (error) {
      return dispatch(
        userLogInFailed((error as AxiosError).response?.data.error.message)
      );
    }
  };
export const logOut = () => userLoggedOut();
