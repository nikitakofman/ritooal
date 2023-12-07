import { useState, useEffect } from "react";
import { account } from "@/appwrite";
import Image from "next/image";

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function handleOAuthResponse() {
      try {
        const session = await account.getOAuth2Session();
        console.log(session);
        setIsLoading(true);
        console.log(isLoading);
        window.location.href = "/dashboard";
      } catch (error) {
        console.error("OAuth error:", error);
        setIsLoading(false);
        window.location.href = "/";
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
