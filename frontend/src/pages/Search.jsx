import {useEffect, useState} from "react";
import SongsRenderer from "../components/SongsRenderer";
import {useUser} from "../context/UserContext";
import axios from "axios";
import {Loader2, SearchCheck, SearchIcon} from "lucide-react";
// import { api } from "../config/config";

const Search = () => {
  //   const {getSongs} = useUser();
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [songsLoading, setSongsLoading] = useState(false);
  const api = import.meta.env.VITE_YOUTUBE_API_KEY;
  const getSongs = async () => {
    if (search.length > 3) {
      setSongsLoading(true);
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=14&chart=mostPopular&regionCode=IN&key=${api}&q=${search}&type=music`
      );
      // console.log(response);
      if (response.status === 200) {
        setSongs(response.data.items);
        setSongsLoading(false);
      } else {
        setSongsLoading(false);
      }
    } else {
      alert("Search term must be greater than atleats 3 words");
    }
  };
  return (
    <div className="overflow-y-auto h-full">
      {/* Search */}
      <div className="relative p-4">
        <input
          type="search"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getSongs();
            }
          }}
          className="w-full p-2 rounded-md px-8 border-2 border-green-500"
        />
        <div className="flex items-center gap-2 absolute left-6 top-7 z-50">
          <SearchIcon className="w-5 h-5 text-green-500" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {songsLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
          </div>
        ) : (
          <SongsRenderer songs={songs} />
        )}
      </div>
    </div>
  );
};

export default Search;
