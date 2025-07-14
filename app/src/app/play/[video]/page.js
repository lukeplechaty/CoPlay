import { getVideo } from "@/db";
import Video from "£/Video";
import Chat from "£/Chat";

export default async function VideoPage({ params }) {
  const { video } = await params;
  const url = getVideo(video);
  return (
    <>
      <main>
        <Video url={url} />
        <Chat />
      </main>
    </>
  );
}
