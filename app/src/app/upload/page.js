import { addVideo, getVideoUrl } from "@/utils/fileupload";
import Image from "next/image";
import DropZone from "£/DropZone";

export default async function UploadPage() {
  const uploadFile = async (formData) => {
    "use server";
    const file = formData.get("file");
    const upload = await addVideo(file.name, file);
    console.log(file.name, upload);
  };
  const getvid = async () => {
    "use server";
    const image = await getVideoUrl("images.jpg");
    console.log("the image isssssssss", image);
    return image;
  };
  return (
    <main className="w-full h-[75dvh] flex flex-col items-center justify-evenly">
      <Image src={getvid()} alt="image" width={100} height={100} />
      <h1 className="font-title text-2xl font-medium">Upload a video</h1>
      <form
        action={uploadFile}
        className="w-full h-full flex flex-col items-center justify-evenly"
      >
        <DropZone />
        {/* <input type="file" placeholder="Browse Files" name="file" id="file" /> */}

        {/* metadata */}

        <button type="submit">Upload</button>
      </form>
    </main>
  );
}
