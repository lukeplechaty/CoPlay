import Thumbnail from "=/Thumbnail";
import { getVideos } from "@/db";

export default async function HomePage() {
  const videoArray = await getVideos();
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
