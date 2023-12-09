"use client";

import { useState, useEffect } from "react";
import { account } from "@/appwrite";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

function PasswordRecovery() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  console.log(secret);
  console.log(email);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    setSecret(urlParams.get("secret") || "");
    setEmail(urlParams.get("email") || "");
    const userId = urlParams.get("userId") || "";
    setUserId(userId);
    console.log(userId);
  }, []);

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await account.updateRecovery(
        userId,
        secret,
        newPassword,
        confirmPassword
      );
      toast.success(
        "Password reset successfully. Redirecting to login page. ",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      // Redirect to login page
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset password.", {
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
      <div className="p-6  w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-md  p-10 rounded-3xl ">
          <div className="text-2xl font-bold mb-4 text-[#355D7B] text-center">
            Reset your password
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center w-9/12 space-y-4">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="h-10 p-3 space-x-5 min-w-[270px] bg-white rounded-md border-2  outline-none"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="h-10 p-3 space-x-5 min-w-[270px] bg-white rounded-md border-2  outline-none"
              />
              <button
                onClick={handlePasswordReset}
                className="h-10 bg-[#53B0DB] min-w-[270px] text-white rounded-md hover:bg-[#4BA0C8] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>

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
    </div>
  );
}

export default PasswordRecovery;
