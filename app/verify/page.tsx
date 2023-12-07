"use client";

import { useEffect } from "react";
import { account } from "@/appwrite";

function Verify() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    const secret = urlParams.get("secret");

    if (userId && secret) {
      account
        .updateVerification(userId, secret)
        .then((response) => {
          // Redirect to login or dashboard page
        })
        .catch((error) => {
          console.error("Verification failed:", error);
        });
    }
  }, []);

  return <div>Verifying...</div>;
}

export default Verify;
