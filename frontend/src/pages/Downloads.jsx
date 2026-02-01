import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, Music } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { useUser } from "../context/UserContext";

const STORAGE_KEY = "downloads";

const getPlayableUri = (fileUri) => {
  if (!fileUri) return null;
  if (Capacitor.isNativePlatform() && fileUri.startsWith("file://")) {
    return Capacitor.convertFileSrc(fileUri);
  }
  return fileUri;
};

const Downloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingUri, setPlayingUri] = useState(null);
  const { setSelectedSong, setSongs, setSelectedIndex, setAudioUrl, addToHistory } = useUser();

  const loadDownloads = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      setDownloads(Array.isArray(list) ? list : []);
    } catch (e) {
      setDownloads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDownloads();
  }, [loadDownloads]);

  const playDownload = (item) => {
    const playableSrc = getPlayableUri(item.fileUri);
    if (!playableSrc) return;

    const song = item.selectedSong || {
      id: item.id ? { videoId: item.id } : { videoId: "local" },
      snippet: {
        title: item.title,
        channelTitle: item.channelTitle,
        thumbnails: item.thumbnailUrl
          ? { high: { url: item.thumbnailUrl } }
          : undefined,
      },
    };

    addToHistory?.({ ...song, fileUri: item.fileUri });
    setSelectedSong(song);
    setSongs([song]);
    setSelectedIndex(0);
    setAudioUrl(playableSrc);
    setPlayingUri(item.fileUri);
  };

  const getTitle = (item) =>
    item.title ||
    item.selectedSong?.snippet?.title ||
    item.selectedSong?.title ||
    item.fileName?.replace(/\.mp3$/i, "") ||
    "Unknown";

  const getChannel = (item) =>
    item.channelTitle ||
    item.selectedSong?.snippet?.channelTitle ||
    item.selectedSong?.channelTitle ||
    "Unknown Channel";

  const getThumbnail = (item) => {
    const url =
      item.thumbnailUrl ||
      item.selectedSong?.snippet?.thumbnails?.high?.url ||
      item.selectedSong?.snippet?.thumbnails?.medium?.url ||
      item.selectedSong?.snippet?.thumbnails?.default?.url ||
      item.selectedSong?.thumbnails?.high?.url;
    return url || "https://via.placeholder.com/120x90?text=No+Image";
  };

  return (
    <div className="w-full bg-black min-h-screen py-4 mt-16 pb-24">
      <h1 className="text-2xl font-bold text-white px-4 mb-4">Downloads</h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
        </div>
      ) : downloads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-green-400/60">
          <Music className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-center">No downloads yet</p>
          <p className="text-sm mt-1">Songs you download will appear here</p>
        </div>
      ) : (
        <div className="space-y-1 px-2">
          {downloads.map((item, index) => (
            <motion.div
              key={item.fileUri || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => playDownload(item)}
              className="group flex items-center gap-4 p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800/80 active:scale-[0.99] transition-all cursor-pointer"
            >
              <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                <img
                  src={getThumbnail(item)}
                  alt={getTitle(item)}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/120x90?text=No+Image";
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-green-300 font-medium truncate">
                  {getTitle(item)}
                </h3>
                <p className="text-green-400/60 text-sm truncate">
                  {getChannel(item)}
                </p>
              </div>

              {playingUri === item.fileUri && (
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Downloads;
