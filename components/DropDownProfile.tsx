import { account, ID } from "@/appwrite";
import React from "react";

const DropDownProfile = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
  async function handleLogout() {
    try {
      await account.deleteSession("current");
      window.location.href = "/";
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div
      ref={ref}
      className="flex flex-col text-sm border border-gray-300 rounded-lg dropDownProfile shadow-xl bg-white"
    >
      <ul className="flex flex-col w-full">
        <li className=" cursor-pointer border-b border-gray-300">
          <p className="p-3 hover:text-neutral-400">Profile</p>
        </li>
        <li
          className="cursor-pointer  hover:text-neutral-400"
          onClick={handleLogout}
        >
          <p className="p-3">Logout</p>
        </li>
      </ul>
    </div>
  );
});

export default DropDownProfile;
