"use client";
import Image from "next/image";

function generateRoomId(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

export default function ThumbnailClient({ video }) {
  function handleClick(e) {
    e.preventDefault();
    const room_id = generateRoomId();
    window.location.href = `/play/${room_id}/${video.id}`;
  }
  return (
    <a href="#" onClick={handleClick}>
      <Image
        src={"/images/placeholder_video.jpg"}
        width={350}
        height={250}
        alt="Play-button"
        className="rounded-lg cursor-pointer"
      />
    </a>
  );
} 