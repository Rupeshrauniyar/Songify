import React, {useContext} from "react";
import SongCard from "./SongCard";
import {useUser} from "../context/UserContext";
import axios from "axios";
const SongsRenderer = () => {
  const {user, songs,songsLoading, selectedSong, setSelectedSong, setAudioUrl, setSelectedIndex,fetchData} = useUser();
  
  const playSong = (song, i) => {
    setSelectedSong(song.snippet);
    const id = song.id.videoId;
    setSelectedIndex(i);
    fetchData(id);
    
  };

  return (
    <div className="">
      {songs.map((song, i) => (
        <div
          key={i}
          className="m-2 last:pb-30"
          onClick={() => {
            playSong(song, i);
          }}>
          <SongCard song={song} />
        </div>
      ))}
    </div>
  );
};

export default SongsRenderer;
