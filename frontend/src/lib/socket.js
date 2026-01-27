import { io } from "socket.io-client";

export const SOCKET_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : "https://chat-app-1-s0ea.onrender.com/api";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false, // important: control when to connect
});
