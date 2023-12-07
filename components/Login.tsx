"use client";

import { useEffect, useState } from "react";
import { account, ID } from "@/appwrite";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function getUser() {
      try {
        const userData = await account.get();
        setUser(userData);
      } catch (error) {
        console.error(error);
        setUser(null); // Set user to null if not authenticated or any error occurs
      }
      setLoadingUser(false);
    }
    getUser();
  }, []);

  async function handleLogout() {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (e) {
      console.error(e);
      toast.error(e.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  async function handleLogin() {
    try {
      setLoadingUser(true);
      await account.createEmailSession(email, password);

      setUser(await account.get());
      setEmail("");
      setPassword("");
      window.location.href = "/dashboard";
    } catch (e) {
      setLoadingUser(false);
      console.error(e);
      toast.error(e.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  async function handleRegister() {
    try {
      setLoadingUser(true);
      await account.create(ID.unique(), email, password);
      await handleLogin();
    } catch (e) {
      setLoadingUser(false);
      console.error(e);

      toast.error(e.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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

  function dashboard() {
    window.location.href = "/dashboard";
  }

  if (user !== null) {
    return (window.location.href = "/dashboard");
    // <div className="flex justify-center items-center h-screen bg-gray-100">
    //   <div className="p-6 max-w-sm w-full bg-white shadow-lg rounded-lg text-center">
    //     <div className="text-2xl font-bold mb-4">
    //       You're already logged in
    //       <button
    //         onClick={dashboard}
    //         className="h-10 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
    //       >
    //         Dashboard
    //       </button>
    //       <button
    //         onClick={handleLogout}
    //         className="h-10 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
    //       >
    //         Logout
    //       </button>
    //     </div>
    //   </div>
    // </div>
  }

  const handleGoogleLogin = () => {
    account.createOAuth2Session(
      "google", // Provider
      `${window.location.origin}/auth`, // Success URL
      `${window.location.origin}/` // Failure URL
    );
  };

  return (
    <div
      className="flex justify-between p-2 flex-col md:flex-row items-center  bg-[#F8F0E5]"
      style={{ minHeight: "calc(100vh)" }}
    >
      <div className="h-full flex flex-col items-center justify-center w-full">
        <ToastContainer />
        <Image
          src="/ritooallogo.png"
          alt="Ritooal Logo"
          width={300}
          height={100}
          className="w-56 object-contain"
        />
        <p
          className="text-black/50 text-[18.5px]"
          style={{ fontFamily: "Handlee" }}
        >
          make success your daily ritual
        </p>
        <Image
          src="/introtask.png"
          alt="Task people Logo"
          width={300}
          height={100}
          className="md:w-96 md:flex hidden object-contain"
        />
      </div>
      <div className="p-6  w-full flex items-center justify-center">
        <div className="w-full max-w-md  p-10 rounded-3xl ">
          <div className="text-2xl font-bold mb-4 text-[#355D7B] text-center">
            Your account
          </div>
          <form className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 p-3 space-x-5 bg-white rounded-md border-2  outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 p-3 space-x-5 bg-white rounded-md border-2  outline-none"
            />
            <button
              type="button"
              onClick={handleLogin}
              className="h-10 bg-[#53B0DB] text-white rounded-md hover:bg-[#4BA0C8] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={handleRegister}
              className="h-10 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Sign up
            </button>
          </form>
          <button onClick={handleGoogleLogin} className="your-button-class">
            Login with Google
          </button>
        </div>
      </div>
      <div className="h-full">
        {" "}
        <div className="h-full">
          <Image
            src="/introtask.png"
            alt="Task people"
            width={300}
            height={100}
            className="w-58 md:hidden object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
