import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ?  "https://chat-app-1-s0ea.onrender.com/api "  :  "http://localhost:5001/api" ,
  withCredentials: true,
});