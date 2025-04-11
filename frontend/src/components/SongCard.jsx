import React from "react";
import {motion} from "framer-motion";
import {useUser} from "../context/UserContext";
const SongCard = (props) => {
  const {selectedSong} = useUser();
  return (
    <motion.div
      className={`group flex items-center gap-4 p-2 rounded-lg transition-all duration-300 cursor-pointer ${
        selectedSong?.id?.videoId === props?.song?.id?.videoId ? "bg-green-800" : "bg-zinc-900  hover:bg-green-100/10"
      }`}
      whileTap={{scale: 0.99}}>
      {/* {console.log(selectedSong?.id?.videoId, props?.song?.id?.videoId)} */}
      <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={props.song?.snippet?.thumbnails?.high?.url || "https://via.placeholder.com/300x300?text=No+Thumbnail"}
          alt={props.song?.snippet?.title}
          className="w-full h-full object-cover scale-130 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-green-300 font-medium truncate">{props.song?.snippet?.title || "No title"}</h3>
        <p className="text-green-400/60 text-sm truncate">{props.song?.snippet?.channelTitle || "Unknown Channel"}</p>
      </div>
    </motion.div>
  );
};

export default SongCard;
