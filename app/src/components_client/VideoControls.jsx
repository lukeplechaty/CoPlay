import { useRef, useEffect, useState } from "react";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaExpand, FaCompress } from "react-icons/fa";
import ChatboxInput from "./ChatboxInput";

export default function VideoControls({ is_host, video_ref, fullscreen, room_id, username }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const volume_ref = useRef(null);
  const seak_ref = useRef(null);

  // Update currentTime, duration, mute, play state
  useEffect(() => {
    function updateTime() {
      if (video_ref.current) {
        setCurrentTime(video_ref.current.currentTime || 0);
        setDuration(video_ref.current.duration || 0);
        setIsMuted(video_ref.current.muted);
        setIsPlaying(!video_ref.current.paused);
      }
    }
    if (video_ref.current) {
      video_ref.current.addEventListener("timeupdate", updateTime);
      video_ref.current.addEventListener("durationchange", updateTime);
      video_ref.current.addEventListener("volumechange", updateTime);
      video_ref.current.addEventListener("play", updateTime);
      video_ref.current.addEventListener("pause", updateTime);
      updateTime();
    }
    return () => {
      if (video_ref.current) {
        video_ref.current.removeEventListener("timeupdate", updateTime);
        video_ref.current.removeEventListener("durationchange", updateTime);
        video_ref.current.removeEventListener("volumechange", updateTime);
        video_ref.current.removeEventListener("play", updateTime);
        video_ref.current.removeEventListener("pause", updateTime);
      }
    };
  }, [video_ref]);

  function handleFullScreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.getElementById(`contaner`).requestFullscreen();
  }
  function handlePlayPause() {
    if (!video_ref.current.paused) video_ref.current.pause();
    else video_ref.current.play();
  }
  function handleMute() {
    video_ref.current.muted = !video_ref.current.muted;
  }
  function handleVolume() {
    video_ref.current.volume = volume_ref.current.value / 100;
  }
  function handleSeak() {
    video_ref.current.currentTime = seak_ref.current.value;
  }

  useEffect(() => {
    if (video_ref.current && volume_ref.current) {
      volume_ref.current.value = video_ref.current.volume * 100;
    }
    if (is_host && video_ref.current && seak_ref.current) {
      seak_ref.current.max = video_ref.current.duration;
      seak_ref.current.value = video_ref.current.currentTime;
    }
  }, [video_ref, is_host]);

  // Format time as mm:ss
  function formatTime(t) {
    if (isNaN(t) || t === Infinity) return "00:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  const playControlsDisabled = is_host !== true;
  const volumeDisabled = is_host === null;


  return (
    <div
      id="controls"
      className={
        `w-full flex flex-col sm:flex-row flex-wrap items-start gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 bg-black/70 backdrop-blur rounded-xl shadow-lg border border-slate-700` +
        (fullscreen ? " absolute bottom-4 left-0 right-0 z-30" : " mt-4 mx-auto")
      }
    >
      <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 w-full flex-wrap">
        <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto flex-1 min-w-0">
          <button
            onClick={handlePlayPause}
            className={`p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400${playControlsDisabled ? " opacity-50" : ""}`}
            aria-label={isPlaying ? "Pause" : "Play"}
            disabled={playControlsDisabled}
          >
            {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
          </button>
          <input
            ref={seak_ref}
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            name="seak"
            onChange={handleSeak}
            className={`w-40 md:w-64 h-2 rounded-lg bg-slate-300 dark:bg-slate-700 appearance-none outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-400${playControlsDisabled ? " opacity-50" : ""}`}
            aria-label="Seek"
            disabled={playControlsDisabled}
          />
          <span className="text-xs text-white font-mono w-20 text-center select-none">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <button
            onClick={handleMute}
            className="p-2 rounded-full bg-gray-600 hover:bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label={isMuted ? "Unmute" : "Mute"}
            disabled={volumeDisabled}
          >
            {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
          </button>
          <input
            ref={volume_ref}
            type="range"
            min={0}
            max={100}
            name="volume"
            onChange={handleVolume}
            className="w-20 h-2 rounded-lg bg-slate-300 dark:bg-slate-700 appearance-none outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-400"
            aria-label="Volume"
            disabled={volumeDisabled}
          />
          <button
            onClick={handleFullScreen}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2"
            aria-label={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
            type="button"
          >
            {fullscreen ? <FaCompress size={24} /> : <FaExpand size={24} />}
          </button>
        </div>
        {room_id && username && (
          <div className="w-full sm:flex-1 min-w-0 sm:mr-4 mb-2 sm:mb-0">
            <ChatboxInput room_id={room_id} username={username} />
          </div>
        )}
      </div>
    </div>
  );
}
