import style from "£$/nav.module.css";

export default function search() {
  return (
    <>
      <form className={style.searchBoxForm}>
        {/* <label htmlFor="search">Search</label> */}
        <input
          type="text"
          name="search"
          required
          placeholder="Search"
          className={style.searchBox}
        />

        <button type="submit">Search</button>
      </form>
    </>
  );
}
