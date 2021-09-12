import axios from "axios";
import { Middleware } from "redux";
import { API_BASE_URL } from "../../config/config";
import store, { RootState } from "../configureStore";

export declare interface IApiPayload {
  url: string;
  method: "POST" | "GET";
  data: Object;
  onSuccess: string;
  onError: string;
}
export declare interface IApiAction {
  type: string;
  payload: IApiPayload;
}

const api: any = () => {
  const a: Middleware<{}, RootState> =
    ({ dispatch }) =>
    (next) =>
    async (action: IApiAction) => {
      // do not execute if no call
      if (action.type !== "apiCallBegan") return next(action);

      // to log the action in dev tools
      next(action);
      const { url, method, onError, onSuccess, data } = action.payload;
      try {
        const r = await axios.request({
          baseURL: API_BASE_URL,
          url,
          method,
          data,
        });
        dispatch({ type: onSuccess, payload: r.data });
      } catch (error) {}
      dispatch({ type: onError });
    };
  return a;
};
export default api;
