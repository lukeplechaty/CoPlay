export default function Video({ url }) {
  return (
    <video
      className="min-h-[50dvh] w-auto bg-black rounded-2xl"
      controls
      controlsList="nodownload"
    >
      <source src={url} />
      {/* will only show when <source> fails */}
      <p>
        Video failed to load, click <a href={url}>this link</a> instead.
      </p>
    </video>
  );
}
