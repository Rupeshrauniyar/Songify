import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  Search as SearchIcon,
  Music2,
  Play,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import axios from "axios";

const APIS = [
  import.meta.env.VITE_YOUTUBE_API_KEY1,
  import.meta.env.VITE_YOUTUBE_API_KEY2,
  import.meta.env.VITE_YOUTUBE_API_KEY3,
  import.meta.env.VITE_YOUTUBE_API_KEY4,
  import.meta.env.VITE_YOUTUBE_API_KEY5,
  import.meta.env.VITE_YOUTUBE_API_KEY6,
];

const SUGGESTIONS = [
  "Bollywood",
  "Hindi Songs",
  "Romantic",
  "Party",
  "Sad Songs",
  "Punjabi",
  "Devotional",
  "Retro",
];

const Search = () => {
  const { open, setSongs, setSelectedSong, setSelectedIndex, fetchData, selectedSong, addToHistory } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const getVideoId = (song) =>
    song?.id?.videoId ?? song?.id ?? null;

  const search = useCallback(
    async (query) => {
      const q = (typeof query === "string" ? query : searchQuery).trim();
      if (q.length < 2) {
        setError("Enter at least 2 characters to search");
        return;
      }

      setError(null);
      setLoading(true);
      setHasSearched(true);

      let api = APIS[Math.floor(Math.random() * APIS.length)];
      let attempts = 0;

      const doSearch = async () => {
        try {
          const res = await axios.get(
            "https://www.googleapis.com/youtube/v3/search",
            {
              params: {
                part: "snippet",
                maxResults: 20,
                q: q,
                type: "video",
                regionCode: "IN",
                relevanceLanguage: "hi",
                key: api,
              },
            }
          );
          const items = res?.data?.items ?? [];
          setResults(items);
          setSongs(items);
          setLoading(false);
        } catch (err) {
          attempts++;
          if (attempts < APIS.length) {
            api = APIS[attempts];
            await doSearch();
          } else {
            setError("Search failed. Please try again.");
            setLoading(false);
          }
        }
      };

      await doSearch();
    },
    [searchQuery, setSongs]
  );

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    search(searchQuery);
  };

  const playSong = (song, index) => {
    const videoId = getVideoId(song);
    if (!videoId) return;
    addToHistory?.(song);
    setSelectedSong(song);
    setSelectedIndex(index);
    setSongs(results);
    fetchData(videoId);
  };

  const getThumbnail = (song) =>
    song?.snippet?.thumbnails?.high?.url ||
    song?.snippet?.thumbnails?.medium?.url ||
    song?.snippet?.thumbnails?.default?.url ||
    "https://via.placeholder.com/120x90?text=No+Image";

  const getTitle = (song) =>
    song?.snippet?.title || "No title";

  const getChannel = (song) =>
    song?.snippet?.channelTitle || "Unknown Channel";

  const isSelected = (song) => {
    const vid = getVideoId(song);
    const current = selectedSong?.id?.videoId ?? selectedSong?.id;
    return vid && current && String(vid) === String(current);
  };

  return (
    <div
      className={`w-full bg-black min-h-screen pb-24 ${
        open ? "overflow-hidden" : "overflow-y-auto"
      }`}
    >
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm py-3 px-4 border-b border-zinc-800/50">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Search songs, artists, albums..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-green-500 focus:ring-1 focus:ring-green-500/30 outline-none transition-all"
            autoComplete="off"
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none" />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-green-500 text-black text-sm font-medium hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {SUGGESTIONS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setSearchQuery(term);
                search(term);
              }}
              className="px-3 py-1.5 rounded-full text-sm bg-zinc-800 text-green-400/90 hover:bg-green-500/20 hover:text-green-300 border border-zinc-700 hover:border-green-500/40 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div className="px-3 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
            <p className="text-green-400/60 text-sm">Searching...</p>
          </div>
        ) : !hasSearched ? (
          <div className="flex flex-col items-center justify-center py-20 text-green-400/60">
            <Music2 className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-center font-medium">Discover music</p>
            <p className="text-sm mt-1">Search or tap a suggestion above</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-green-400/60">
            <SearchIcon className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-center font-medium">No results found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="space-y-1">
            {results.map((song, index) => (
              <motion.button
                key={getVideoId(song) || index}
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => playSong(song, index)}
                className={`w-full flex items-center gap-4 p-3 rounded-xl text-left transition-all active:scale-[0.99] cursor-pointer group ${
                  isSelected(song)
                    ? "bg-green-500/20 border border-green-500/40"
                    : "bg-zinc-900 hover:bg-zinc-800/90 border border-transparent hover:border-zinc-700"
                }`}
              >
                <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800">
                  <img
                    src={getThumbnail(song)}
                    alt={getTitle(song)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/120x90?text=No+Image";
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-green-300 font-medium truncate text-base">
                    {getTitle(song)}
                  </h3>
                  <p className="text-green-400/60 text-sm truncate mt-0.5">
                    {getChannel(song)}
                  </p>
                </div>

                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-6 h-6 text-green-400" />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
