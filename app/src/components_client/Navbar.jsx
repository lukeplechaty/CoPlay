"use client";

import style from "£$/nav.module.css";
import Menu from "./Menu";
import Search from "./Search";
import Image from "next/image";
import MenuBox from "./MenuBox";

import { useState } from "react";
import Link from "next/link";

export default function NavBar() {
  // useState to toggle menu open/close
  const [menu, setMenu] = useState(false);

  const toggleMenu = () => {
    setMenu((prev) => !prev);
  };
  // ===========================================
  return (
    <>
      <div className={`${style.nav} pt-4 pb-4`}>
        <Link href={"/"}>
          <Image
            src={"/images/CoPlayLogo.png"}
            alt={"CoPlay Logo"}
            width={100}
            height={100}
          />
        </Link>
        <Search />
        <Menu toggleMenu={toggleMenu} />
      </div>
      <div className={style.navBackLayer}>
        <MenuBox menu={menu} />
      </div>
    </>
  );
}
