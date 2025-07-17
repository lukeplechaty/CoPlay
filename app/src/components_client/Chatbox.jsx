"use client";
import { useSocket } from "@/utils/socket";
import { useEffect, useState, useRef } from "react";
export default function Chatbox({ room_id }) {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!socket || !room_id) return;
    const handleRequest = ({ message }) => {
      setMessages((prev) => {
        const newMessages = [...prev, message];
        setTimeout(() => {
          setMessages((current) => current.slice(1));
        }, 10000);
        return newMessages;
      });
    };
    socket.on("chat_update", handleRequest);
    return () => {
      socket.off("chat_update", handleRequest);
    };
  }, [socket, room_id]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="max-h-52 overflow-y-auto bg-slate-800/80 rounded-lg p-3 mt-2 shadow-inner border border-slate-700 absolute bottom-0">
      <ul className="space-y-2">
        {messages.map((msg, idx) => (
          <li
            key={idx}
            className="bg-slate-700 text-white px-4 py-2 rounded-xl w-fit max-w-full break-words shadow-md"
          >
            {msg}
          </li>
        ))}
        <div ref={bottomRef} />
      </ul>
    </div>
  );
}
