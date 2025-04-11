import {Loader2, Search} from "lucide-react";
import SongsRenderer from "../components/SongsRenderer";
import {useUser} from "../context/UserContext";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
// import SongPlayerOpened from "../middlewares/SongPlayerOpened";
import axios from "axios";
const Home = () => {
  const [fetched, setFetched] = useState(false);
  const [homeSongs, setHomeSongs] = useState([]);
  const [homeSongsLoading, setHomeSongsLoading] = useState(false);
  const api = import.meta.env.VITE_YOUTUBE_API_KEY;
  const navigate = useNavigate();
  const {open, songs, setSongs, songsLoading, setSongsLoading} = useUser();

  const getSongs = async () => {
    setHomeSongsLoading(true);
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=14&chart=mostPopular&regionCode=IN&key=${api}&q=viral+bollywood+movie+songs&type=video`
    );
    // console.log(response);
    if (response.status === 200) {
      setHomeSongs(response.data.items);
      setSongs(response.data.items);
      setHomeSongsLoading(false);
      setSongsLoading(false);
    } else {
      setHomeSongsLoading(false);
      setSongsLoading(false);
    }
  };
  useEffect(() => {
    if (!fetched) {
      getSongs();
      setFetched(true);
    }
  }, []);
  return (
    <div className={`w-full bg-black  py-2 ${open ? "overflow-hidden mt-0" : "overflow-y-auto mt-16"}`}>
      {open ? (
        <></>
      ) : (
        <>
          <h1 className="text-4xl font-black m-3">Songs</h1>
          {homeSongsLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
            </div>
          ) : (
            <>{homeSongs.length > 0 ? <SongsRenderer songs={homeSongs} /> : <SongsRenderer songs={songs} />}</>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
