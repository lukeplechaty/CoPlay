"use client";
import { useSocket } from "@/utils/socket";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Chat from "£/Chat";
import Video from "./Video";

export default function VideoRoomClient({ video_id, room_id, data, username }) {
  const socket = useSocket();
  const [is_host, set_is_host] = useState(null);
  const [accepted, set_accepted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!accepted) return;
    if (!socket || !room_id) return;

    const join = () => {
      socket.emit("join-room", room_id);
      console.log("[Client] Joined room", room_id, "with socket id", socket.id);
    };

    if (socket.connected) {
      join();
    } else {
      socket.once("connect", join);
      return () => {
        socket.off("connect", join);
      };
    }

    const handleBeforeUnload = () => {
      socket.emit("leave-room", room_id);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    const handleHostAssigned = (host_status) => {
      set_is_host(host_status);
    };
    socket.on("host-assigned", handleHostAssigned);

    const handleRoomClosed = () => {
      router.replace("/");
    };
    socket.on("room-closed", handleRoomClosed);

    return () => {
      socket.emit("leave-room", room_id);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.off("host-assigned", handleHostAssigned);
      socket.off("room-closed", handleRoomClosed);
    };
  }, [socket, room_id, router, accepted]);

  if (!accepted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
        <div className="bg-slate-800 p-6 rounded shadow-lg text-center">
          <h2 className="text-xl mb-4">Join Room?</h2>
          <p className="mb-6">
            Do you want to join room <b>{room_id}</b>?
          </p>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2"
            onClick={() => set_accepted(true)}
          >
            Accept
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => router.replace("/")}
          >
            Decline
          </button>
        </div>
      </div>
    );
  } else
    return (
      <div className="my-2 p-2 bg-slate-700 rounded text-white flex flex-col items-center">
        <span>
          Room ID: <b>{room_id}</b>
        </span>
        {is_host === true && (
          <span className="text-green-400 mt-1">You are the host</span>
        )}
        {is_host !== null && (
          <div className="w-full flex justify-center mt-4">
            <Video
              video_id={video_id}
              room_id={room_id}
              is_host={is_host}
              data={data}
            />
            <Chat room_id={room_id} username={username} />
          </div>
        )}
      </div>
    );
}
