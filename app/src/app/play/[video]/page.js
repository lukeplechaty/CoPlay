import { getVideo } from "@/db";
import Video from "£/Video";
import Chat from "£/Chat";

export default async function VideoPage({ params }) {
  const { video } = await params;
  const url = getVideo(video);
  return (
    <>
      <main className="w-full h-full flex flex-col items-center justify-center">
        <Video url={url} />
        <Chat />
      </main>
    </>
  );
}
