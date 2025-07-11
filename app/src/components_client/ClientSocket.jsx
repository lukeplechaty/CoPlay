'use client';
import { useSocket } from "@/utils/socket";
import { useEffect } from "react";

export default function SocketHandlerer() {
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on("connect", () =>{
            console.log("Socket connected!");
        });
        socket.on("disconnect", (reason, details) =>{
            console.log("Socket disconnected!");
        });
        
    }, [socket]);

    return null;
}