export default async function Video({ data }) {
  const { url } = await data;
  return (
    <video
      className="h-[75dvh] max-h-fit w-auto bg-black rounded-2xl"
      autoPlay
      controls
      controlsList="nodownload"
    >
      <source src={url} type="video/mp4" />
      {/* will only show when <source> fails */}
      <p>
        Video failed to load, click <a href={url}>this link</a> instead.
      </p>
    </video>
  );
}
