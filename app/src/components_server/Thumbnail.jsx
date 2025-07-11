import Image from "next/image";

export default function Thumbnail(props) {
  return (
    <div className="p-2 rounded-2xl bg-slate-800/50">
      {/* tags */}
      <Image
        src={"/placeholder_video.jpg"}
        width={250}
        height={200}
        alt="Play-button"
        className="rounded-lg"
      />
      <section className="flex items-center justify-evenly">
        <div>
          <p className="font-bold text-lg">{props?.title || "Title"}</p>
          <p>{props?.username || "User"}</p>
        </div>
        <p>{props?.views || "0"} Views</p>
        <Vote count={props.votes} />
      </section>
    </div>
  );
}
