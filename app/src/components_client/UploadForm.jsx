"use client";

import { useState } from "react";
import AddTag from "£/AddTag";

export default function UploadForm({ submit, fileName, user, tags }) {
  const [tagVals, setTagVals] = useState([]);
  const [title, setTitle] = useState("");

  // strip _uuid from each object
  const cleaned = (arr) =>
    arr.map((a) => {
      const { _uuid, ...rest } = a;
      return { ...rest };
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(fileName, title, cleaned(tagVals), user);
      }}
    >
      <input type="text" name="file" value={fileName} readOnly hidden />

      {/* <input type="text" name="tags" value={cleaned(tagVals)} readOnly hidden /> */}

      <label htmlFor="title">
        Video Title
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <div className="flex flex-col items-center gap-4">
        <AddTag tags={tags} setTagVals={setTagVals} tagVals={tagVals} />
      </div>

      <input type="number" name="user" value={user} readOnly hidden />

      <button type="submit">Upload</button>

      {tagVals.map((tv) => (
        <p key={tagVals.indexOf(tv)}>
          {tv.id} | {tv.value}
        </p>
      ))}
    </form>
  );
}
