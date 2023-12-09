"use client";

import { useEffect, useState } from "react";
import { account } from "@/appwrite";
import Image from "next/image";
import Swal from "sweetalert2"; // Assuming you're using SweetAlert2 for popup messages

function Verify() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    const secret = urlParams.get("secret");

    if (userId && secret) {
      account
        .updateVerification(userId, secret)
        .then(() => {
          setIsLoading(false);
          // Show success message then redirect
          Swal.fire({
            title: "Email Verified",
            text: "Your email has been successfully verified.",
            icon: "success",
            confirmButtonText: "Go to Login",
            confirmButtonColor: "#52B0DB",
          }).then(() => {
            window.location.href = "/";
          });
        })
        .catch((error) => {
          console.error("Verification failed:", error);
          setIsLoading(false);
          // Show error message then redirect
          Swal.fire({
            title: "Verification Failed",
            text: "There was a problem verifying your email. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.href = "/";
          });
        });
    } else {
      setIsLoading(false);
      // Handle scenario where userId or secret is missing
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-[#F8F0E5]">
      {isLoading && (
        <div className="p-6 max-w-sm w-full flex items-center justify-center rounded-lg text-center">
          <Image
            alt="loading"
            src="/loading.png"
            width={100}
            height={100}
            className="h-10 w-10 text-[black] mt-2 animate-spin"
          />
        </div>
      )}
    </div>
  );
}

export default Verify;
