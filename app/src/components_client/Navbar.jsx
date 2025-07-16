"use client";

import style from "£$/nav.module.css";
import Menu from "./Menu";
import Search from "./Search";
import Image from "next/image";
import MenuBox from "./MenuBox";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function NavBar() {
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenu((prev) => !prev);
  };

  useEffect(() => {
    // function for outside clicks
    function clickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenu(false);
      }
    }

    if (menu) {
      document.addEventListener("mousedown", clickOutside);
    } else {
      document.removeEventListener("mousedown", clickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [menu]);

  return (
    <>
      <div className={`${style.nav} pt-4 pb-4`} ref={menuRef}>
        <Link href={"/"}>
          <picture>
            <source
              srcSet="/images/CoPlayLight.png"
              media="(prefers-color-scheme: light)"
              alt="CoPlay Logo"
              width={120}
              height={120}
            />
            <Image
              src="/images/CoPlayLogo.png"
              alt="CoPlay Logo"
              media="(prefers-color-scheme: dark)"
              width={120}
              height={120}
            />
          </picture>
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
