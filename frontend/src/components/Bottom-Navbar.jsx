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
    <motion.div className="flex  items-center justify-between cursor-pointer fixed bottom-0 left-0 right-0 z-50 h-20 bg-zinc-800 text-white  px-4">
      {NavigateOptions.map((Option, i) => (
        <NavLink
          to={Option.path}
          key={i}
          className={`flex flex-col items-center justify-center ${activePath.pathname === Option.path ? "text-green-500" : "text-gray-300"}`}>
          <Option.icon />
          <p>{Option.label}</p>
        </NavLink>
      ))}
    </motion.div>
  );
};

export default BottomNavbar;
