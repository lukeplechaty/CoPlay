"use client";
import { io as Io } from "socket.io-client";

const SocketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080";

export function useSocket() {
  if (typeof window !== "undefined") {
    if (!window.__coplay_socket) {
      window.__coplay_socket = Io(SocketUrl, {
        autoConnect: true,
      });
    }
    return window.__coplay_socket;
  }

  return null;
}