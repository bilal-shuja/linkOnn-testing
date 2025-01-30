import axios from "axios";
import Cookies from "js-cookie";

const createAPI = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const token = Cookies.get("token");

  if (!token) {
    return null;
  }

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        Cookies.remove("token");
        window.location.href = "/auth/sign-in";
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default createAPI;
