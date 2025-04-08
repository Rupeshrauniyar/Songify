import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { usePlaybackState } from 'react-native-track-player';
import {
  setupPlayer,
  playTrack,
  togglePlayback,
  skipToNext,
  skipToPrevious,
} from '../services/BackgroundAudioService';

const SongPlayer = ({ song, onNext, onPrevious }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackState = usePlaybackState();

  useEffect(() => {
    setupPlayer();
  }, []);

  useEffect(() => {
    if (playbackState === State.Playing) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [playbackState]);

  const handlePlayPause = async () => {
    if (song) {
      if (!isPlaying) {
        await playTrack(song);
      } else {
        await togglePlayback(playbackState);
      }
    }
  };

  const handleNext = async () => {
    await skipToNext();
    if (onNext) onNext();
  };

  const handlePrevious = async () => {
    await skipToPrevious();
    if (onPrevious) onPrevious();
  };

  return (
    <motion.div
      drag
      dragConstraints={{
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}
      className="fixed bottom-22 right-2 bg-zinc-800 w-48 h-48 rounded-xl text-white z-50 border border-green-500/20">
      <div className="p-3 space-y-2">
        {/* Song Image */}
        <div className="relative w-24 h-24 mx-auto overflow-hidden rounded-lg">
          <img 
            src={song?.snippet?.thumbnails?.high?.url} 
            alt={song?.snippet?.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Song Info */}
        <div className="space-y-0.5 text-center">
          <h3 className="text-green-300 text-sm font-medium truncate">
            {song?.snippet?.title || "No title"}
          </h3>
          <p className="text-green-400/60 text-xs truncate">
            {song?.snippet?.channelTitle || "Unknown Channel"}
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-2 pt-1 border-t border-green-500/20">
          <button 
            onClick={handlePrevious}
            className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-full transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button 
            onClick={handlePlayPause}
            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-full transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          
          <button 
            onClick={handleNext}
            className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-full transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SongPlayer;
