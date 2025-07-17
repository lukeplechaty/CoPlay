import { useState } from "react";
import { useSocket } from "@/utils/socket";

export default function ChatboxInput({ room_id, username }) {
  const [input, setInput] = useState("");
  const socket = useSocket();

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
  }

  return (
    <form onSubmit={handleSend} className="flex flex-row items-center gap-2 w-full">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border-none px-2 py-1 text-sm bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-400 h-10"
      />
      <button
        type="submit"
        className="px-3 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Send
      </button>
    </form>
  );
} 