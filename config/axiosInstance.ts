import axios from "axios";
import { API_BASE_URL } from "./config";

const baseURL = API_BASE_URL;
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization:
      typeof window !== "undefined" ? "JWT " + localStorage.getItem("ss") : "",
  },
});

axiosInstance.interceptors.response.use(
  //on fulfill
  (res) => res,
  //on reject
  async (error) => {
    console.log("Failed request intercepted");
    const originalRequest = error.config;
    //IF THE SERVER ISN'T WORKING
    if (typeof error.response === "undefined") {
      alert(
        "A server/network error occurred. " +
          "Looks like CORS might be the problem. " +
          "Sorry about this - we will get it fixed shortly."
      );
      return Promise.reject(error);
    }
    //if the refresh token has expired or is invalid redirect to login
    if (
      error.response.status === 401 &&
      originalRequest.url === baseURL + "/auth/get-new-access-token"
    ) {
      window.location.href = "/signin/";
      return Promise.reject(error);
    }
    //if the access token has expired
    if (
      error.response.status === 401 &&
      error.response.data.error === "Authorization failed"
    ) {
      //randon name for security
      const refreshToken = localStorage.getItem("rr");

      if (refreshToken) {
        const tokenParts = JSON.parse(
          Buffer.from(refreshToken.split(".")[1], "base64").toString()
        );

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000);

        if (tokenParts.exp > now) {
          return axiosInstance
            .post("/auth/get-new-access-token", { refresh: refreshToken })
            .then((response) => {
              typeof window !== "undefined" &&
                localStorage.setItem("ss", response.data.accessToken);
              // localStorage.setItem("refresh_token", response.data.refresh);

              axiosInstance.defaults.headers.Authorization =
                "JWT " + response.data.accessToken;
              originalRequest.headers.Authorization =
                "JWT " + response.data.accessToken;

              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("Refresh token is expired", tokenParts.exp, now);
          window.location.href = "/signin/";
        }
      } else {
        console.log("Refresh token not available.");
        window.location.href = "/signin/";
      }
    }
  }
);

export default axiosInstance;
