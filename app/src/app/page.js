import Thumbnail from "=/Thumbnail";
import { getVideos, searchVideos } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { addUser } from "@/db";
import Link from "next/link";

export default async function HomePage({ searchParams }) {
  const searchData = await searchParams;
  const query = searchData?.q || "";
  let videoArray = query ? await searchVideos(query) : await getVideos();

  // Sorting

  const sort = searchData?.sort;

  if (sort === "asc") {
    videoArray = videoArray.sort((a, b) => a.id - b.id);
  } else if (sort === "desc") {
    videoArray = videoArray.sort((a, b) => b.id - a.id);
  }

  //auth
  const auth_result = await auth();
  const { userId } = auth_result;
  let username = userId;
  if (userId) {
    try {
      const user = await clerkClient.users.getUser(userId);
      username =
        user?.username ||
        user?.firstName ||
        user?.emailAddresses?.[0]?.emailAddress ||
        userId;
      await addUser(userId, username);
    } catch (e) {
      // fallback: just add userId as username
      await addUser(userId, userId);
    }
  }

  // newest/oldest

  return (
    <main className="flex flex-col items-center justify-between h-full w-full">
      <section className="flex w-full justify-evenly items-center mb-4">
        <h3>Trending</h3>
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
