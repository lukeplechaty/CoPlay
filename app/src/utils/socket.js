"use client";
import { useRef } from "react";
import { io as Io } from "socket.io-client";

const SocketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080";

export function useSocket() {
  const SocketRef = useRef();
  if (!SocketRef.current) {
    SocketRef.current = Io(SocketUrl, {
      autoConnect: true,
    });
  }
  return SocketRef.current;
}