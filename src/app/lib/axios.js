import axios from "axios";

const createAPI = () => {
  // Ensure that localStorage is only accessed on the client-side
  if (typeof window === "undefined") {
    return null;  // Return null during SSR to avoid errors
  }

  const token = localStorage.getItem("token");

  if (!token) {
    return null;  // Return null if no token is available
  }

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return api;
};

export default createAPI;
