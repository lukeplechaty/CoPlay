import Image from "next/image";
import Link from "next/link";
import Votes from "£/Votes";
import Tag from "../components_client/Tag";

export default function Thumbnail({ video }) {
  const grops = video.tags.reduce((result, obj) => {
    (result[obj.type] = result[obj.type] || []).push(obj);
    return result;
  }, {});
  return (
    <div className="p-2 rounded-2xl bg-slate-800/50">
      {Object.entries(grops).map((tag, index) => (
        <Tag key={index} tagList={tag} />
      ))}
      {/* <Tag tagList={video.tags} /> */}
      <Link href={"/"}>
        <Image
          src={"/images/placeholder_video.jpg"}
          width={350}
          height={250}
          alt="Play-button"
          className="rounded-lg"
        />
      </Link>

      <section className="flex items-center justify-evenly">
        <div>
          <p className="font-bold text-lg">{video?.title || "Title"}</p>
          <p>{video?.username || "User"}</p>
        </div>
        <p>{video?.views || "0"} Views</p>
        <Votes count={video?.votes} />
      </section>
    </div>
  );
}
