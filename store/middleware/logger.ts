import { Middleware } from "redux";
import { RootState } from "../configureStore";

type LogDestination = "console" | "server";
/**
 * Middleware for logging. Use as example https://redux.js.org/usage/usage-with-typescript#type-checking-middleware
 * @param destination
 * @returns
 */
const logger: any = (destination: LogDestination) => {
  const a: Middleware<{}, RootState> = (store) => (next) => (action) => {
    if (destination === "server") console.log("server log");

    console.log("console log", store.getState());
    next(action);
  };
  return a;
};

export default logger;

// export const exampleMiddleware: Middleware<
//   {}, // Most middleware do not modify the dispatch return value
//   RootState
// > = storeApi => next => action => {
//   const state = storeApi.getState() // correctly typed as RootState
// }
