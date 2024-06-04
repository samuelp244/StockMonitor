import axiosInstance from "./axiosInstance";
import { setAccessToken, setUserData } from "@/redux/authReducer";
import { store } from "@/redux/store";

const getNewRefreshToken = async (): Promise<string | null> => {
//   const authenticationObject = store.getState().auth;

  const refresh = async (): Promise<string | null> => {
    try {
      const response = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL ?? ""}/auth/renewaccess`
      );
      store.dispatch(setUserData(response?.data?.data));
      store.dispatch(setAccessToken(response?.data?.data));
      return await Promise.resolve(response?.data?.data?.accessToken);
    } catch (error) {
      return await Promise.reject(error);
    }
  };

  return await refresh();
};

export default getNewRefreshToken;
