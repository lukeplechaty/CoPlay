export default function Video({ url }) {
  return (
    <video
      className="w-dvw min-h-fit bg-black"
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
