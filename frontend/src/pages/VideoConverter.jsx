import axios from "axios";
import {useState, useEffect} from "react";
import { useUser } from '../context/UserContext'
import { motion } from 'framer-motion'
import { Upload, Download, Youtube, Loader2, X, FileAudio, FileVideo, Trash2 } from 'lucide-react'

const VideoConverter = () => {
  const { user, signOut } = useUser()
  const [videos, setVideos] = useState([]);
  const [audioFile, setAudioFile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isYoutubeLoading, setIsYoutubeLoading] = useState(false);
  const API_URL = "http://localhost:3000";
  const [selectedFile, setSelectedFile] = useState(null)
  const [isConverting, setIsConverting] = useState(false)
  const [conversionProgress, setConversionProgress] = useState(0)
  const [audioFiles, setAudioFiles] = useState([])
  const [isYoutubeConverting, setIsYoutubeConverting] = useState(false)
  const [error, setError] = useState('')
  const [youtubeError, setYoutubeError] = useState('')

  // Convert YouTube video
  const convertYoutubeVideo = async (e) => {
    e.preventDefault();

    if (!youtubeUrl.trim()) {
      setMessage("Please enter a YouTube URL");
      return;
    }

    setIsYoutubeLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${API_URL}/api/songs/audio`, {
        id: youtubeUrl,
      });
      console.log(response)

      if (response?.data?.success === true) {
        console.log("yes")
        setAudioFile(response.data.data.link);
      } else {
        setMessage(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error converting YouTube video:", error);
      setMessage("Failed to convert YouTube video");
    } finally {
      setIsYoutubeLoading(false);
    }
  };

  // Helper function to validate YouTube URL

  return (
    <div className="min-h-screen bg-black text-green-400">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-green-400">Songify</h1>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-green-300">Welcome, {user.name}</span>
                <button
                  onClick={signOut}
                  className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a href="/login" className="text-green-400 hover:text-green-300">Login</a>
                <a href="/register" className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors">
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user ? (
          <div className="space-y-8">
            {/* File Upload Section */}
            <motion.div 
              className="bg-black/50 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-green-400">Convert Video to Audio</h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <label className="flex-1 w-full">
                    <div className="border-2 border-dashed border-green-500/30 rounded-lg p-6 text-center cursor-pointer hover:border-green-500/50 transition-colors">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Upload className="w-12 h-12 mx-auto mb-2 text-green-400" />
                      <p className="text-green-300">Click to upload or drag and drop</p>
                      <p className="text-sm text-green-400/60">MP4, WebM, or MOV (max. 100MB)</p>
                    </div>
                  </label>
                  {selectedFile && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 bg-green-500/10 p-3 rounded-lg"
                    >
                      <FileVideo className="w-5 h-5 text-green-400" />
                      <span className="text-green-300">{selectedFile.name}</span>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-green-400 hover:text-green-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </div>
                <button
                  onClick={handleConvert}
                  disabled={!selectedFile || isConverting}
                  className="w-full sm:w-auto px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Converting... {conversionProgress}%
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Convert to MP3
                    </>
                  )}
                </button>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 bg-red-500/10 p-3 rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* YouTube Section */}
            <motion.div 
              className="bg-black/50 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-green-400">Convert YouTube Video</h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="Enter YouTube URL"
                    className="flex-1 px-4 py-2 bg-black/50 border border-green-500/30 rounded-lg text-green-300 placeholder-green-400/50 focus:outline-none focus:border-green-500/50"
                  />
                  <button
                    onClick={handleYoutubeConvert}
                    disabled={!youtubeUrl || isYoutubeConverting}
                    className="px-6 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isYoutubeConverting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Converting...
                      </>
                    ) : (
                      <>
                        <Youtube className="w-5 h-5" />
                        Convert
                      </>
                    )}
                  </button>
                </div>
                {youtubeError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 bg-red-500/10 p-3 rounded-lg"
                  >
                    {youtubeError}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Audio Files Section */}
            <motion.div 
              className="bg-black/50 border border-green-500/20 rounded-xl p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-green-400">Your Audio Files</h2>
              <div className="space-y-4">
                {audioFiles.length === 0 ? (
                  <p className="text-green-400/60 text-center py-8">No audio files yet</p>
                ) : (
                  <div className="grid gap-4">
                    {audioFiles.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-green-500/5 rounded-lg border border-green-500/10"
                      >
                        <div className="flex items-center gap-3">
                          <FileAudio className="w-6 h-6 text-green-400" />
                          <div>
                            <p className="text-green-300">{file.filename}</p>
                            <p className="text-sm text-green-400/60">{new Date(file.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`/api/download/${file.id}`}
                            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors"
                          >
                            <Download className="w-5 h-5" />
                          </a>
                          <button
                            onClick={() => handleDelete(file.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4 text-green-400">Welcome to Songify</h2>
            <p className="text-green-300 mb-8">Please sign in to convert your videos to audio</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/login"
                className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
              >
                Create Account
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VideoConverter;
