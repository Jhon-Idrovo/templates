import { Middleware } from "redux";
import { RootState } from "../configureStore";

const apiMiddleware: Middleware<
  {}, // Most middleware do not modify the dispatch return value
  RootState
> = (store) => (next) => (action) => {
  const state = store.getState(); // correctly typed as RootState
};

export default apiMiddleware;
