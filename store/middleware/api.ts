import axios, { AxiosError } from "axios";
import { Middleware } from "redux";
import { API_BASE_URL } from "../../config/config";
import { apiCallBegan, apiCallFailed, apiCallSucceded } from "../api";
import { RootState } from "../configureStore";

export declare interface IApiPayload {
  url: string;
  method: "POST" | "GET";
  data: Object;
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
      if (action.type !== apiCallBegan.type) return next(action);

      // to log the action in dev tools
      next(action);
      const { url, method, data } = action.payload;
      try {
        const r = await axios.request({
          baseURL: API_BASE_URL,
          url,
          method,
          data,
        });
        dispatch(apiCallSucceded(r));
      } catch (error) {
        dispatch(apiCallFailed(error as AxiosError));
      }
    };
  return a;
};
export default api;
