import Thumbnail from "=/Thumbnail";
import { getVideos, searchVideos } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { addUser } from "@/db";

export default async function HomePage({ searchParams }) {
  const searchData = await searchParams;
  const query = searchData?.q || "";
  const videoArray = query ? await searchVideos(query) : await getVideos();

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

  return (
    <main className="flex flex-col items-center justify-between h-full w-full">
      <section className="flex w-full justify-evenly items-center mb-4">
        <h3>Trending</h3>
        <h3>Newest/Oldest</h3>
        <h3>My Uploads</h3>
      </section>
      <section>
        {videoArray?.map((v) => <Thumbnail key={v.id} video={v} />) || (
          <h2>Post a video and start a trend!</h2>
        )}
      </section>
    </main>
  );
}