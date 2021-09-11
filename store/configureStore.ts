import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import Reducer from "./mainReducer";
import logger from "./middleware/logger";

/**
 * Calls configure store and returns it
 * @returns
 */
export default configureStore({
  reducer: Reducer,
  // as https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics#configuring-the-store
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger("console")),
});
