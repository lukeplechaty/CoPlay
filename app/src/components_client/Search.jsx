import style from "£$/nav.module.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Search() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const q = value.trim();
    if (q) {
      router.push(`/?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/");
    }
  }

  return (
    <>
      <form className={style.searchBoxForm} onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          placeholder="Search"
          className={style.searchBox}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          type="submit"
          className={`${style.searchButton} text-[#f0f5f9]`}
        >
          Search
        </button>
      </form>
    </>
  );
}
