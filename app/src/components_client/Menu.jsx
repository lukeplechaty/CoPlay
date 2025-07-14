import style from "£$/nav.module.css";

export default function Menu({ toggleMenu }) {
  return (
    <div>
      <button onClick={toggleMenu} className={style.button}>
        Menu
      </button>
    </div>
  );
}
