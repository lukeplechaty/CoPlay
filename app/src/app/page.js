import Thumbnail from "=/Thumbnail";
import { getUser, getVideos, searchVideos } from "@/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage({ searchParams }) {
  const searchData = await searchParams;
  const query = searchData?.q || "";
  const sort = searchData?.sort || ``;
  let videoArray = query
    ? await searchVideos(query)
    : await getVideos(100, 0, sort);

  // const { userId } = await auth();
  // let user;
  // if (userId) user = getUser(userId);
  // if (!user) {
  //   redirect(`/user-setup`);
  // }
  return (
    <main className="flex flex-col items-center justify-between h-full w-full">
      <section className="flex w-full justify-evenly items-center mb-4">
        <Link href="?sort=trend">Trending</Link>
        {sort === "asc" ? (
          <Link href="?sort=desc">Newest</Link>
        ) : (
          <Link href="?sort=asc">Oldest</Link>
        )}
        <h3>My Uploads</h3>
      </section>
      <section>
        {videoArray?.map((v) => <Thumbnail key={v.id} video={v} />) || (
          <h2>Post a video and start a trend!</h2>
        )}
      </section>
      <h1>test</h1>
    </main>
  );
}
