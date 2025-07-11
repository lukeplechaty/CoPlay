import Thumbnail from "=/Thumbnail";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-between h-full w-full">
      <section className="flex w-full justify-evenly items-center mb-4">
        <h3>Trending</h3>
        <h3>Newest/Oldest</h3>
        <h3>My Uploads</h3>
      </section>
      <section>
        {/* our map — getVideos? */}
        <Thumbnail />
      </section>
    </main>
  );
}
