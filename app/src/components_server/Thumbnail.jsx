import Image from "next/image";
import Link from "next/link";
import Votes from "£/Votes";
import Tag from "£/Tag";
import { getVoteCounts, getUserVote, getUser, removeVideo } from "@/db";
import { auth } from "@clerk/nextjs/server";
import ThumbnailClient from "@/components_client/ThumbnailClient";
import style from "@/components_client/client_component_css/tag.module.css";
import thumbnail from "@/components_server/thumbnail.module.css";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { deleteVideo } from "@/utils/fileupload";

function generateRoomId(length = 8) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}
const getFile = async (url) => {
  "use server";
  const splitted = url.split(
    "https://zqisdwtldxkvgkhmcvus.supabase.co/storage/v1/object/public/Videos/"
  );
  return splitted[1];
};

const deleteVid = async (video) => {
  "use server";
  await removeVideo(video.id);
  await deleteVideo(getFile(video.url));
  // const user = await getUser(user.id);
  // revalidatePath("/");
  redirect(`/`);
};

export default async function Thumbnail({ video, user }) {
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
    <div className={`${thumbnail.body} p-2 rounded-2xl m-3`}>
      <div className={style.tagBox}>
        {Object.entries(grops).length > 0 ? (
          Object.entries(grops).map((tag, index) => (
            <Tag key={index} tagList={tag} />
          ))
        ) : (
          <p className="opacity-50">No Tags</p>
        )}
      </div>
      <ThumbnailClient video={video} />
      <section className={thumbnail.infoBox}>
        <div className={thumbnail.name}>
          <p className={`${thumbnail.title} font-bold text-lg`}>
            {video?.title || "Title"}
          </p>
          {video?.username ? (
            <p className={thumbnail.user}>{video?.username}</p>
          ) : null}
        </div>
        <div className={thumbnail.stats}>
          <div className="mt-2">
            <Votes
              video_id={video?.id}
              initialUpvotes={upvotes}
              initialDownvotes={downvotes}
              initialUserVote={userVote}
              userId={userId}
            />
          </div>

          <p className="text-xs mr-1 opacity-75">{video?.views || "0"} Views</p>
        </div>
      </section>
      {user ? (
        <form className="w-full mt-1" action={deleteVid.bind(null, video)}>
          <button className="px-4 py-1 rounded-2xl bg-red-400 font-bold text-[#081221] w-full cursor-pointer hover:bg-red-500 active:bg-red-800 transition-colors">
            Delete
          </button>
        </form>
      ) : (
        <></>
      )}
    </div>
  );
}
