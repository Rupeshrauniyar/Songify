import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { CapacitorMusicControls } from "capacitor-music-controls-plugin";

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ArrowDown,
  GripHorizontal,
  Download,
  Loader2,
  Check,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import SongsRenderer from "./SongsRenderer";
import audioService from "../services/BackgroundAudioService";
import { Filesystem, Directory } from "@capacitor/filesystem";
// Format seconds to MM:SS or HH:MM:SS
const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n) => (n < 10 ? `0${n}` : String(n));
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
};

const SongPlayer = () => {
  const audioRef = useRef(null);
  const playerRef = useRef(null);
  const callbacksRef = useRef({});
  const stateRef = useRef({ selectedIndex: 0, songs: [] });
  const {
    rapidProcessing,
    songs,
    selectedSong,
    selectedIndex,
    setSelectedIndex,
    setSelectedSong,
    audioUrl,
    fetchData,
    open,
    addToHistory,
  } = useUser();
  const [isPlaying, setIsPlaying] = useState(false);
  const [songCurrentTime, setSongCurrentTime] = useState(0);
  const [songDuration, setSongDuration] = useState(0);
  const [ended, setEnded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("idle"); // idle | downloading | processing | saving | done | error
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState(null);

  // Keep refs in sync for notification handlers (avoids stale closures)
  stateRef.current = { selectedIndex, songs };
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
  const onPlayPause = () => {
    if (isPlaying) {
      audioService.pause();
      setIsPlaying(false);
      CapacitorMusicControls.updateIsPlaying({ isPlaying: false });
    } else {
      audioService.resume();
      setIsPlaying(true);
      CapacitorMusicControls.updateIsPlaying({ isPlaying: true });
    }
  };

  const onNotificationPlayPause = useCallback(async () => {
    const currentlyPlaying = audioService.getPlaybackState();
    if (currentlyPlaying) {
      await audioService.pause();
      setIsPlaying(false);
    } else {
      await audioService.resume();
      setIsPlaying(true);
    }
  }, []);
  const playNextSong = useCallback(async () => {
    const { selectedIndex: idx, songs: s } = stateRef.current;
    if (idx >= s.length - 1) return;
    const next = s[idx + 1];
    const videoId = next?.id?.videoId ?? next?.id;
    if (!videoId) return;
    addToHistory?.(next);
    CapacitorMusicControls.updateIsPlaying({ isPlaying: false });
    audioService.pause();
    setSongCurrentTime(0);
    setSongDuration(0);
    setEnded(false);
    setSelectedIndex(idx + 1);
    setSelectedSong(next);
    await fetchData(videoId);
  }, [fetchData, addToHistory]);

  const playPreviousSong = useCallback(async () => {
    const { selectedIndex: idx, songs: s } = stateRef.current;
    if (idx <= 0) return;
    const prev = s[idx - 1];
    const videoId = prev?.id?.videoId ?? prev?.id;
    if (!videoId) return;
    addToHistory?.(prev);
    audioService.pause();
    setSongCurrentTime(0);
    setSongDuration(0);
    setEnded(false);
    setSelectedIndex(idx - 1);
    setSelectedSong(prev);
    await fetchData(videoId);
  }, [fetchData, addToHistory]);

  const onNext = () => playNextSong();
  const onPrevious = () => playPreviousSong();

  // Keep callbacks ref updated for audio service
  callbacksRef.current = {
    onNext: playNextSong,
    onPrevious: playPreviousSong,
    onPlayPause: onNotificationPlayPause,
  };

  useEffect(() => {
    audioService.setCallbacks(callbacksRef.current);
  }, [playNextSong, playPreviousSong]);

  useEffect(() => {
    const trackTitle =
      selectedSong?.title || selectedSong?.snippet?.title || "Unknown";
    const trackArtist =
      selectedSong?.channelTitle ||
      selectedSong?.snippet?.channelTitle ||
      "Unknown Artist";
    const trackThumbnail =
      selectedSong?.thumbnails?.high?.url ||
      selectedSong?.snippet?.thumbnails?.high?.url ||
      null;

    if (audioUrl) {
      audioService
        .play({
          url: audioUrl,
          title: String(trackTitle),
          channelTitle: String(trackArtist),
          thumbnail: trackThumbnail ? String(trackThumbnail) : null,
        })
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });

      CapacitorMusicControls.create({
        track: trackTitle, // optional, default : ''
        artist: trackArtist, // optional, default : ''
        // album: "Absolution", // optional, default: ''
        cover: trackThumbnail, // optional, default : nothing
        // cover can be a local path (use fullpath 'file:///storage/emulated/...',
        // or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
        // or a remote url ('http://...', 'https://...', 'ftp://...')

        // hide previous/next/close buttons:
        hasPrev: true, // show previous button, optional, default: true
        hasNext: true, // show next button, optional, default: true
        hasClose: false, // show close button, optional, default: false

        // iOS only, all optional
        duration: 60, // default: 0
        elapsed: 10, // default: 0
        hasSkipForward: true, // default: false. true value overrides hasNext.
        hasSkipBackward: true, // default: false. true value overrides hasPrev.
        skipForwardInterval: 15, // default: 15.
        skipBackwardInterval: 15, // default: 15.
        hasScrubbing: true, // default: false. Enable scrubbing from control center progress bar

        // Android only, all optional
        isPlaying: true, // default : true
        dismissable: true, // default : false
        // text displayed in the status bar when the notification (and the ticker) are updated
        ticker: `Now playing ${trackTitle}`,
        // All icons default to their built-in android equivalents
        // The supplied drawable name, e.g. 'media_play', is the name of a drawable found under android/res/drawable* folders
        playIcon: "media_play",
        pauseIcon: "media_pause",
        prevIcon: "media_prev",
        nextIcon: "media_next",

        notificationIcon: "notification",
      }).catch((e) => {
        console.log(e);
      });
    }
  }, [audioUrl, selectedSong]);
  useEffect(() => {
    // IOS
    CapacitorMusicControls.addListener("controlsNotification", (info) => {
      handleControlsEvent(info);
    });

    document.addEventListener("controlsNotification", (event) => {
      const info = { message: event.message, position: 0 };
      handleControlsEvent(info);
    });
  }, []);
  const handleControlsEvent = async (action) => {
    const message = action?.message;
    const { selectedIndex: idx, songs: s } = stateRef.current;

    switch (message) {
      case "music-controls-next":
        if (idx < s.length - 1) {
          try {
            const next = s[idx + 1];
            const nextVideoId = next?.id?.videoId ?? next?.id;
            if (nextVideoId) addToHistory?.(next);
            CapacitorMusicControls.updateIsPlaying({ isPlaying: false });
            audioService.pause();
            setSongCurrentTime(0);
            setSongDuration(0);
            setEnded(false);
            setSelectedIndex(idx + 1);
            setSelectedSong(next);
            await fetchData(nextVideoId);
          } catch (err) {
            console.error("Next song error:", err?.message);
          }
        }
        break;

      case "music-controls-previous":
        if (idx > 0) {
          try {
            const prev = s[idx - 1];
            const prevVideoId = prev?.id?.videoId ?? prev?.id;
            if (prevVideoId) addToHistory?.(prev);
            CapacitorMusicControls.updateIsPlaying({ isPlaying: false });
            audioService.pause();
            setSongCurrentTime(0);
            setSongDuration(0);
            setEnded(false);
            setSelectedIndex(idx - 1);
            setSelectedSong(prev);
            await fetchData(prevVideoId);
          } catch (err) {
            console.error("Previous song error:", err?.message);
          }
        }
        break;

      // PAUSE
      case "music-controls-pause":
        audioService.pause();
        setIsPlaying(false);
        CapacitorMusicControls.updateIsPlaying({ isPlaying: false });

        break;

      // PLAY
      case "music-controls-play":
        audioService.resume();
        setIsPlaying(true);
        CapacitorMusicControls.updateIsPlaying({ isPlaying: true });

        break;

      case "music-controls-destroy":
        break;
      case "music-controls-scrubbing":
        if (audioService.audioElement && Number.isFinite(action?.position)) {
          const newTime = Math.max(0, action.position);
          audioService.audioElement.currentTime = newTime;
          setSongCurrentTime(newTime);
        }
        break;

      case "music-controls-toggle-play-pause":
        if (isPlaying) {
          audioService.pause();
          setIsPlaying(false);
          CapacitorMusicControls.updateIsPlaying({ isPlaying: false });
        } else {
          audioService.resume();
          setIsPlaying(true);
          CapacitorMusicControls.updateIsPlaying({ isPlaying: true });
        }
        break;

      default:
        break;
    }
  };

  // Track end is handled by audioService.audioElement's ended listener via callbacks

  // Sync playback time and duration from audio element
  useEffect(() => {
    if (!open || !audioService.audioElement) return;

    const el = audioService.audioElement;

    const handleTimeUpdate = () => {
      setSongCurrentTime(el.currentTime);
      if (el.duration && Number.isFinite(el.duration)) {
        setSongDuration(el.duration);
      }
    };

    const handleDurationChange = () => {
      if (el.duration && Number.isFinite(el.duration)) {
        setSongDuration(el.duration);
      }
    };

    el.addEventListener("timeupdate", handleTimeUpdate);
    el.addEventListener("durationchange", handleDurationChange);
    if (el.duration && Number.isFinite(el.duration)) {
      setSongDuration(el.duration);
    }

    return () => {
      el.removeEventListener("timeupdate", handleTimeUpdate);
      el.removeEventListener("durationchange", handleDurationChange);
    };
  }, [open, audioService.audioElement]);

  const download = async () => {
    if (!audioUrl || !selectedSong?.snippet) return;

    setDownloadError(null);
    setDownloadStatus("downloading");
    setDownloadProgress(0);

    try {
      await Filesystem.requestPermissions();

      // Fetch with progress tracking
      const res = await fetch(audioUrl);
      if (!res.ok) throw new Error("Network response was not ok");

      const contentLength = res.headers.get("Content-Length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      const reader = res.body?.getReader?.();

      let blob;
      if (reader) {
        const chunks = [];
        let receivedLength = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedLength += value.length;
          if (total > 0) {
            setDownloadProgress(
              Math.min(90, Math.round((receivedLength / total) * 80))
            );
          } else {
            setDownloadProgress(50); // Indeterminate: show activity
          }
        }
        blob = new Blob(chunks);
      } else {
        blob = await res.blob();
        setDownloadProgress(80);
      }

      setDownloadStatus("processing");
      setDownloadProgress(85);
      const base64 = await convertToBase64(blob);

      const rawTitle =
        selectedSong?.snippet?.title || selectedSong?.title || "Unknown";
      const sanitizedName =
        rawTitle
          .replace(/[^a-zA-Z0-9\u0900-\u097F ]/g, "_")
          .replace(/_+/g, "_")
          .trim() || "song";
      const fileName = sanitizedName.slice(0, 100);

      setDownloadStatus("saving");
      setDownloadProgress(92);
      const audioUri = await saveAudioToFilesystem(base64, fileName);

      const thumbnailUrl =
        selectedSong?.snippet?.thumbnails?.high?.url ||
        selectedSong?.snippet?.thumbnails?.medium?.url ||
        selectedSong?.thumbnails?.high?.url ||
        selectedSong?.snippet?.thumbnails?.default?.url ||
        "";
      const channelTitle =
        selectedSong?.snippet?.channelTitle ||
        selectedSong?.channelTitle ||
        "Unknown Channel";

      const downloads = JSON.parse(localStorage.getItem("downloads") || "[]");
      const meta = {
        id: selectedSong?.id?.videoId || selectedSong?.id || Date.now(),
        title: rawTitle,
        channelTitle,
        thumbnailUrl,
        selectedSong,
        fileName: fileName + ".mp3",
        fileUri: audioUri,
        downloaded: true,
        time: Date.now(),
      };
      downloads.push(meta);
      localStorage.setItem("downloads", JSON.stringify(downloads));

      setDownloadProgress(100);
      setDownloadStatus("done");
      setTimeout(() => setDownloadStatus("idle"), 2500);
    } catch (err) {
      setDownloadError(err?.message || "Download failed");
      setDownloadStatus("error");
      setTimeout(() => setDownloadStatus("idle"), 4000);
    }
  };

  const saveAudioToFilesystem = async (base64, fileName) => {
    const fullPath = `Downloads/${fileName}.mp3`;

    try {
      // Try creating the directory (ignore if exists)
      await Filesystem.mkdir({
        path: "Downloads",
        directory: Directory.External,
        recursive: true,
      });
    } catch (e) {
      // Directory exists — ignore error
    }

    const result = await Filesystem.writeFile({
      path: fullPath,
      data: base64,
      directory: Directory.External, // PUBLIC STORAGE
      recursive: true,
    });

    return result.uri; // file:///storage/emulated/0/Download/Songify/myfile.mp3
  };

  const convertToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      // console.log(blob);
      reader.onerror = reject;
      reader.onload = () => {
        // console.log(reader.result.split(",")[1]);
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });
  };
  // download();
  return (
    <>
      <audio
        ref={audioRef}
        src={null}
      />

      {open ? (
        <>
          {/* {console.log(songCurrentHour, songCurrentMinutes, songCurrentSeconds, songDurationHours, songDurationMinutes, songDurationSeconds, open, audioRef)} */}
          <motion.div
            initial={{ x: 0, y: -1000 }}
            animate={{ x: -1, y: -0 }}
            className="fixed overflow-y-auto bottom-22 top-0 left-0 right-0  bg-black w-full h-full text-white z-40 border border-green-500/20"
          >
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
              <div className="w-full h-60 flex flex-col  items-center justify-center">
                <div className="w-full h-50 rounded-md  overflow-hidden bg-zinc-800 relative">
                  {rapidProcessing ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
                    </div>
                  ) : (
                    <span className="w-full flex items-center justify-center ">
                      <img
                        src={selectedSong?.snippet?.thumbnails?.high?.url}
                        alt={selectedSong?.snippet?.title}
                        className={`w-full h-full object-cover blur-[3px] rounded-md scale-133 object-center absolute top-0 left-0 z-[1000]`}
                      />
                      <span className="w-50 h-47 my-1 rounded-md overflow-hidden  bg-zinc-800 relative">
                        <img
                          src={selectedSong?.snippet?.thumbnails?.high?.url}
                          alt={selectedSong?.snippet?.title}
                          className={`w-50 h-50 object-cover  object-center z-[1001] rounded-md relative `}
                        />
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* Song Info */}
              <div className="space-y-0.5 text-center min-h-[3rem]">
                {rapidProcessing ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-zinc-700 rounded w-3/4 mx-auto" />
                    <div className="h-3 bg-zinc-800 rounded w-1/2 mx-auto" />
                  </div>
                ) : (
                  <>
                    <h3 className="text-green-300 text-sm font-medium truncate">
                      {selectedSong?.snippet?.title || "No title"}
                    </h3>
                    <p className="text-green-400/60 text-xs truncate">
                      {selectedSong?.snippet?.channelTitle || "Unknown Channel"}
                    </p>
                  </>
                )}
              </div>

              {/* Playback Controls */}
              <div className="w-full flex flex-col items-center justify-center">
                <input
                  type="range"
                  min={0}
                  max={
                    Number.isFinite(songDuration) && songDuration > 0
                      ? songDuration
                      : 1
                  }
                  value={Math.min(songCurrentTime, songDuration || 0)}
                  onChange={(e) => {
                    const newTime = parseFloat(e.target.value);
                    if (audioService.audioElement && Number.isFinite(newTime)) {
                      audioService.audioElement.currentTime = newTime;
                      setSongCurrentTime(newTime);
                    }
                  }}
                  disabled={rapidProcessing || !audioUrl}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-green-500 bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="w-full flex items-center justify-between mt-2">
                  <span className="text-green-400/60 text-xs" />
                  <span className="text-green-400/60 text-sm tabular-nums">
                    {formatTime(songCurrentTime)} / {formatTime(songDuration)}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1 px-16 border-t border-green-500/20">
                <button
                  onClick={onPrevious}
                  disabled={rapidProcessing || (selectedIndex ?? 0) <= 0}
                  className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!rapidProcessing) onPlayPause();
                  }}
                  disabled={rapidProcessing}
                  className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-full transition-colors disabled:opacity-60 disabled:cursor-wait flex items-center justify-center min-w-[2.5rem] min-h-[2.5rem]"
                >
                  {rapidProcessing ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>

                <button
                  onClick={onNext}
                  disabled={
                    rapidProcessing ||
                    (selectedIndex ?? 0) >= (songs?.length ?? 1) - 1
                  }
                  className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {(downloadStatus === "downloading" ||
                  downloadStatus === "processing" ||
                  downloadStatus === "saving") && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-green-400/80">
                      <span>
                        {downloadStatus === "downloading" && "Downloading…"}
                        {downloadStatus === "processing" && "Processing…"}
                        {downloadStatus === "saving" && "Saving to device…"}
                      </span>
                      <span className="tabular-nums">{downloadProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-green-500 transition-all duration-300 ease-out"
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                {downloadStatus === "done" && (
                  <p className="text-green-400 text-sm flex items-center gap-1.5">
                    <Check className="w-4 h-4 flex-shrink-0" />
                    Downloaded successfully
                  </p>
                )}
                {downloadStatus === "error" && (
                  <p className="text-red-400 text-xs">{downloadError}</p>
                )}
                <div className="flex items-center justify-between">
                  <span />
                  <button
                    onClick={download}
                    disabled={
                      rapidProcessing ||
                      !audioUrl ||
                      !selectedSong?.snippet ||
                      downloadStatus === "downloading" ||
                      downloadStatus === "processing" ||
                      downloadStatus === "saving"
                    }
                    className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 bg-white rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {downloadStatus === "downloading" ||
                    downloadStatus === "processing" ||
                    downloadStatus === "saving" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : downloadStatus === "done" ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Download className="w-10 h-5" />
                    )}
                  </button>
                </div>
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
            initial={{ x: -0, y: -30 }}
            // Animation when component mounts
            animate={{ x: -0, y: -10 }}
            exit={{ opacity: 0 }}
            // transition={{type: "spring", stiffness: 100}}
            className="fixed bottom-18  right-0 bg-zinc-800 w-60 h-60 rounded-xl text-white z-50 border border-green-500/20 shadow-lg"
            onClick={handlePlayerClick}
          >
            <div className="p-3 space-y-2">
              <div
                className="relative w-full h-32 mx-auto overflow-hidden rounded-lg bg-zinc-800"
                onPointerDown={(e) => {
                  if (playerRef.current) {
                    playerRef.current._dragOriginElement = e.target;
                  }
                }}
              >
                {rapidProcessing ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
                  </div>
                ) : (
                  <img
                    src={selectedSong?.snippet?.thumbnails?.high?.url}
                    alt={selectedSong?.snippet?.title}
                    className="w-full h-full object-cover"
                    draggable="false"
                  />
                )}
                <div className="absolute top-2 left-0 right-0 flex justify-center">
                  <div className="bg-black/30 backdrop-blur-sm p-1 rounded-full">
                    <GripHorizontal className="w-5 h-5 text-white/70" />
                  </div>
                </div>
              </div>

              {/* Song Info */}
              <div className="space-y-0.5 text-center min-h-[2.5rem]">
                {rapidProcessing ? (
                  <div className="space-y-1 animate-pulse">
                    <div className="h-3 bg-zinc-700 rounded w-full" />
                    <div className="h-2.5 bg-zinc-800 rounded w-2/3 mx-auto" />
                  </div>
                ) : (
                  <>
                    <h3 className="text-green-300 text-sm font-medium truncate">
                      {selectedSong?.snippet?.title || "No title"}
                    </h3>
                    <p className="text-green-400/60 text-xs truncate">
                      {selectedSong?.snippet?.channelTitle || "Unknown Channel"}
                    </p>
                  </>
                )}
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-2 pt-1 border-t border-green-500/20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!rapidProcessing && (selectedIndex ?? 0) > 0)
                      onPrevious();
                  }}
                  disabled={rapidProcessing || (selectedIndex ?? 0) <= 0}
                  className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!rapidProcessing) onPlayPause();
                  }}
                  disabled={rapidProcessing}
                  className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-full transition-colors disabled:opacity-60 disabled:cursor-wait flex items-center justify-center min-w-[2rem] min-h-[2rem]"
                >
                  {rapidProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      !rapidProcessing &&
                      (selectedIndex ?? 0) < (songs?.length ?? 1) - 1
                    )
                      onNext();
                  }}
                  disabled={
                    rapidProcessing ||
                    (selectedIndex ?? 0) >= (songs?.length ?? 1) - 1
                  }
                  className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
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
