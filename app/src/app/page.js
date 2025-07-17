import Thumbnail from "=/Thumbnail";
import { getUser, getVideos, searchVideos, getUserVideos } from "@/db";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import style from "./tab.module.css";

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
        <Link
          href="?sort=trend"
          className={`${style.tab} ${sort === "trend" ? style.active : ``}`}
        >
          Trending
        </Link>
        {sort === "asc" ? (
          <Link
            href="?sort=desc"
            className={`${style.tab} ${sort === "asc" ? style.active : ``}`}
          >
            Newest
          </Link>
        ) : (
          <Link
            href="?sort=asc"
            className={`${style.tab} ${sort === "desc" ? style.active : ``}`}
          >
            Oldest
          </Link>
        )}
        {DBid > 0 ? (
          <Link
            href={`?user=${DBid}`}
            className={`${style.tab} ${user ? style.active : ``}`}
          >
            My Uploads
          </Link>
        ) : null}
      </section>
      <section className="body">
        {videoArray?.map((v) => (
          <Thumbnail key={v.id} video={v} user={user} />
        )) || <h2>Post a video and start a trend!</h2>}
      </section>
    </main>
  );
}
