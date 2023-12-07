import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";

function page() {
  return (
    <div>
      <header>
        <div className="flex items-center justify-center">
          <div className="flex flex-col md:flex-row max-w-7xl items-center w-full justify-between border-b-0 border-b-[#102C57]/10 p-3 ">
            {/* <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br bg-sky-800 rounded-md filter blur-3xl opacity-50 -z-50" /> */}
            <div className="w-full flex justify-between items-center">
              <div className="pl-0 md:pl-3 ">
                <Link href="/dashboard">
                  <Image
                    src="/ritooallogo.png"
                    alt="Ritooal Logo"
                    width={300}
                    height={100}
                    className="w-24 md:w-24 pb-5 md:pb-0 object-contain"
                  />
                </Link>
              </div>
              <div className="flex cursor-pointer hover:text-neutral-200 ">
                {/* <p className="mr-2">{user.email}</p> */}
                <FontAwesomeIcon
                  icon={faUser}
                  className="h-5 w-5 pb-5 flex md:hidden ml-3 pr-5 "
                />
              </div>
            </div>
            <div className="w-full">
              <div className="flex flex-wrap items-center space-x-5 flex-1 justify-center w-full"></div>
            </div>
            <div className="w-full">
              <div className="flex  justify-center items-end flex-col text-[#345D79] ">
                <div className="flex cursor-pointer hover:text-neutral-200 ">
                  {/* <Link href="/settings"></Link> */}
                  {/* <p className="mr-2">{user.email}</p> */}
                  <FontAwesomeIcon
                    icon={faUser}
                    className="h-5 w-5 hidden md:flex ml-3 pr-5 "
                  />
                </div>
                {/* {openProfile && <DropDownProfile ref={dropdownRef} />} */}
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
      </header>
    </div>
  );
}

export default page;
