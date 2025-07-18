"use client";

import style from "@/components_client/client_component_css/tag.module.css";

import { useState } from "react";
import { tagLayout } from "@/lib/tagegories";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Tags({ tagList }) {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  // TODO — go through all the tags and aggregate them by type
  // aggregate —> split them up into a new array of objects with the values
  // end res —> array we can map through to return each tag group

  /* 
    [[][]]
  */

  // const getTagValue = (name) =>
  //   tagLayout.find((category) => category.name === name);

  // const sortTag = (tag) => {
  //   getTagValue(tag.type)?.value?.push(tag.value);
  // };

  // tagList.forEach((t) => {
  //   sortTag(t);
  // });

  //console.log(tagList);

  return (
    <section className={style.tagBox}>
      <Popover>
        <PopoverTrigger className={style.tagList}>{tagList[0]}s</PopoverTrigger>
        <PopoverContent className={style.popoverContent} side="right">
          <div className={style.popBox}>
            <div className={style.tagResult}>
              {/* {tagLayout.map(t => {

          })} */}
              {tagList[1].map((v, index) => (
                <p key={v.id || index}>{v.value}</p>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </section>
  );
}
