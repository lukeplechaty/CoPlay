"use client";
export default function DropZone() {
  const handleDrag = (e) => {
    e.preventDefault();

    [...e.dataTransfer.files].forEach((file) => {
      console.log(`${file.name} dropped`);
      // TODO — store the file temporarily before it is submitted
    });
  };

  return (
    <section
      className="w-1/2 h-1/2 bg-acc/50 border-dashed border-4 border-txt rounded-2xl
      flex flex-col items-center justify-center font-bold active:brightness-150"
      onDrop={handleDrag}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => document.getElementById("file").click()}
    >
      <label htmlFor="file">
        <h1>Drag your file here</h1>
        <h2 className="text-sm text-center font-light">or click to browse</h2>
      </label>
      <input
        type="file"
        placeholder="Browse Files"
        name="file"
        id="file"
        className="hidden"
      />
    </section>
  );
}
