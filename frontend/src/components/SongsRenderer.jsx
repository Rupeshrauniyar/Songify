import React, {useContext} from "react";
import SongCard from "./SongCard";
import {useUser} from "../context/UserContext";
import axios from "axios";
import {motion} from "framer-motion";
const SongsRenderer = (props) => {
  const { user, songsLoading, selectedSong, setSelectedSong, setSelectedIndex, fetchData, addToHistory } = useUser();

  const playSong = (song, i) => {
    const videoId = song?.id?.videoId ?? song?.id;
    if (!videoId) return;
    addToHistory?.(song);
    setSelectedSong(song);
    setSelectedIndex(i);
    try {
      fetchData(videoId);
    } catch (error) {
      console.error(error);
      alert("Error playing song. Try again.");
    }
  };

  return (
    <div className="">
      {/* {console.log(props)} */}
      {props?.songs?.map((song, i) => (
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: -10}}
          transition={{type: "spring", stiffness: 100, damping: 15}}
          key={i}
          className={`m-2 last:pb-30 `}
          onClick={() => {
            playSong(song, i);
          }}>
          <SongCard song={song} />
        </motion.div>
      ))}
    </div>
  );
};

export default SongsRenderer;
