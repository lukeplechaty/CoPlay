import Thumbnail from "=/Thumbnail";
import { getVideos, searchVideos } from "@/db";
import Link from "next/link";

export default async function HomePage({ searchParams }) {
  const searchData = await searchParams;
  const query = searchData?.q || "";
  const sort = searchData?.sort || ``;
  let videoArray = query ? await searchVideos(query) : await getVideos(sort);

  console.log(videoArray);
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
