"use client";

import { useState } from "react";
import { tagLayout } from "@/lib/tagegories";

export default function Tags({ tagList }) {
  const [open, setOpen] = useState(false);

  // TODO — go through all the tags and aggregate them by type
  // aggregate —> split them up into a new array of objects with the values
  // end res —> array we can map through to return each tag group

  /* 
    [[][]]
  */

  const getTagValue = (name) =>
    tagLayout.find((category) => category.name === name);

  const sortTag = (tag) => {
    getTagValue(tag.type).value.push(tag.value);
  };

  tagList.forEach((t) => {
    sortTag(t);
  });

  return (
    <section>
      <div>
        <p>Tags</p>
        <p>Expand/collapse</p>
      </div>
      {open ? (
        <div>
          {/* {tagLayout.map(t => {

          })} */}
        </div>
      ) : (
        <></>
      )}
    </section>
  );
}
