"use client";

import { useEffect, useState } from "react";
import { account, ID } from "@/appwrite";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCreate, setEmailCreate] = useState("");
  const [passwordCreate, setPasswordCreate] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  async function handleLoginCreate() {
    try {
      setLoadingUser(true);
      await account.createEmailSession(emailCreate, passwordCreate);

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
      await account.create(ID.unique(), emailCreate, passwordCreate);
      await handleLoginCreate();
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
      "google" // Provider
      // `ritooal.com/auth/page`, // Success URL
      // `ritooal.com` // Failure URL
    );
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

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
            Welcome
          </div>
          <div className="flex flex-col items-center justify-center">
            <div
              className="border-gray-200 rounded-full min-w-[184px] hover:bg-gray-100  cursor-pointer flex items-center justify- shadow-md border bg-white w-6/12"
              onClick={handleGoogleLogin}
            >
              <img src="/google.png" className="h-8 p-1 w-8" />
              <p className="text-xs ml-2 text-gray-600">Connect with Google</p>
            </div>
            <div className="flex w-[267px] mt-6 mb-6 items-center justify-center">
              <div className="flex-grow h-px bg-gray-300"></div>
              <p className="mx-2 text-sm text-gray-600 ml-5 mr-5">or</p>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>
          </div>
          <form className="flex items-center flex-col space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 p-3 space-x-5 bg-white min-w-[270px] rounded-md border-2  outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 p-3 space-x-5 bg-white min-w-[270px] rounded-md border-2  outline-none"
            />
            <button
              type="button"
              onClick={handleLogin}
              className="h-10 bg-[#53B0DB] min-w-[270px] text-white rounded-md hover:bg-[#4BA0C8] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Sign in
            </button>
            <div className="flex text-sm flex-col md:flex-row items-center justify-center">
              <p>No account yet?</p>
              <button
                type="button"
                onClick={toggleModal}
                className="h-10  text-[#315E80] hover:text-gray-400 ml-1 text-sm rounded-md focus:outline-none "
              >
                Create your account
              </button>
            </div>
          </form>
          {/* <button onClick={handleGoogleLogin} className="your-button-class">
            Login with Google
          </button> */}
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-75 z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-[#FFFDFC] min-w-[300px] min-h-[400px] max-w-3xl  p-8 w-9/12 flex md:flex-row flex-col items-center justify-center rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center w-full justify-center">
              <Image
                width={400}
                height={100}
                alt="Create ritooal account"
                src="/createacc.png"
              />
            </div>
            <div className="flex flex-col w-full min-w-[352px] items-center justify-center">
              <Image
                src="/ritooallogo.png"
                alt="Ritooal Logo"
                width={300}
                height={100}
                className="w-40 mb-3 md:mb-10 md:flex hidden object-contain"
              />
              <div className="text-2xl font-bold mb-4 text-[#355D7B] text-center">
                Create your account
              </div>
              <form className="flex flex-col items-center w-9/12 space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={emailCreate}
                  onChange={(e) => setEmailCreate(e.target.value)}
                  className="h-10 p-3 space-x-5 min-w-[270px] bg-white rounded-md border-2  outline-none"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={passwordCreate}
                  onChange={(e) => setPasswordCreate(e.target.value)}
                  className="h-10 p-3 space-x-5 min-w-[270px] bg-white rounded-md border-2  outline-none"
                />
                <button
                  type="button"
                  onClick={handleRegister}
                  className="h-10 bg-[#22C55D] text-white min-w-[270px] rounded-md hover:bg-[#16A349] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Sign up
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="h-full">
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
