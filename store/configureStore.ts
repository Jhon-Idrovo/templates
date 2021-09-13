import { configureStore } from "@reduxjs/toolkit";
import Reducer from "./mainReducer";
import logger from "./middleware/logger";

/**
 * Calls configure store and returns it
 * @returns
 */
const store = configureStore({
  reducer: Reducer,
  // as https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics#configuring-the-store
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(logger("console"), api()),
});
// Inferring these types from the store itself means that they correctly update as you add more state slices or modify middleware settings.
// https://redux.js.org/tutorials/typescript-quick-start#define-root-state-and-dispatch-types
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
