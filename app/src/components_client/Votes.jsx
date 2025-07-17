"use client";
import { useState } from "react";

export default function Votes({
  video_id,
  initialUpvotes = 0,
  initialDownvotes = 0,
  initialUserVote = null,
  userId,
}) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleVote(direction) {
    setLoading(true);
    setError(null);
    try {
      // If user clicks the same direction as their current vote, unvote
      const unvote =
        (direction === "up" && userVote === true) ||
        (direction === "down" && userVote === false);
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_id,
          direction: unvote ? null : direction,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Voting failed.");
        return;
      }
      setUpvotes(data.upvotes);
      setDownvotes(data.downvotes);
      setUserVote(data.userVote);
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  let message = null;
  let messageClass = "";
  if (error) {
    message = error;
    messageClass = "text-red-500";
  } else if (loading) {
    message = "Voting...";
    messageClass = "text-gray-400";
  } else if (!userId) {
    message = "Sign in to vote";
    messageClass = "text-orange-500";
  }

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-4 items-center">
        <button
          onClick={() => handleVote("up")}
          className={`cursor-pointer px-2 py-1 rounded ${
            userVote === true ? "text-green-500 font-bold" : "text-white"
          } ${
            loading || !userId
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-green-900/30"
          }`}
          disabled={!userId || loading}
        >
          ▲ {upvotes}
        </button>
        <button
          onClick={() => handleVote("down")}
          className={`cursor-pointer px-2 py-1 rounded ${
            userVote === false ? "text-red-500 font-bold" : "text-white"
          } ${
            loading || !userId
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-red-900/30"
          }`}
          disabled={!userId || loading}
        >
          ▼ {downvotes}
        </button>
      </div>
      <div className={`min-h-[1.5em] text-sm mt-1 ${messageClass}`}>
        {message}
      </div>
    </div>
  );
}
