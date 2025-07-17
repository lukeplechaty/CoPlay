"use client";
import { useEffect, useRef, useCallback, useState } from "react";
import { useSocket } from "@/utils/socket";

export default function Video({ data, video_id, room_id, is_host, video_ref }) {
  const socket = useSocket();
  const url = data?.url || video_id;

  const [video_status, set_video_status] = useState({
    is_playing: false,
    is_paused: true,
    is_buffering: false,
    is_seeking: false,
    current_time: 0,
    duration: 0,
    has_error: false,
  });

  const getCurrentVideoStatus = useCallback(() => {
    if (!video_ref.current) return null;
    return {
      current_time: video_ref.current.currentTime,
      is_playing: !video_ref.current.paused,
      is_paused: video_ref.current.paused,
      is_buffering: video_status.is_buffering,
      is_seeking: video_status.is_seeking,
      duration: video_ref.current.duration,
      has_error: video_status.has_error,
    };
  }, [video_ref, video_status]);

  const handleInteraction = useCallback(
    (e) => {
      if (!is_host) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [is_host]
  );

  const last_emitted_time_ref = useRef(0);
  const emitVideoStatus = useCallback(
    (status) => {
      if (!is_host || !socket || !room_id) return;
      const payload = {
        is_playing: status.is_playing,
        is_paused: status.is_paused,
        is_seeking: status.is_seeking,
        current_time: status.current_time,
      };
      socket.emit("video_status_update", { room_id, status: payload });
    },
    [is_host, socket, room_id]
  );

  const handlePause = useCallback(() => {
    set_video_status((prev) => {
      const updated = { ...prev, is_playing: false, is_paused: true };
      emitVideoStatus(updated);
      return updated;
    });
  }, [emitVideoStatus]);

  const handlePlay = useCallback(() => {
    set_video_status((prev) => {
      const updated = {
        ...prev,
        is_playing: true,
        is_paused: false,
        is_buffering: false,
      };
      emitVideoStatus(updated);
      return updated;
    });
  }, [emitVideoStatus]);

  const handleTimeUpdate = useCallback(() => {
    if (video_ref.current) {
      set_video_status((prev) => {
        const updated = {
          ...prev,
          current_time: video_ref.current.currentTime,
        };
        if (
          Math.abs(
            video_ref.current.currentTime - last_emitted_time_ref.current
          ) >= 1
        ) {
          emitVideoStatus(updated);
          last_emitted_time_ref.current = video_ref.current.currentTime;
        }
        return updated;
      });
    }
  }, [emitVideoStatus]);

  const handleSeeked = useCallback(() => {
    if (video_ref.current) {
      set_video_status((prev) => {
        const updated = {
          ...prev,
          is_seeking: false,
          current_time: video_ref.current.currentTime,
        };
        emitVideoStatus(updated);
        return updated;
      });
    }
  }, [emitVideoStatus]);

  const handleSeeking = useCallback(() => {
    set_video_status((prev) => {
      const updated = { ...prev, is_seeking: true };
      emitVideoStatus(updated);
      return updated;
    });
  }, [emitVideoStatus]);

  useEffect(() => {
    const video = video_ref.current;
    if (!video) return;
    video.addEventListener("pause", handlePause);
    video.addEventListener("play", handlePlay);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("seeking", handleSeeking);
    return () => {
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("seeking", handleSeeking);
    };
  }, [handlePause, handlePlay, handleSeeked, handleSeeking]);

  useEffect(() => {
    // Only log for debugging
  }, [video_status.current_time]);

  useEffect(() => {
    if (!socket || !room_id) return;
    if (!is_host) {
      socket.emit("request_video_status", {
        room_id,
        requester_socket_id: socket.id,
      });
    }
    if (is_host) {
      const responded_ids_ref = { current: new Set() };
      const handleRequest = ({ room_id: req_room_id, requester_socket_id }) => {
        if (req_room_id !== room_id) return;
        if (responded_ids_ref.current.has(requester_socket_id)) return;
        responded_ids_ref.current.add(requester_socket_id);
        const status = getCurrentVideoStatus();
        socket.emit("video_status_response", {
          room_id,
          status,
          target_socket_id: requester_socket_id,
        });
      };
      socket.on("request_video_status", handleRequest);
      return () => {
        socket.off("request_video_status", handleRequest);
        responded_ids_ref.current.clear();
      };
    }
  }, [is_host, socket, room_id, getCurrentVideoStatus]);

  useEffect(() => {
    if (is_host || !socket) return;
    const setup = () => {
      const handleStatusUpdate = ({ status }) => {
        if (!video_ref.current || !status) return;
        video_ref.current.currentTime = status.current_time || 0;
        if (status.is_playing) {
          video_ref.current.play();
        } else {
          video_ref.current.pause();
        }
        set_video_status((prev) => ({
          ...prev,
          ...status,
        }));
      };
      socket.on("video_status_update", handleStatusUpdate);
      return () => {
        socket.off("video_status_update", handleStatusUpdate);
      };
    };
    if (socket.connected) {
      return setup();
    } else {
      socket.once("connect", setup);
      return () => {
        socket.off("connect", setup);
      };
    }
  }, [is_host, socket, video_ref, room_id]);

  return (
    <div className="relative w-fit">
      <video
        ref={video_ref}
        className={`h-[75dvh] max-h-fit w-auto bg-black rounded-2xl ${
          is_host ? "" : "pointer-events-none"
        }`}
        autoPlay={is_host}
        // controls={is_host}
        // controlsList={
        //   is_host
        //     ? "nodownload"
        //     : "nodownload noplaybackrate nofullscreen nofastforward noremoteplayback"
        // }

        // onKeyDown={handleInteraction}
        // onClick={handleInteraction}
        // onContextMenu={handleInteraction}
      >
        <source src={url} type="video/mp4" />
        <p>
          Video failed to load, click <a href={url}>this link</a> instead.
        </p>
      </video>
      <div className="absolute bottom-2.5 left-0 w-full flex justify-center items-center pointer-events-none z-20">
        {is_host ? (
          <></>
        ) : (
          <div className="bg-slate-800/80 text-white px-4 py-1.5 rounded-lg flex items-center gap-3 pointer-events-auto">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              defaultValue={1}
              className="w-24"
              onChange={(e) => {
                if (video_ref.current)
                  video_ref.current.volume = Number(e.target.value);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
