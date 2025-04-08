import { Platform } from 'react-native';
import TrackPlayer, { 
  Event, 
  State, 
  useTrackPlayerEvents,
  usePlaybackState
} from 'react-native-track-player';

const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      stopWithApp: false,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      ],
      compactCapabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      ],
    });
  } catch (error) {
    console.error('Error setting up player:', error);
  }
};

const addTrack = async (track) => {
  try {
    await TrackPlayer.add({
      id: track.id,
      url: track.url,
      title: track.title,
      artist: track.channelName,
      artwork: track.thumbnail,
    });
  } catch (error) {
    console.error('Error adding track:', error);
  }
};

const playTrack = async (track) => {
  try {
    await TrackPlayer.reset();
    await addTrack(track);
    await TrackPlayer.play();
  } catch (error) {
    console.error('Error playing track:', error);
  }
};

const togglePlayback = async (playbackState) => {
  try {
    if (playbackState === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  } catch (error) {
    console.error('Error toggling playback:', error);
  }
};

const skipToNext = async () => {
  try {
    await TrackPlayer.skipToNext();
  } catch (error) {
    console.error('Error skipping to next:', error);
  }
};

const skipToPrevious = async () => {
  try {
    await TrackPlayer.skipToPrevious();
  } catch (error) {
    console.error('Error skipping to previous:', error);
  }
};

export {
  setupPlayer,
  addTrack,
  playTrack,
  togglePlayback,
  skipToNext,
  skipToPrevious,
}; 