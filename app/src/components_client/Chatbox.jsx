"use client";
import { useSocket } from "@/utils/socket";
import { useEffect, useState } from "react";
export default function Chatbox({ room_id }) {
  const socket = useSocket();
  const [message, setMessage] = useState(``);

  useEffect(() => {
    if (!socket || !room_id) return;
    const handleRequest = ({ message }) => {
      setMessage(message);
      setTimeout(() => {
        setMessage(``);
      }, 5000);
    };
    socket.on("chat_update", handleRequest);
    return () => {
      socket.off("chat_update", handleRequest);
    };
  }, [socket, room_id]);

  return (
    <div>
      {/* clear black glass look over bottom of video */}
      <p>{message}</p>
    </div>
  );
}
