import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  Dispatch,
  PayloadAction,
} from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import { LOG_IN_ENDPOINT } from "../../config/config";
import { RootState } from "../configureStore";
import { apiCallBegan } from "../middleware/api";
import { AppThunk } from "../middleware/thunkMiddleware";

export declare interface IUser {
  name: string;
  id: string;
  loading: boolean;
  error: string;
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

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (param: string, thunkAPI) => {
    console.log(param, thunkAPI);

    const res = await axiosInstance.get(
      "https://jsonplaceholder.typicode.com/tods"
    );
    return res.data;
  }
);

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
      state.loading = false;
      return action.payload;
    },
    userLoggedOut: () => {
      return { ...userInitialState };
    },
    userLogInFailed: (user, action: PayloadAction<string>) => {
      user.error = action.payload;
      user.loading = false;
    },
  },
  extraReducers: (builder) => {
    console.log("builder", builder);
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      console.log("state", state);
      console.log("action", action);
    });
    builder.addCase(fetchTodos.rejected, (state, action) => {
      console.log("state", state);
      console.log("action", action);
    });
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
  (dispatch) => {
    dispatch(userLoading());
    dispatch(
      apiCallBegan({
        url: LOG_IN_ENDPOINT,
        data: { username, password },
        method: "POST",
        onSuccess: userLogged.type,
        onError: userLogInFailed.type,
      })
    );
  };
