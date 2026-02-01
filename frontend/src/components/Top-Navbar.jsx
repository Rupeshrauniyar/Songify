import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import { Search, Settings, Music, Download } from "lucide-react";
import axios from "axios";
const TopNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-800 rounded-b-4xl backdrop-blur-sm shadow-2xl">
      <div className="max-w-full mx-auto  px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2"
          >
            <Music className="w-6 h-6 text-green-400" />
            <span className="text-xl font-bold text-green-400">Songify</span>
          </Link>

          {/* Search Bar */}

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/search"
              className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
            {/* <Link
              to="/settings"
              className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link> */}
            <a
              href="https://drive.google.com/uc?export=download&id=16CHkgJmD3jzW7JXp5fthOoC0p26yDFn-
"
              download="SONGIFY.apk"
            >
              <button className="bg-white text-black p-2 rounded-full flex items-center justify-center gap-1">
                <Download size={"20"} />
                APP
              </button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
