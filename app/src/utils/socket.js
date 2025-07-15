"use client";
import { io as Io } from "socket.io-client";

const SocketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080";

// Create a single socket instance for the whole app
let socket;

export function useSocket() {
  if (!socket) {
    socket = Io(SocketUrl, {
      autoConnect: true,
    });
  }
  return socket;
}