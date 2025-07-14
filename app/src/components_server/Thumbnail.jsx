import Image from "next/image";
import Link from "next/link";
import Votes from "./Votes";
import Tag from "../components_client/Tag";
import { getVoteCounts, getUserVote, getUser } from "@/db";
import { auth } from "@clerk/nextjs/server";

export default async function Thumbnail({ video }) {
  const grops = video.tags.reduce((result, obj) => {
    (result[obj.type] = result[obj.type] || []).push(obj);
    return result;
  }, {});
  const { userId } = await auth();
  let upvotes = 0, downvotes = 0, userVote = null;
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
    <div className="p-2 rounded-2xl bg-slate-800/50">
      {Object.entries(grops).map((tag, index) => (
        <Tag key={index} tagList={tag} />
      ))}
      <Link href={`/play/${video.id}`}>
        <Image
          src={"/images/placeholder_video.jpg"}
          width={350}
          height={250}
          alt="Play-button"
          className="rounded-lg"
        />
      </Link>
      <section className="flex items-center justify-evenly">
        <div>
          <p className="font-bold text-lg">{video?.title || "Title"}</p>
          <p>{video?.username || "User"}</p>
        </div>
        <p>{video?.views || "0"} Views</p>
        <Votes video_id={video?.id} initialUpvotes={upvotes} initialDownvotes={downvotes} initialUserVote={userVote} userId={userId} />
      </section>
    </div>
  );
}
