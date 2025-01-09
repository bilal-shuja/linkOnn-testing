import axios from "axios";

const createAPI = () => {
  if (typeof window === "undefined") {
    return null; 
  }

  const token = localStorage.getItem("token");

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

  return api;
};

export default createAPI;
