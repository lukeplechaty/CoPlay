import { useSocket } from "@/utils/socket";
import style from "£$/chat.module.css";

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
    <section className={`${style.container} absolute bottom-0`} id="chat">
      <form action={sendMessage} className=" inline bottom-0">
        <input type="text" name="message" />
        <button type="submit">submit</button>
      </form>
    </section>
  );
}
