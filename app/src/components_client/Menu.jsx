import style from "£$/nav.module.css";
import { forwardRef } from "react";

const Menu = forwardRef(({ toggleMenu }, ref) => {
  return (
    <div ref={ref}>
      <button onClick={toggleMenu} className={style.button}>
        Menu
      </button>
    </div>
  );
});

export default Menu;
