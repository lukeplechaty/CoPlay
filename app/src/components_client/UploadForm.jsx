"use client";

import { useState } from "react";
import AddTag from "£/AddTag";
import navcss from "£$/nav.module.css";
import style from "£$/upload.module.css";

export default function UploadForm({ submit, fileName, user, tags }) {
  const [tagVals, setTagVals] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // strip _uuid from each object
  const cleaned = (arr) =>
    arr.map((a) => {
      const { _uuid, ...rest } = a;
      return { ...rest };
    });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          await submit(fileName, title, cleaned(tagVals), user);
        } finally {
          setLoading(false);
        }
      }}
      className={`h-full flex flex-col items-center justify-evenly p-4 rounded-2xl ${style.card}`}
    >
      <input type="text" name="file" value={fileName} readOnly hidden />

      <label
        htmlFor="title"
        className="flex items-center justify-center gap-2 w-full"
      >
        <p className="">Video Title</p>
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`${style.input} w-1/2`}
          required
          maxLength={30}
        />
      </label>

      <div className="flex flex-wrap min-w-3/4 items-center justify-start gap-x-4 gap-y-8 mt-8">
        <AddTag tags={tags} setTagVals={setTagVals} tagVals={tagVals} />
      </div>

      <input type="number" name="user" value={user} readOnly hidden />

      <button
        type="submit"
        className={`${navcss.searchButton} ${
          loading ? `opacity-50` : ``
        } font-title mt-2`}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
