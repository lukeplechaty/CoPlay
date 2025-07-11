import Image from "next/image";
import Link from "next/link";
import Votes from "£/Votes";

export default function Thumbnail(props) {
  return (
    <div className="p-2 rounded-2xl bg-slate-800/50">
      {/* tags */}
      <Link href={"/"}>
        <Image
          src={"/placeholder_video.jpg"}
          width={350}
          height={250}
          alt="Play-button"
          className="rounded-lg"
        />
      </Link>

      <section className="flex items-center justify-evenly">
        <div>
          <p className="font-bold text-lg">{props?.title || "Title"}</p>
          <p>{props?.username || "User"}</p>
        </div>
        <p>{props?.views || "0"} Views</p>
        <Votes count={props?.votes} />
      </section>
    </div>
  );
}
