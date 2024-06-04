import axios from "axios";
import { store } from "@/redux/store";
import getNewRefreshToken from "./getNewRefreshToken";

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL as string}`,
});
axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.headers.common.crossDomain = true;
axiosInstance.defaults.headers.common["Access-Control-Max-Age"] = "600";

axiosInstance.interceptors.request.use(
  async (config) => {
    if (
      config.headers !== undefined &&
      config.headers.Authorization === undefined
    ) {
      const accessToken = store?.getState()?.auth?.accessToken;
      config.headers.Authorization = `Bearer ${accessToken as string}`;
    }
    return config;
  },
  (error) => {
    void Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.config !== undefined) {
      const axiosConfig = error.config;
      if (error?.response?.status === 401) {
        const newAccessToken = await getNewRefreshToken();
        if (newAccessToken !== null) {
          axiosConfig.headers.Authorization = `Bearer ${newAccessToken}`;
          return await axiosInstance(axiosConfig);
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
    throw error;
  }
);

export default axiosInstance;
