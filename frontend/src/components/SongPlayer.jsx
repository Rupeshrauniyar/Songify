import React, {useContext, useRef, useState, useEffect} from "react";
import {motion} from "framer-motion";
import {Play, Pause, SkipBack, SkipForward, ArrowLeft, ArrowDown, GripHorizontal} from "lucide-react";
import {useUser} from "../context/UserContext";
import {useNavigate} from "react-router-dom";
import SongsRenderer from "./SongsRenderer";

const SongPlayer = () => {
  const audioRef = useRef(null);
  const playerRef = useRef(null);
  const {rapidProcessing, songs, setAudioUrl, selectedSong, selectedIndex, setSelectedIndex, setSelectedSong, audioUrl, fetchData, open, setOpen} = useUser();
  const [isPlaying, setIsPlaying] = useState(false);
  const [songCurrentTime, setSongCurrentTime] = useState(0);
  const [songDuration, setSongDuration] = useState(0);
  const [songCurrentHour, setSongCurrentHour] = useState(0);
  const [songCurrentMinutes, setSongCurrentMinutes] = useState(0);
  const [songCurrentSeconds, setSongCurrentSeconds] = useState(0);
  const [songDurationMinutes, setSongDurationMinutes] = useState(0);
  const [songDurationSeconds, setSongDurationSeconds] = useState(0);
  const [songDurationHours, setSongDurationHours] = useState(0);
  const [ended, setEnded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({
    // Initial constraints - these will be immediately updated in the useEffect
    left: -(document.documentElement.clientWidth - 240),
    right: 0,
    top: -(document.documentElement.clientHeight - 240),
    bottom: 0,
  });
  const navigate = useNavigate();

  // Update drag constraints on window resize
  useEffect(() => {
    const updateConstraints = () => {
      // Calculate the player dimensions (240px width, 240px height)
      const playerWidth = 240;
      const playerHeight = 240;

      setDragConstraints({
        // Left constraint: allows dragging from right edge to left edge minus player width
        left: -(window.innerWidth - playerWidth),
        // Right constraint: prevents player from going beyond right edge
        right: 0,
        // Top constraint: allows dragging from bottom to top minus player height
        top: -(window.innerHeight - playerHeight),
        // Bottom constraint: prevents player from going beyond bottom edge
        bottom: 0,
      });
    };

    window.addEventListener("resize", updateConstraints);
    updateConstraints(); // Set initial constraints

    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    // Use a timeout to distinguish between drag and click
    setTimeout(() => {
      setIsDragging(false);
    }, 100);
  };

  const handlePlayerClick = () => {
    if (!isDragging) {
      navigate("?open=true");
    }
  };

  const playNextSong = async () => {
    if (selectedIndex < songs.length - 1) {
      audioRef.current.src = "";
      setSelectedIndex(selectedIndex + 1);
      setSelectedSong(songs[selectedIndex + 1]);
      await fetchData(songs[selectedIndex + 1].id.videoId);
      setSongCurrentTime(0);
      setEnded(false);
      // audioRef.current.play();
      setSongCurrentHour(0);
      setSongCurrentMinutes(0);
      setSongCurrentSeconds(0);
      setSongDurationHours(0);
      setSongDurationMinutes(0);
      setSongDurationSeconds(0);
    }
  };
  const playPreviousSong = async () => {
    if (selectedIndex > 0) {
      audioRef.current.pause();
      setSelectedSong(songs[selectedIndex - 1]);
      setSelectedIndex(selectedIndex - 1);
      await fetchData(songs[selectedIndex - 1].id.videoId);
      setEnded(false);

      // setSongCurrentTime(0);
      setSongCurrentHour(0);
      setSongCurrentMinutes(0);
      setSongCurrentSeconds(0);
      setSongDurationHours(0);
      setSongDurationMinutes(0);
      setSongDurationSeconds(0);
      // audioRef.current.play();
    }
  };
  const onNext = (e) => {
    playNextSong();
    e.stopPropagation();
  };
  const onPrevious = (e) => {
    playPreviousSong();
    e.stopPropagation();
  };

  useEffect(() => {
    if (audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      // console.log("audioRef.current.currentTime", audioRef.current.duration);
    }
    // console.log(audioUrl);
  }, [audioUrl]);
  useEffect(() => {
    audioRef.current.addEventListener("ended", playNextSong);
  }, [audioRef]);
  useEffect(() => {
    if (ended) {
      playNextSong();
    }
  }, [ended]);
  useEffect(() => {
    if (open && audioRef.current.src) {
      audioRef.current.addEventListener("timeupdate", () => {
        // console.log("audioRef.current.duration", audioRef.current.duration);
        setSongDuration(audioRef.current.duration);
        setSongCurrentTime(audioRef.current.currentTime);
        // setSongCurrentTime(0);
        setSongCurrentHour(0);
        setSongCurrentMinutes(0);
        setSongCurrentSeconds(0);
        setSongDurationHours(0);
        setSongDurationMinutes(0);
        setSongDurationSeconds(0);
        if (audioRef.current.duration > 3600) {
          setSongCurrentHour(Math.floor(audioRef.current.currentTime / 60 / 60));
          setSongCurrentMinutes(Math.floor((audioRef.current.currentTime / 60) % 60));
          setSongCurrentSeconds(Math.floor(audioRef.current.currentTime % 60));
        } else {
          setSongCurrentMinutes(Math.floor(audioRef.current.currentTime / 60));
          setSongCurrentSeconds(Math.floor(audioRef.current.currentTime % 60));
        }
        if (audioRef.current.duration > 3600) {
          setSongDurationHours(Math.floor(audioRef.current.duration / 60 / 60));
          setSongDurationMinutes(Math.floor((audioRef.current.duration / 60) % 60));
          setSongDurationSeconds(Math.floor(audioRef.current.duration % 60));
        } else {
          setSongDurationMinutes(Math.floor((audioRef.current.duration / 60) % 60));
          setSongDurationSeconds(Math.floor(audioRef.current.duration % 60));
        }
      });
    }
  }, [audioRef, open]);

  return (
    <>
      <audio
        ref={audioRef}
        src={null}
      />

      {open ? (
        <>
          {/* {console.log(selectedSong, selectedIndex)} */}
          <motion.div
            initial={{x: 0, y: -1000}}
            animate={{x: -1, y: -0}}
            className="fixed overflow-y-auto bottom-22 top-0 left-0 right-0 bottom-0 bg-black w-full h-full text-white z-40 border border-green-500/20">
            <div className="w-full p-2 space-y-2 mt-16">
              <div className="flex items-center justify-between gap-2">
                <span className="text-green-400/60 text-xs"></span>
                <ArrowDown
                  className="w-10 h-10 bg-green-500/20 rounded-full p-2"
                  onClick={() => {
                    navigate("?open=false");
                  }}
                />
              </div>
              <div className="border-t border-green-500/20"></div>
              <div className="w-full h-60 flex flex-col rounded-full overflow-hidden items-center justify-center ">
                <div className="w-50 h-50 rounded-full overflow-hidden">
                  <img
                    src={selectedSong?.snippet?.thumbnails?.high?.url}
                    alt={selectedSong?.snippet?.title}
                    className="w-full h-full  object-cover scale-133 object-center spin-very-slow"
                  />
                </div>
              </div>

              {/* Song Info */}
              <div className="space-y-0.5 text-center">
                <h3 className="text-green-300 text-sm font-medium truncate">{selectedSong?.snippet?.title || "No title"}</h3>
                <p className="text-green-400/60 text-xs truncate">{selectedSong?.snippet?.channelTitle || "Unknown Channel"}</p>
              </div>

              {/* Playback Controls */}
              <div className="w-full flex flex-col items-center justify-center">
                <input
                  type="range"
                  min="0"
                  max={songDuration ? songDuration : audioRef?.current?.duration ? audioRef.current.duration : 0}
                  value={songCurrentTime}
                  onChange={(e) => {
                    audioRef.current.currentTime = e.target.value;
                    setSongCurrentTime(e.target.value);
                    setSongDuration(audioRef.current.duration);
                  }}
                  className="w-full h-2 bg-zinc-500 rounded-full appearance-none cursor-pointer accent-green-500"
                />
                <div className="w-full flex  items-center justify-between mt-2">
                  <span className="text-green-400/60 text-xs"></span>
                  <span className="text-green-400/60 ">
                    {songCurrentHour > 0 ? `${songCurrentHour}:` : ""}
                    {songCurrentMinutes}:{songCurrentSeconds}/
                    <>
                      {songDurationSeconds ? (
                        <>
                          {songDurationHours > 0 ? `${songDurationHours}:` : ""}
                          {songDurationMinutes}:{songDurationSeconds}
                        </>
                      ) : (
                        <>0:00</>
                      )}
                    </>
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1 px-16 border-t border-green-500/20">
                <button
                  onClick={onPrevious}
                  className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-full transition-colors">
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  // onClick={onPlayPause}
                  className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-full transition-colors">
                  {rapidProcessing ? (
                    <>Loading</>
                  ) : isPlaying ? (
                    <Pause
                      onClick={(e) => {
                        audioRef.current.pause();
                        setIsPlaying(false);
                        e.stopPropagation();
                      }}
                    />
                  ) : (
                    <Play
                      onClick={(e) => {
                        audioRef.current.play();
                        setIsPlaying(true);
                        e.stopPropagation();
                      }}
                    />
                  )}
                </button>

                <button
                  onClick={onNext}
                  className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-full transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              <div className="border-t border-green-500/20 "></div>
              <div className=" overflow-y-auto min-h-full ">
                <p className="text-green-400/60 text-md">Upcoming</p>

                <SongsRenderer songs={songs} />
              </div>
            </div>
          </motion.div>
        </>
      ) : (
        <>
          <motion.div
            ref={playerRef}
            drag
            dragMomentum={false}
            dragElastic={1}
            dragConstraints={dragConstraints}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            // Initial position - start in bottom right with some padding
            initial={{x: -0, y: -30}}
            // Animation when component mounts
            animate={{x: -0, y: -10}}
            exit={{opacity: 0}}
            // transition={{type: "spring", stiffness: 100}}
            className="fixed bottom-18  right-0 bg-zinc-800 w-60 h-60 rounded-xl text-white z-50 border border-green-500/20 shadow-lg"
            onClick={handlePlayerClick}>
            <div className="p-3 space-y-2">
              <div
                className="relative w-full h-32 mx-auto overflow-hidden rounded-lg"
                // Make drag handle explicit - this area is best for dragging
                onPointerDown={(e) => {
                  // This ensures the drag starts from this element
                  if (playerRef.current) {
                    playerRef.current._dragOriginElement = e.target;
                  }
                }}>
                <img
                  src={selectedSong?.snippet?.thumbnails?.high?.url}
                  alt={selectedSong?.snippet?.title}
                  className="w-full h-full object-cover"
                  draggable="false"
                />
                <div className="absolute top-2 left-0 right-0 flex justify-center">
                  <div className="bg-black/30 backdrop-blur-sm p-1 rounded-full">
                    <GripHorizontal className="w-5 h-5 text-white/70" />
                  </div>
                </div>
              </div>

              {/* Song Info */}
              <div className="space-y-0.5 text-center">
                <h3 className="text-green-300 text-sm font-medium truncate">{selectedSong?.snippet?.title || "No title"}</h3>
                <p className="text-green-400/60 text-xs truncate">{selectedSong?.snippet?.channelTitle || "Unknown Channel"}</p>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-2 pt-1 border-t border-green-500/20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrevious(e);
                  }}
                  className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-full transition-colors">
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-full transition-colors">
                  {rapidProcessing ? (
                    <>Loading</>
                  ) : isPlaying ? (
                    <Pause
                      onClick={(e) => {
                        e.stopPropagation();
                        audioRef.current.pause();
                        setIsPlaying(false);
                      }}
                    />
                  ) : (
                    <Play
                      onClick={(e) => {
                        e.stopPropagation();
                        audioRef.current.play();
                        setIsPlaying(true);
                      }}
                    />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext(e);
                  }}
                  className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-full transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default SongPlayer;
