import {Search} from "lucide-react";
import SongsRenderer from "../components/SongsRenderer";
import {useUser} from "../context/UserContext";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
const Home = () => {
  const [fetched, setFetched] = useState(false);
  const navigate = useNavigate();
  const {getSongs} = useUser();
  useEffect(() => {
    if (!fetched) {
      getSongs();
      setFetched(true);
    }
  }, []);
  return (
    <div className="w-full bg-black overflow-y-auto py-2">
      <div className="flex-1 max-w-md px-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search songs..."
            className="w-full px-4 py-2 pl-10 bg-black/50 border border-green-500/30 rounded-lg text-green-300 placeholder-green-400/50 focus:outline-none focus:border-green-500/50"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-green-400/50" />
        </div>
      </div>
      <h1 className="text-4xl font-black m-3">For you</h1>
      <SongsRenderer />
    </div>
  );
};

export default Home;
