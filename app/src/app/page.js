export default function Home() {
  return (
    <main>
      <section className="flex w-full">
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
