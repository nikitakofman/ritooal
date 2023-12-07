"use client";

import Image from "next/image";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";

function Footer() {
  const openNK = () => {
    window.open("https://www.nikitakofman.com", "_blank");
  };
  return (
    <footer>
      <div className="flex justify-center md:flex-row items-center border-t-2 p-5 border-t-[#E2E1E1] bg-[#F9F6F0]">
        {/* <p>bonjour</p> */}
        <div className="max-w-7xl w-full flex items-center justify-end">
          <div className="text-xs">
            <p
              className="text-xs flex font-extralight cursor-pointer text-[#335D79] hover:text-neutral-400"
              onClick={openNK}
            >
              made by nikitakofman.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
