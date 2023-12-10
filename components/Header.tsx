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
import Swal from "sweetalert2";
import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { useDarkMode } from "../contexts/DarkModeProvider";
import "sweetalert2/src/sweetalert2.scss"; // Default SweetAlert2 style
// import "@sweetalert2/theme-dark/dark.css"; // Dark theme

function Header() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  function showAlert(options) {
    // Apply the dark theme options only if darkMode is true
    const swalOptions = darkMode
      ? {
          ...options,
          customClass: {
            ...options.customClass,
            popup: "swal2-dark",
          },
        }
      : options;

    return Swal.fire(swalOptions);
  }

  const userId = useBoardStore((state) => state.userId);
  const dropdownRef: any = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {}, [userId]);

  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);

  const [isGoogle, setIsGoogle] = useState(false);

  console.log(isGoogle);

  useEffect(() => {
    async function fetchSession() {
      try {
        const session = await account.getSession("current");
        console.log("thos", session);
        if (session.provider === "google") {
          setIsGoogle(true);
        }
        // Additional logic to handle session data...
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    }

    fetchSession();
  }, []);

  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [openProfile, setOpenProfile] = useState(false);

  console.log("this", user);

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

  // console.log(user.emailVerification);
  // if (user.emailVerification === false) {
  // }

  async function getUser() {
    try {
      const userData = await account.get();
      setUser(userData);
      setEmail(userData.email);

      if (!userData.emailVerification) {
        showAlert({
          title: "Email Verification Needed",
          text: "Please check your email to verify your account. Click below to resend the verification email.",
          icon: "warning",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Resend Email",
        }).then((result) => {
          if (result.isConfirmed) {
            resendVerificationEmail();
          } else {
            account.deleteSession("current");
            setUser(null);
            window.location.href = "/";
          }
        });
      }
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }

  console.log(user);

  async function resendVerificationEmail() {
    console.log("hello");
    console.log(user);
    try {
      const result = await account.createVerification(
        "https://ritooal.com/verify"
      );

      console.log(result);
      showAlert({
        title: "Sent!",
        text: "Verification email has been resent. Please check your inbox.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      account.deleteSession("current");
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      console.log(error);
      showAlert({
        title: "Error",
        text: "Failed to resend verification email.",
        icon: "error",
      });
      account.deleteSession("current");
      setUser(null);
      window.location.href = "/";
    }
  }

  useEffect(() => {
    if (!loadingUser && user === null) {
      window.location.href = "/";
    }
  }, [user, loadingUser]);

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
      <div className="flex justify-center items-center h-screen bg-[#F8F0E5] dark:bg-[#1A1F24]">
        <div className="p-6 max-w-sm w-full flex items-center justify-center rounded-lg text-center">
          <img
            src="/loading.png"
            className="h-10 w-10 text-[black] mt-2 animate-spin"
          />
        </div>
      </div>
    );
  }

  const deleteAccount = async () => {
    showAlert({
      title: "Are you sure?",
      text: "This will delete your account and all your tasks. You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ED5E68",
      cancelButtonColor: "#6E7881",
      confirmButtonText: "Yes, delete account",
      showCloseButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Replace this URL with your Appwrite function's endpoint
          // const functionEndpoint =
          //   "https://cloud.appwrite.io/v1/functions/65734ae52ec9790d02eb/executions";
          console.log(user.$id);
          const response = await fetch("/api/deleteUsera", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          });

          if (!response.ok) {
            throw new Error("Failed to delete account");
          }

          // Show success message
          showAlert({
            title: "Deleted!",
            text: "Your account has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          window.location.href = "/";
        } catch (error) {
          // Handle errors
          console.error("Error deleting account:", error);
          Swal.fire(
            "Failed!",
            "There was a problem deleting your account.",
            "error"
          );
        }
      }
    });
  };

  async function handleChangePassword() {
    if (!currentPassword || !newPassword) {
      Swal.fire({
        title: "Error",
        text: "Please enter all required fields.",
        icon: "error",
        confirmButtonColor: "#52B0DB", // Set your desired color here
      });
      return;
    }

    try {
      // Call the updatePassword method from Appwrite SDK
      await account.updatePassword(newPassword, currentPassword);
      Swal.fire({
        title: "Success",
        text: "Your password has been changed.",
        icon: "success",
        confirmButtonColor: "#52B0DB", // Set your desired color here
      });
      // Clear the input fields
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      Swal.fire({
        title: "Error",
        text: "Incorrect current password or passwords don't match.",
        icon: "error",
        confirmButtonColor: "#52B0DB", // Set your desired color here
      });
      setCurrentPassword("");
      setNewPassword("");
    }
  }

  return (
    <header>
      <div className="flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center w-full justify-between border-b-2 border-b-[#102C57]/10 p-3 bg-[#FAF6F0] dark:bg-[#272C35] ">
          {/* <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br bg-sky-800 rounded-md filter blur-3xl opacity-50 -z-50" /> */}
          <div className="w-full flex justify-between items-center">
            <div className="pl-0 md:pl-3 ">
              <Image
                src={`/ritooallogo${darkMode ? "white" : ""}.png`}
                alt="Ritooal Logo"
                width={300}
                height={100}
                className="w-24 md:w-24 pb-3 md:pb-0 object-contain"
              />
            </div>
            <div className="flex cursor-pointer text-[#345D79]  ">
              {/* <p className="mr-2 italic flex md:hidden text-[14px]">
                {user.email}
              </p> */}
              <FontAwesomeIcon
                onClick={toggleDarkMode}
                icon={faCircleHalfStroke}
                className="mr-3 h-5 hover:text-neutral-500 dark:text-white  dark:hover:text-neutral-300 flex md:hidden cursor-pointer"
              />

              <FontAwesomeIcon
                icon={faUser}
                className="h-5 w-5 pb-3 flex md:hidden dark:text-white hover:text-neutral-500 dark:hover:text-neutral-300 ml-1 pr-5 "
                onClick={() => setOpenProfile((prev) => !prev)}
              />
            </div>
          </div>
          <div className="w-full">
            <div className="flex flex-wrap items-center space-x-5 flex-1 justify-center w-full">
              <form className="flex items-center space-x-5 bg-white dark:bg-[#1A1F24]  rounded-md border-2 dark:border-[#77777F] shadow-md flex-1 md:flex-initial">
                <MagnifyingGlassIcon className="h-5 w-5 ml-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                  className="flex-1 outline-none bg-transparent dark:text-white p-2"
                />
                <button type="submit" hidden>
                  Search
                </button>
              </form>
            </div>
          </div>
          <div className="w-full">
            <div className="flex  justify-center items-end flex-col text-[#345D79] ">
              <div className="flex items-center">
                <FontAwesomeIcon
                  onClick={toggleDarkMode}
                  icon={faCircleHalfStroke}
                  className="mr-3 h-5 hover:text-neutral-500 dark:text-white dark:hover:text-neutral-300 hidden md:flex cursor-pointer"
                />

                <FontAwesomeIcon
                  icon={faUser}
                  onClick={() => setOpenProfile((prev) => !prev)}
                  className="h-5 w-5 hidden hover:text-neutral-500 cursor-pointer dark:hover:text-neutral-300 dark:text-white md:flex ml-1 pr-5 "
                />
              </div>
              {openProfile && (
                <DropDownProfile
                  ref={dropdownRef}
                  onProfileClick={toggleModal}
                />
              )}
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
        <div className="flex flex-col items-center justify-center">
          <Image
            height={400}
            width={600}
            alt="tutorial"
            src={`/tutorial${darkMode ? "white" : ""}.png`}
            className="mt-3"
          />
          <p className="flex items-center p-5 text-sm text-center font-light pr-5 rounded-xl w-fit bg-[#FFFDFC] dark:bg-[#1A2024] max-w-3xl dark:text-white text-[black]/70">
            {/* <img
            src="/loading.png"
            className={` h-10 w-10 text-[black] mr-1 ${
              loading && "animate-spin"
            }`}
          /> */}

            <img
              src={`/loading${darkMode ? "white" : ""}.png`}
              className={
                loading
                  ? "h-10 w-10 text-[black] dark:text-white mr-2 animate-spin"
                  : "hidden"
              }
            />

            {/* <UserCircleIcon
            className={`inline-block h-10 w-10 text-[black] mr-1 ${
              loading && "animate-spin"
            }`}
          /> */}
            {suggestion && !loading
              ? suggestion
              : "Generating tip of the day..."}
          </p>
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-75 z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-[#FFFDFC] dark:bg-[#272C35] min-w-[300px] min-h-[400px] max-w-3xl  p-8 w-9/12 flex md:flex-row flex-col items-center justify-center rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col w-full min-w-[352px] items-center justify-center">
              <div
                className={`flex flex-col w-full min-w-[352px] items-center justify-between space-y-4`}
              >
                <div className="text-2xl font-bold text-[#355D7B] dark:text-white text-center">
                  Your profile
                </div>
                {!isGoogle && (
                  <p className="font-semibold mb-4 dark:text-white">
                    {user.email}
                  </p>
                )}
                {isGoogle ? (
                  <>
                    <div className="w-[200px] border flex items-center bg-white p-1 rounded-full">
                      <img src="google.png" className="w-10 h-10" />
                      <p className="text-xs ml-1 font-semibold">{user.email}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mb-4 text-md dark:text-white">
                      Change your password
                    </p>
                    <form className="flex flex-col items-center w-9/12 space-y-4">
                      <input
                        type="password"
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="h-10 p-3 space-x-5 min-w-[270px] bg-white rounded-md border-2 outline-none"
                      />
                      <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="h-10 p-3 space-x-5 min-w-[270px] bg-white rounded-md border-2 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleChangePassword}
                        className="h-10 bg-[#22C55D] text-white min-w-[270px] rounded-md hover:bg-[#16A349] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        Confirm
                      </button>
                    </form>
                  </>
                )}
                <p
                  className="mt-4 md:flex hidden dark:text-white font-light cursor-pointer"
                  onClick={deleteAccount}
                >
                  Delete account
                </p>
              </div>
            </div>
            <div className="flex items-center w-full justify-center">
              <Image
                width={300}
                height={100}
                alt="Change ritooal profile details"
                src={`/profile${darkMode ? "white" : ""}.png`}
              />
            </div>
            <p
              className="mt-4 md:hidden flex  dark:text-white font-light cursor-pointer"
              onClick={deleteAccount}
            >
              Delete account
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
