import Image from "next/image";

export default function Thumbnail(props) {
  return (
    <div>
      {/* tags */}
      <Image
        src={"/placeholder_video.jpg"}
        width={150}
        height={100}
        alt="Play-button"
      />
      <section className="flex items-center justify-evenly">
        <div>
          <p>{props.title}</p>
          <p>{props.username}</p>
        </div>
        {/* <Vote/> */}
      </section>
    </div>
  );
}
