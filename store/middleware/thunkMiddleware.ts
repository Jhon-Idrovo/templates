import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../configureStore";

/**
 * Type for handling async and sync functions using Thunk. It assumes that the function is void.
 */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
