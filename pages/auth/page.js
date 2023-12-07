import { useState, useEffect } from "react";
import { account } from "@/appwrite";
import Image from "next/image";
import { useRouter } from "next/router";

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  console.log("hello");

  useEffect(() => {
    async function handleOAuthResponse() {
      try {
        const session = await account.getOAuth2Session();
        console.log(session);
        setIsLoading(false);
        router.push("/dashboard"); // Use Next.js router for redirection
      } catch (error) {
        console.error("OAuth error:", error);
        setIsLoading(false);
        router.push("/"); // Use Next.js router for redirection
      }
    }

    handleOAuthResponse();
  }, [router]);

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
