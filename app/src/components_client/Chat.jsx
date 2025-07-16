import { useSocket } from "@/utils/socket";
import style from "£$/chat.module.css";
import Chatbox from "./Chatbox";

export default function Chat({ room_id }) {
  const socket = useSocket();

  async function sendMessage(e) {
    const message = e.get(`message`).trim();
    if (!socket || !room_id) return;
    socket.emit("chat_update", {
      room_id,
      message,
    });
  }

  return (
    <section className={style.container}>
      {/* bottom of video */}
      <form action={sendMessage}>
        <input type="text" name="message" />
        <button type="submit">submit</button>
      </form>
      <Chatbox room_id={room_id} />
    </section>
  );
}
