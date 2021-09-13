import { IUserResponse } from "../store/auth/user";

export const API_BASE_URL = "https://jsonplaceholder.typicode.com";
export const LOG_IN_ENDPOINT = "/users/1";
export const BUGS_CACHING_TIMEOUT = 5000;
export const ALBUMS_CACHING_TIMEOUT = 5000;
export const USER_SERVER_RESPONSE = {
  id: "1",
  name: "Jhon Doe",
} as IUserResponse;
