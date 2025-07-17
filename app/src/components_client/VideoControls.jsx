import { useRef, useEffect } from "react";

export default function VideoControls({ is_host, video_ref }) {
  function handleFullScreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.getElementById(`contaner`).requestFullscreen();
  }
  function handlePlayPause() {
    if (!video_ref.current.paused) video_ref.current.pause();
    else video_ref.current.play();
  }
  function handleMute() {
    if (!video_ref.current.muted) video_ref.current.muted = true;
    else video_ref.current.muted = false;
  }

  const seak_ref = useRef(null);
  function handleSeak() {
    video_ref.current.currentTime = seak_ref.current.value;
  }
  useEffect(() => {
    seak_ref.current.max = video_ref.current.duration;
    seak_ref.current.value = video_ref.current.currentTime;
    return () => {};
  }, [video_ref]);

  return (
    <div>
      {is_host === true && (
        <>
          <button onClick={handlePlayPause}>play</button>
          <input
            ref={seak_ref}
            type="range"
            min={0}
            max={100}
            name="seak"
            onChange={handleSeak}
          />
        </>
      )}
      <button onClick={handleMute}>mute</button>
      <input type="range" min={0} max={100} name="vomlum" />
      <button onClick={handleFullScreen} className="left-0">
        full Screen
      </button>
    </div>
  );
}
