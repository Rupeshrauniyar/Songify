import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { Music2, Play } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { useUser } from "../context/UserContext";

const getPlayableUri = (fileUri) => {
  if (!fileUri) return null;
  if (Capacitor.isNativePlatform() && fileUri.startsWith("file://")) {
    return Capacitor.convertFileSrc(fileUri);
  }
  return fileUri;
};

const History = () => {
  const {
    history,
    setSelectedSong,
    setSongs,
    setSelectedIndex,
    fetchData,
    setAudioUrl,
    addToHistory,
  } = useUser();

  const getVideoId = (item) => item?._videoId ?? item?.id?.videoId ?? item?.id ?? null;
  const getFileUri = (item) => item?._fileUri ?? item?.fileUri ?? null;

  const getTitle = (item) =>
    item?.title ||
    item?.snippet?.title ||
    item?.selectedSong?.snippet?.title ||
    "Unknown";

  const getChannel = (item) =>
    item?.channelTitle ||
    item?.snippet?.channelTitle ||
    item?.selectedSong?.snippet?.channelTitle ||
    "Unknown Channel";

  const getThumbnail = (item) => {
    const url =
      item?.thumbnailUrl ||
      item?.snippet?.thumbnails?.high?.url ||
      item?.snippet?.thumbnails?.medium?.url ||
      item?.selectedSong?.snippet?.thumbnails?.high?.url;
    return url || "https://via.placeholder.com/120x90?text=No+Image";
  };

  const toSong = (item) => ({
    id: item?.id ?? { videoId: getVideoId(item) ?? "local" },
    snippet: item?.snippet ?? {
      title: getTitle(item),
      channelTitle: getChannel(item),
      thumbnails: getThumbnail(item)
        ? { high: { url: getThumbnail(item) } }
        : undefined,
    },
  });

  const playItem = useCallback(
    (item, index) => {
      const videoId = getVideoId(item);
      const fileUri = getFileUri(item);

      addToHistory?.(item);
      const song = toSong(item);

      if (fileUri) {
        const playableSrc = getPlayableUri(fileUri);
        if (playableSrc) {
          setSelectedSong(song);
          setSongs([song]);
          setSelectedIndex(0);
          setAudioUrl(playableSrc);
        }
      } else if (videoId) {
        setSelectedSong(song);
        setSongs(history);
        setSelectedIndex(index);
        fetchData(videoId);
      }
    },
    [
      history,
      setSelectedSong,
      setSongs,
      setSelectedIndex,
      fetchData,
      setAudioUrl,
      addToHistory,
    ]
  );

  return (
    <div className="w-full bg-black min-h-screen py-4 pb-24">
      <h1 className="text-2xl font-bold text-white px-4 mb-4">History</h1>

      {!history?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-green-400/60">
          <Music2 className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-center">No playback history yet</p>
          <p className="text-sm mt-1">Songs you play will appear here</p>
        </div>
      ) : (
        <div className="space-y-1 px-2">
          {history.map((item, index) => (
            <motion.button
              key={item?._videoId || item?._fileUri || index}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => playItem(item, index)}
              className="w-full flex items-center gap-4 p-3 rounded-xl text-left bg-zinc-900 hover:bg-zinc-800/90 border border-transparent hover:border-zinc-700 transition-all active:scale-[0.99] cursor-pointer group"
            >
              <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800">
                <img
                  src={getThumbnail(item)}
                  alt={getTitle(item)}
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
                  {getTitle(item)}
                </h3>
                <p className="text-green-400/60 text-sm truncate mt-0.5">
                  {getChannel(item)}
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
  );
};

export default History;
