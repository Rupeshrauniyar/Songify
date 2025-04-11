import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

class AudioService {
  constructor() {
    this.audioElement = null;
    this.currentTrack = null;
    this.isPlaying = false;
    this.callbacks = {
      onNext: null,
      onPrevious: null,
      onPlayPause: null
    };
    this.setupAudio();
    this.setupMediaSession();
  }

  setupMediaSession() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        if (this.callbacks.onPlayPause) {
          this.callbacks.onPlayPause();
        }
      });
      
      navigator.mediaSession.setActionHandler('pause', () => {
        if (this.callbacks.onPlayPause) {
          this.callbacks.onPlayPause();
        }
      });
      
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        if (this.callbacks.onPrevious) {
          this.callbacks.onPrevious();
        }
      });
      
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        if (this.callbacks.onNext) {
          this.callbacks.onNext();
        }
      });
    }
  }

  setupAudio() {
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';
    
    // Add event listeners
    this.audioElement.addEventListener('ended', () => {
      this.handleTrackEnd();
    });

    // Handle visibility change for background playback
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.isPlaying) {
        // App went to background, keep playing
        this.audioElement.play();
      }
    });
  }

  setCallbacks(callbacks) {
    this.callbacks = {
      ...this.callbacks,
      ...callbacks
    };
  }

  async play(track) {
    if (!this.audioElement) return;
    
    try {
      this.currentTrack = track;
      this.audioElement.src = track.url;
      await this.audioElement.play();
      this.isPlaying = true;
      this.updateMediaSession();
    } catch (error) {
      console.error('Error playing track:', error);
    }
  }

  async pause() {
    if (!this.audioElement) return;
    
    try {
      await this.audioElement.pause();
      this.isPlaying = false;
      this.updateMediaSession();
    } catch (error) {
      console.error('Error pausing track:', error);
    }
  }

  async resume() {
    if (!this.audioElement) return;
    
    try {
      await this.audioElement.play();
      this.isPlaying = true;
      this.updateMediaSession();
    } catch (error) {
      console.error('Error resuming track:', error);
    }
  }

  async skipToNext() {
    if (this.callbacks.onNext) {
      this.callbacks.onNext();
    }
  }

  async skipToPrevious() {
    if (this.callbacks.onPrevious) {
      this.callbacks.onPrevious();
    }
  }

  handleTrackEnd() {
    this.isPlaying = false;
    if (this.callbacks.onNext) {
      this.callbacks.onNext();
    }
  }

  updateMediaSession() {
    if ('mediaSession' in navigator && this.currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.currentTrack.title || 'Unknown Title',
        artist: this.currentTrack.channelTitle || 'Unknown Channel',
        album: 'YouTube Audio',
        artwork: [
          { src: this.currentTrack.thumbnail, sizes: '96x96', type: 'image/jpeg' },
          { src: this.currentTrack.thumbnail, sizes: '128x128', type: 'image/jpeg' },
          { src: this.currentTrack.thumbnail, sizes: '192x192', type: 'image/jpeg' },
          { src: this.currentTrack.thumbnail, sizes: '256x256', type: 'image/jpeg' },
          { src: this.currentTrack.thumbnail, sizes: '384x384', type: 'image/jpeg' },
          { src: this.currentTrack.thumbnail, sizes: '512x512', type: 'image/jpeg' },
        ]
      });

      navigator.mediaSession.playbackState = this.isPlaying ? 'playing' : 'paused';
    }
  }

  getCurrentTrack() {
    return this.currentTrack;
  }

  getPlaybackState() {
    return this.isPlaying;
  }
}

// Create a single instance of the service
const audioService = new AudioService();

export default audioService; 