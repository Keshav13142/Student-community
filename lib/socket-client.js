import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_MESSAGE_SOCKET_SERVER_URL, {
  withCredentials: true,
  autoConnect: false,
});
