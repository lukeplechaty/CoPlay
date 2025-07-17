"use client";
import { useSocket } from "@/utils/socket";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Chat from "£/Chat";
import Video from "./Video";
import VideoControls from "./VideoControls";

export default function VideoRoomClient({ video_id, room_id, data, username }) {
  const socket = useSocket();
  const [is_host, set_is_host] = useState(null);
  const [accepted, set_accepted] = useState(false);
  const [joining, set_joining] = useState(false);
  const router = useRouter();
  const video_ref = useRef(null);

  useEffect(() => {
    if (!joining) return;
    if (!socket || !room_id) return;

    const handleJoinConfirmed = ({ roomId, socketId }) => {
      if (roomId === room_id) {
        set_accepted(true);
        set_joining(false);
      }
    };
    socket.on("join-room-confirmed", handleJoinConfirmed);

    socket.emit("join-room", room_id);

    return () => {
      socket.off("join-room-confirmed", handleJoinConfirmed);
    };
  }, [joining, socket, room_id]);

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
            onClick={() => set_joining(true)}
            disabled={joining}
          >
            {joining ? "Joining..." : "Accept"}
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={() => router.replace("/")}
            disabled={joining}
          >
            Decline
          </button>
        </div>
      </div>
    );
  } else
    return (
      <div className="my-2 p-2 bg-slate-700 rounded text-white flex flex-col items-center">
        <div className=" flex flex-col mb-4">
          <span>
            Room ID: <b>{room_id}</b>
          </span>
          {is_host ? (
            <span className="text-green-400 mt-1">You are the host</span>
          ) : (
            <span className="text-green-400 mt-1">You are a viewer</span>
          )}
        </div>
        {is_host !== null && (
          <div id="contaner">
            <div className=" w-full h-full justify-center">
              <Video
                video_id={video_id}
                room_id={room_id}
                is_host={is_host}
                data={data}
                video_ref={video_ref}
              />
            </div>
            <Chat room_id={room_id} username={username} />
            <VideoControls
              is_host={is_host}
              video_ref={video_ref}
              className="fixed bottom-0"
            />
          </div>
        )}
      </div>
    );
}
