import { createAction } from "@reduxjs/toolkit";
import { AxiosError, AxiosResponse } from "axios";
import { IApiPayload } from "./middleware/api";
export const apiCallBegan = createAction<IApiPayload>("api/callBegan");
export const apiCallSucceded = createAction<AxiosResponse>("api/callSucceded");
export const apiCallFailed = createAction<AxiosError>("api/callFailed");
