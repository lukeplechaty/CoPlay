import Image from "next/image";
import Link from "next/link";
import Votes from "£/Votes";
import Tag from "£/Tag";
import { getVoteCounts, getUserVote, getUser } from "@/db";
import { auth } from "@clerk/nextjs/server";
import ThumbnailClient from "@/components_client/ThumbnailClient";
import style from "@/components_client/client_component_css/tag.module.css";

function generateRoomId(length = 8) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

export default async function Thumbnail({ video }) {
  const grops = video.tags.reduce((result, obj) => {
    (result[obj.type] = result[obj.type] || []).push(obj);
    return result;
  }, {});
  const { userId } = await auth();
  let upvotes = 0,
    downvotes = 0,
    userVote = null;
  if (userId) {
    const user = await getUser(userId);
    if (user) {
      userVote = await getUserVote(video.id, user.id);
    }
  }
  const counts = await getVoteCounts(video.id);
  upvotes = counts.upvotes;
  downvotes = counts.downvotes;

  return (
    <div className="p-2 rounded-2xl bg-slate-800/50 m-3">
      <div className={style.tagBox}>
        {Object.entries(grops).map((tag, index) => (
          <Tag key={index} tagList={tag} />
        ))}
      </div>
      <ThumbnailClient video={video} />
      <section className="flex items-center justify-evenly">
        <div>
          <p className="font-bold text-lg">{video?.title || "Title"}</p>
          <p>{video?.username || "User"}</p>
        </div>
        <p>{video?.views || "0"} Views</p>
        <Votes
          video_id={video?.id}
          initialUpvotes={upvotes}
          initialDownvotes={downvotes}
          initialUserVote={userVote}
          userId={userId}
        />
      </section>
    </div>
  );
}
