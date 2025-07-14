import { getVideo } from "@/db";
import Video from "£/Video";
import Chat from "£/Chat";

export default async function VideoPage({ params }) {
  const { video } = await params;
  const data = await getVideo(video);
  return (
    <>
      <main className="w-full h-full flex flex-col items-center justify-center mt-4">
        <Video data={data} />
        <Chat />
      </main>
    </>
  );
}
