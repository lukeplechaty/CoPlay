"use client";

import { useEffect, useState, useRef } from "react";
import TagComboBox from "./TagComboBox";

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
      <TagComboBox frameworks={tags} oneTag={oneTag} setOneTag={setOneTag} />
      <label htmlFor="tagval">
        Value
        <input
          type="text"
          name="tagval"
          id="tagval"
          value={oneTag.value}
          onChange={(e) => setOneTag({ ...oneTag, value: e.target.value })}
        />
      </label>
      <button
        onClick={() => setAdd(true)}
        className={add ? "hidden" : ""}
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
