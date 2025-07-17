"use client";
import { useSocket } from "@/utils/socket";
import { useEffect, useState, useRef } from "react";

export default function Chatbox({ room_id, overlay, username, hideInput, onSendMessage }) {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
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

  function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    let msg = input;
    if (username) {
      msg = `${username}: ${input}`;
    }
    if (socket && room_id) {
      socket.emit("chat_update", { room_id, message: msg });
      setInput("");
    }
    if (onSendMessage) onSendMessage(msg);
  }

  // Only apply transparent container if overlay, otherwise keep card style
  const rootClass = overlay
    ? "w-full max-w-md mx-auto flex flex-col mt-4 mb-4"
    : "w-full max-w-md mx-auto bg-white/90 dark:bg-slate-800/90 rounded-2xl shadow-xl flex flex-col mt-4 mb-4 border border-slate-200 dark:border-slate-700";

  return (
    <div className={rootClass}>
      {!overlay && (
        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 text-lg font-semibold text-slate-700 dark:text-white rounded-t-2xl bg-slate-100 dark:bg-slate-900">
          Live Chat
        </div>
      )}
      <div className={overlay ? "flex-1 overflow-y-auto px-0 py-0 space-y-2 min-h-[120px] max-h-64" : "flex-1 overflow-y-auto px-4 py-2 space-y-2 min-h-[120px] max-h-64"}>
        {messages.length === 0 && !overlay && (
          <div className="text-slate-400 text-center text-sm">No messages yet.</div>
        )}
        {messages.map((msg, idx) => {
          // If message is in the form 'username: message', split and style
          const match = msg.match(/^([^:]+):\s*(.*)$/);
          return (
            <div
              key={idx}
              className={overlay ? "p-0 m-0 bg-transparent border-none shadow-none" : "backdrop-blur bg-black/30 border border-slate-500 text-slate-100 px-3 py-2 rounded-xl shadow-sm w-fit max-w-full break-words"}
              style={overlay ? { background: "none", border: "none", boxShadow: "none" } : {}}
            >
              {match ? (
                <>
                  <span className="font-bold text-blue-300 mr-2">{match[1]}</span>
                  <span>{match[2]}</span>
                </>
              ) : (
                msg
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      {!hideInput && (
        <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-b-2xl">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}
