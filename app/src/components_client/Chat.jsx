import { useSocket } from "@/utils/socket";
import style from "£$/chat.module.css";
import Chatbox from "./Chatbox";

export default function Chat({ room_id, username }) {
  const socket = useSocket();

  async function sendMessage(e) {
    const message = `${username}: ${e.get(`message`).trim()}`;
    if (!socket || !room_id || !message) return;
    socket.emit("chat_update", {
      room_id,
      message,
    });
  }

  return (
    <section className={style.container}>
      {/* bottom of video, Chatbox now displays a list of messages */}
      <form action={sendMessage}>
        <input type="text" name="message" />
        <button type="submit">submit</button>
      </form>
      <Chatbox room_id={room_id} />
    </section>
  );
}
