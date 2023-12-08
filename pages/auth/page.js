import { useState, useEffect } from "react";
import { account, database } from "@/appwrite"; // assuming this is your import path
import Image from "next/image";

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function handleOAuthResponse() {
      try {
        const session = await account.getOAuth2Session();
        console.log(session);
        setIsLoading(true);

        // After successful OAuth login, update or create custom user data
        updateOrCreateGoogleUserData(session.userId);

        window.location.href = "/dashboard";
      } catch (error) {
        console.error("OAuth error:", error);
        setIsLoading(false);
        window.location.href = "/";
      }
    }

    async function updateOrCreateGoogleUserData(userId) {
      console.log("hello");
      try {
        // Check if userDetails document for this user already exists
        const userDocument = await database.getDocument("userDetails", userId);

        if (!userDocument) {
          // Create a new document if it doesn't exist
          await database.createDocument("userDetails", userId, {
            isGoogleUser: true,
          });
        } else {
          // Update the existing document
          await database.updateDocument("userDetails", userId, {
            isGoogleUser: true,
          });
        }
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }

    handleOAuthResponse();
  }, []);

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-[#F8F0E5]">
      {isLoading && (
        <div className="p-6 max-w-sm w-full flex items-center justify-center rounded-lg text-center">
          <Image
            src="/loading.png"
            width={100}
            height={100}
            className="h-10 w-10 text-[black] mt-2 animate-spin"
          />
        </div>
      )}
    </div>
  );
};

export default AuthCallback;
