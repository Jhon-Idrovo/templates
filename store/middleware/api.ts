import axios, { AxiosError } from "axios";
import { Middleware } from "redux";
import { API_BASE_URL } from "../../config/config";

import { RootState } from "../configureStore";
import { createAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

export declare interface IApiPayload {
  url: string;
  method: "POST" | "GET";
  data: Object;

  onSuccess?: string;
  onError?: string;
  onStart?: string;
}
export declare interface IApiAction {
  type: string;
  payload: IApiPayload;
}

export const apiCallBegan = createAction<IApiPayload>("api/callBegan");
export const apiCallSucceded = createAction<AxiosResponse>("api/callSucceded");
export const apiCallFailed = createAction<AxiosError>("api/callFailed");
/**
 * On success dispatches the onSuccess action with payload:response.data
 * On error dispatches the onError action with payload:error message
 *
 * @returns
 */
const api: any = () => {
  const a: Middleware<{}, RootState> =
    ({ dispatch }) =>
    (next) =>
    async (action: IApiAction) => {
      // do not execute if no call
      if (action.type !== apiCallBegan.type) return next(action);

      const { url, method, data, onError, onStart, onSuccess } = action.payload;
      // dispatch start action
      if (onStart) dispatch({ type: onStart });
      // to log the action in dev tools
      next(action);
      try {
        const r = await axios.request({
          baseURL: API_BASE_URL,
          url,
          method,
          data,
        });
        // General handler
        dispatch(apiCallSucceded(r.data));
        // Specific handler
        if (onSuccess) dispatch({ type: onSuccess, payload: r.data });
      } catch (error) {
        // General handler
        dispatch(
          apiCallFailed((error as AxiosError).response?.data.error.message)
        );
        // Specific handler
        dispatch({
          type: onError,
          payload:
            (error as AxiosError).response?.data.error.message ||
            (error as Error).message,
        });
      }
    };
  return a;
};
export default api;
