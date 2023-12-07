"use client";

import { useEffect } from "react";
import { account } from "@/appwrite"; // Adjust the import path as needed

const AuthCallback = () => {
  useEffect(() => {
    async function handleOAuthResponse() {
      try {
        // Finalize the OAuth login process with Appwrite
        const session = await account.getOAuth2Session();
        // Redirect to the dashboard or another page after successful login
        window.location.href = "/dashboard";
      } catch (error) {
        console.error("OAuth error:", error);
        // Redirect to login page on error
        window.location.href = "/";
      }
    }

    handleOAuthResponse();
  }, []);

  // You can display a loading indicator here
  return <div>Loading...</div>;
};

export default AuthCallback;
