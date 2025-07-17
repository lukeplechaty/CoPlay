"use client";

import { useEffect, useState, useRef } from "react";
import TagComboBox from "./TagComboBox";
import style from "£$/upload.module.css";
import navcss from "£$/nav.module.css";

export default function AddTag({ tags, setTagVals, tagVals }) {
  const idRef = useRef(crypto.randomUUID());
  const [add, setAdd] = useState(false);
  const [oneTag, setOneTag] = useState({
    id: "",
    value: "",
    _uuid: idRef.current,
  });

  // everytime oneTag changes, update the array of tags
  useEffect(() => {
    setTagVals((prev) => {
      const index = prev.findIndex((tag) => tag._uuid === idRef.current);
      // new item —> append to array
      if (index === -1) {
        return [...prev, oneTag];
      } else {
        // update array
        const updated = [...prev];
        updated[index] = oneTag;
        return updated;
      }
    });
  }, [oneTag]);

  return (
    <>
      <fieldset className="flex flex-col gap-2 items-center">
        <TagComboBox frameworks={tags} oneTag={oneTag} setOneTag={setOneTag} />
        <label
          htmlFor="tagval"
          className="flex flex-col items-start justify-center "
        >
          <p className="p-0 m-0 ml-1 text-sm">Value</p>
          <input
            type="text"
            name="tagval"
            id="tagval"
            value={oneTag.value}
            onChange={(e) => setOneTag({ ...oneTag, value: e.target.value })}
            className={style.input}
          />
        </label>
      </fieldset>

      <button
        onClick={() => setAdd(true)}
        className={`${navcss.button} ${add ? "hidden" : ""} font-title`}
        type="button"
      >
        Add Tag
      </button>

      {/* add tag on button press */}
      {add ? (
        <AddTag tags={tags} setTagVals={setTagVals} tagVals={tagVals} />
      ) : (
        <></>
      )}
    </>
  );
}
