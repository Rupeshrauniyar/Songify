import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { CapacitorMusicControls  } from 'capacitor-music-controls-plugin';

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
    this.setupAppEvents();
  }

  setupAppEvents() {
    // Handle app state changes
    App.addListener('appStateChange', ({ isActive }) => {
      if (!isActive && this.isPlaying) {
        // App went to background - ensure music keeps playing
        this.updateMusicControls();
      }
    });

    // Handle device back button (Android)
    App.addListener('backButton', () => {
      // Prevent back button from stopping music
      return false;
    });
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
        this.updateMusicControls();
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
      this.updateMusicControls();
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
      this.updateMusicControls();
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
      this.updateMusicControls();
    } catch (error) {
      console.error('Error resuming track:', error);
    }
  }

  skipToNext() {
    if (this.callbacks.onNext) {
      this.callbacks.onNext();
    }
  }

  skipToPrevious() {
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
        album: 'Songify',
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

  updateMusicControls() {
    // Only run on native platforms
    if (Capacitor.isNativePlatform() && this.currentTrack) {
      try {
        MusicControls.create({
          track: this.currentTrack.title || 'Unknown Title',
          artist: this.currentTrack.channelTitle || 'Unknown Artist',
          cover: this.currentTrack.thumbnail,
          isPlaying: this.isPlaying,
          dismissable: false,
          hasPrev: true,
          hasNext: true,
          hasClose: false,
          album: 'Songify',
          // Android
          ticker: `Now playing: ${this.currentTrack.title}`,
          // iOS
          duration: this.audioElement.duration ? this.audioElement.duration : 0,
          elapsed: this.audioElement.currentTime ? this.audioElement.currentTime : 0,
          hasSkipForward: true,
          hasSkipBackward: true,
          skipForwardInterval: 15,
          skipBackwardInterval: 15,
        });

        // Listen for control events
        MusicControls.addListener('controlsNotification', (info) => {
          const { action } = info;
          switch (action) {
            case 'play':
              this.resume();
              break;
            case 'pause':
              this.pause();
              break;
            case 'next':
              this.skipToNext();
              break;
            case 'prev':
              this.skipToPrevious();
              break;
          }
        });

        // Show the controls in notification area
        MusicControls.listen();
      } catch (error) {
        console.error('Error setting up music controls:', error);
      }
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