import Thumbnail from "=/Thumbnail";
import { getUser, getVideos, searchVideos, getUserVideos } from "@/db";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage({ searchParams }) {
  const searchData = await searchParams;
  const query = searchData?.q || ``;
  const sort = searchData?.sort || ``;
  const user = searchData?.user || ``;
  const { userId } = await auth();
  let DBid = -1;
  if (userId) {
    const { id } = await getUser(userId);
    DBid = id;
  }

  async function getVideo() {
    if (query) return await searchVideos(query);
    else if (sort) return await getVideos(sort);
    else if (user) return await getUserVideos(user);
    else return await getVideos(sort);
  }
  const videoArray = await getVideo();

  return (
    <main className="flex flex-col items-center justify-between h-full w-full">
      <section className="flex w-full justify-evenly items-center mb-4">
        <Link href="?sort=trend">Trending</Link>
        {sort === "asc" ? (
          <Link href="?sort=desc">Newest</Link>
        ) : (
          <Link href="?sort=asc">Oldest</Link>
        )}
        {DBid > 0 ? <Link href={`?user=${DBid}`}>My Uploads</Link> : null}
      </section>
      <section className="body">
        {videoArray?.map((v) => <Thumbnail key={v.id} video={v} />) || (
          <h2>Post a video and start a trend!</h2>
        )}
      </section>
    </main>
  );
}
