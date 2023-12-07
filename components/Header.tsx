"use client";

import Image from "next/image";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect, useRef, useState } from "react";
import fetchSuggestion from "@/lib/fetchSuggestion";
import { account, ID } from "@/appwrite";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DropDownProfile from "./DropDownProfile";
import Link from "next/link";

function Header() {
  const userId = useBoardStore((state) => state.userId);
  const dropdownRef: any = useRef(null);

  useEffect(() => {}, [userId]);

  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    if (board.columns.size === 0) return;
    setLoading(true);

    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board);
      setSuggestion(suggestion);
      setLoading(false);
    };
    fetchSuggestionFunc();
  }, [board]);

  useEffect(() => {
    getUser();
  }, []);

  function handleClickOutside(event: any) {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenProfile(false);
    }
  }

  useEffect(() => {
    if (openProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openProfile]);

  const [email, setEmail] = useState("");

  async function getUser() {
    try {
      const userData = await account.get();
      setUser(userData);
      setEmail(userData.email);
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setLoadingUser(false); // Set loading to false after fetching user data or on error
    }
  }

  // useEffect(() => {
  //   if (!loadingUser && user === null) {
  //     window.location.href = "/";
  //   }
  // }, [user, loadingUser]);

  async function handleLogout() {
    try {
      await account.deleteSession("current");
      setUser(null);
      window.location.href = "/";
    } catch (e) {
      console.error(e);
    }
  }

  function LoadingSpinner() {
    return (
      <svg
        className="animateSpin ml-1 mr-3 h-5 w-5 text-black"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 0116 0H4z"
        ></path>
      </svg>
    );
  }

  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F8F0E5]">
        <div className="p-6 max-w-sm w-full flex items-center justify-center rounded-lg text-center">
          <img
            src="/loading.png"
            className="h-10 w-10 text-[black] mt-2 animate-spin"
          />
        </div>
      </div>
    );
  }

  return (
    <header>
      <div className="flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center w-full justify-between border-b-2 border-b-[#102C57]/10 p-3 bg-[#FAF6F0] ">
          {/* <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br bg-sky-800 rounded-md filter blur-3xl opacity-50 -z-50" /> */}
          <div className="w-full flex justify-between items-center">
            <div className="pl-0 md:pl-3 ">
              <Image
                src="/ritooallogo.png"
                alt="Ritooal Logo"
                width={300}
                height={100}
                className="w-24 md:w-24 pb-5 md:pb-0 object-contain"
              />
            </div>
            <div
              className="flex cursor-pointer hover:text-neutral-200 "
              onClick={() => setOpenProfile((prev) => !prev)}
            >
              {/* <p className="mr-2">{user.email}</p> */}
              <FontAwesomeIcon
                icon={faUser}
                className="h-5 w-5 pb-5 flex md:hidden ml-3 pr-5 "
              />
            </div>
          </div>
          <div className="w-full">
            <div className="flex flex-wrap items-center space-x-5 flex-1 justify-center w-full">
              <form className="flex items-center space-x-5 bg-white rounded-md border-2 shadow-md flex-1 md:flex-initial">
                <MagnifyingGlassIcon className="h-5 w-5 ml-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                  className="flex-1 outline-none p-2"
                />
                <button type="submit" hidden>
                  Search
                </button>
              </form>
            </div>
          </div>
          <div className="w-full">
            <div className="flex  justify-center items-end flex-col text-[#345D79] ">
              <div
                className="flex cursor-pointer hover:text-neutral-500"
                onClick={() => setOpenProfile((prev) => !prev)}
              >
                {/* <p className="mr-2">{user.email}</p> */}
                <FontAwesomeIcon
                  icon={faUser}
                  className="h-5 w-5 hidden md:flex ml-3 pr-5 "
                />
              </div>
              {openProfile && <DropDownProfile ref={dropdownRef} />}
              {/* <p className="mt-2 mr-3">{email}</p> */}
              {/* <button
              className="h-8 px-4 mt-2 text-sm text-indigo-100 transition-colors duration-150 bg-[#335E7F] rounded-lg focus:shadow-outline hover:bg-[#335E7F]/80"
              onClick={handleLogout}
            >
              LOGOUT
            </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <p className="flex items-center p-5 text-sm text-center font-light pr-5 rounded-xl w-fit bg-[#FFFDFC] max-w-3xl text-[black]/70">
          {/* <img
            src="/loading.png"
            className={` h-10 w-10 text-[black] mr-1 ${
              loading && "animate-spin"
            }`}
          /> */}

          <img
            src="/loading.png"
            className={
              loading ? "h-10 w-10 text-[black] mr-2 animate-spin" : "hidden"
            }
          />

          {/* <UserCircleIcon
            className={`inline-block h-10 w-10 text-[black] mr-1 ${
              loading && "animate-spin"
            }`}
          /> */}
          {suggestion && !loading
            ? suggestion
            : "Summarising your tasks for the day..."}
        </p>
      </div>
    </header>
  );
}

export default Header;
