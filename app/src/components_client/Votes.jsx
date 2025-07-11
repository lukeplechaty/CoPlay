"use client";

export default function Votes({ votes }) {
  return (
    <div className="flex gap-4 items-center">
      <span /* onClick={handleVote.bind(1)} */>+</span>
      <p>{votes || 0}</p>
      <span /* onClick={handleVote.bind(-1)} */>-</span>
    </div>
  );
}
