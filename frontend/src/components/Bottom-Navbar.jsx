import React from "react";
import {motion} from "framer-motion";
import {BookIcon, DownloadIcon, HistoryIcon, HomeIcon, SearchIcon} from "lucide-react";
import {Link, NavLink, useLocation} from "react-router-dom";
const BottomNavbar = () => {
  const activePath = useLocation();
  const NavigateOptions = [
    {
      icon: HomeIcon,
      label: "Home",
      path: "/",
    },
    {
      icon: SearchIcon,
      label: "Search",
      path: "/search",
    },
    {
      icon: HistoryIcon,
      label: "History",
      path: "/history",
    },
    {
      icon: BookIcon,
      label: "Playlist",
      path: "/playlist",
    },
    {
      icon: DownloadIcon,
      label: "Downloads",
      path: "/downloads",
    },
  ];
  return (
    <>
      <div className="xl:hidden flex  items-center justify-between cursor-pointer fixed bottom-0 left-0 right-0 z-50 h-15 bg-zinc-800 text-white  px-4">
        {NavigateOptions.map((Option, i) => (
          <NavLink
            to={Option.path}
            key={i}
            className={`flex flex-col text-xs items-center justify-center ${activePath.pathname === Option.path ? "text-green-500" : "text-gray-300"}`}>
            <Option.icon />
            {/* <p>{Option.label}</p> */}
          </NavLink>
        ))}
      </div>

      <div className="sm:hidden px-4  xl:flex  h-full flex-col items-start justify-start cursor-pointer fixed top-0 bg-zinc-800 w-[20%] ">
        {NavigateOptions.map((navLink, index) => (
          <NavLink
            key={index}
            to={navLink.path}
            className={({isActive}) => `
                flex items-center px-4 py-3 my-1 rounded-xl w-full transition-all duration-200 first-of-type:mt-18
                ${
                  isActive
                    ? "dark:bg-zinc-900 bg-black text-white dark:text-white hover:bg-zinc-900/100 hover:bg-zinc-900"
                    : "dark:text-gray-200 text-gray-700 dark:hover:bg-zinc-700"
                }
              `}>
            <navLink.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{navLink.label}</span>
          </NavLink>
        ))}

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Settings Link */}
        <NavLink
          to="/settings"
          className={({isActive}) => `
              flex items-center px-4 py-3 my-1 rounded-xl transition-all duration-200
              ${
                isActive
                  ? "dark:bg-zinc-800 bg-black text-white dark:text-white dark:hover:bg-zinc-700 hover:bg-zinc-900"
                  : "dark:text-gray-200 text-gray-700 dark:hover:bg-zinc-800 hover:bg-gray-100"
              }
            `}>
         
        </NavLink>

        {/* Logout Link */}
      </div>
    </>
  );
};

export default BottomNavbar;
