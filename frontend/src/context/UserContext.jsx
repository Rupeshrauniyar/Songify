import {createContext, useState, useContext, useEffect} from "react";
import axios from "axios";
const UserContext = createContext();
export const useUser = () => useContext(UserContext);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const api = import.meta.env.VITE_YOUTUBE_API_KEY;

export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState([
    {
      kind: "youtube#searchResult",
      etag: "WD77UcYSfRzP-IqK6s4ycp2WrT4",
      id: {
        kind: "youtube#video",
        videoId: "pIvf9bOPXIw",
      },
      snippet: {
        publishedAt: "2024-09-05T10:30:22Z",
        channelId: "UCjeD2I8jwXg2l_nvXb_6Hzw",
        title: "Feel Good Hindi Songs | Audio Jukebox | Upbeat Bollywood Songs",
        description: "Packed with upbeat, cheerful tunes, this jukebox is your perfect companion for a mood boost! Press play, let loose, and enjoy the ...",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/pIvf9bOPXIw/default.jpg",
            width: 120,
            height: 90,
          },
          medium: {
            url: "https://i.ytimg.com/vi/pIvf9bOPXIw/mqdefault.jpg",
            width: 320,
            height: 180,
          },
          high: {
            url: "https://i.ytimg.com/vi/pIvf9bOPXIw/hqdefault.jpg",
            width: 480,
            height: 360,
          },
        },
        channelTitle: "YRF Music",
        liveBroadcastContent: "none",
        publishTime: "2024-09-05T10:30:22Z",
      },
    },
    {
      kind: "youtube#searchResult",
      etag: "qrb5uTxssjUYkDZXH55FPc5HpS8",
      id: {
        kind: "youtube#video",
        videoId: "LElOSR7cJyM",
      },
      snippet: {
        publishedAt: "2025-02-13T10:30:08Z",
        channelId: "UCjeD2I8jwXg2l_nvXb_6Hzw",
        title: "Top 20 Bollywood Romance  | Audio Jukebox | Best Hindi Love Songs | Romantic Bollywood Hits",
        description: "20 love anthems, endless feels! Tune in for ultimate heart-eyes and all the butterflies ▻ YRF New Releases: ...",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/LElOSR7cJyM/default.jpg",
            width: 120,
            height: 90,
          },
          medium: {
            url: "https://i.ytimg.com/vi/LElOSR7cJyM/mqdefault.jpg",
            width: 320,
            height: 180,
          },
          high: {
            url: "https://i.ytimg.com/vi/LElOSR7cJyM/hqdefault.jpg",
            width: 480,
            height: 360,
          },
        },
        channelTitle: "YRF Music",
        liveBroadcastContent: "none",
        publishTime: "2025-02-13T10:30:08Z",
      },
    },
    {
      kind: "youtube#searchResult",
      etag: "77O2qAHNi0V46jT8qTDv9OPq-6A",
      id: {
        kind: "youtube#video",
        videoId: "ow77NqggH-0",
      },
      snippet: {
        publishedAt: "2024-02-26T05:30:26Z",
        channelId: "UCq-Fj5jknLsUf-MWSy4_brA",
        title: "Laal Peeli Akhiyaan (Full Video) Shahid Kapoor,Kriti,Tanishq,Romy | Teri Baaton Mein Aisa Uljha Jiya",
        description: 'Presenting the Full Video Song "Teri Baaton Mein Aisa Uljha Jiya". Starring Shahid Kapoor, Kriti Sanon, Dharmendra and Dimple ...',
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/ow77NqggH-0/default.jpg",
            width: 120,
            height: 90,
          },
          medium: {
            url: "https://i.ytimg.com/vi/ow77NqggH-0/mqdefault.jpg",
            width: 320,
            height: 180,
          },
          high: {
            url: "https://i.ytimg.com/vi/ow77NqggH-0/hqdefault.jpg",
            width: 480,
            height: 360,
          },
        },
        channelTitle: "T-Series",
        liveBroadcastContent: "none",
        publishTime: "2024-02-26T05:30:26Z",
      },
    },
    {
      kind: "youtube#searchResult",
      etag: "czjm1LjyuqDU4y63dnohD0Shc2M",
      id: {
        kind: "youtube#video",
        videoId: "bi5PhlIQpwU",
      },
      snippet: {
        publishedAt: "2021-06-01T07:00:16Z",
        channelId: "UC3MLnJtqc_phABBriLRhtgQ",
        title: "Nadiyon Paar - Full Song |Roohi | Janhvi Kapoor| Sachin-Jigar | Shamur | Rashmeet K",
        description: "Presenting your favourite dance anthem #NadiyonPaaar to make you groove. #NadiyonPaar #LetTheMusicPlay #Janhvi #Dance ...",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/bi5PhlIQpwU/default.jpg",
            width: 120,
            height: 90,
          },
          medium: {
            url: "https://i.ytimg.com/vi/bi5PhlIQpwU/mqdefault.jpg",
            width: 320,
            height: 180,
          },
          high: {
            url: "https://i.ytimg.com/vi/bi5PhlIQpwU/hqdefault.jpg",
            width: 480,
            height: 360,
          },
        },
        channelTitle: "SonyMusicIndiaVEVO",
        liveBroadcastContent: "none",
        publishTime: "2021-06-01T07:00:16Z",
      },
    },
    {
      kind: "youtube#searchResult",
      etag: "qcAYP-M2eAlKp9elMepYQTpd-T0",
      id: {
        kind: "youtube#video",
        videoId: "VCNLZflKQ7o",
      },
      snippet: {
        publishedAt: "2024-08-16T10:15:14Z",
        channelId: "UCkvcvyPoEBRRynYpYVKYjdA",
        title: "Tere Hawaale - Full Video | Laal Singh Chaddha | Aamir, Kareena | Arijit, Shilpa | Pritam, Amitabh",
        description: 'Experience the Deep Emotions of "Tere Hawaale" from the Critically Acclaimed Laal Singh Chaddha Watch the full video of ...',
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/VCNLZflKQ7o/default.jpg",
            width: 120,
            height: 90,
          },
          medium: {
            url: "https://i.ytimg.com/vi/VCNLZflKQ7o/mqdefault.jpg",
            width: 320,
            height: 180,
          },
          high: {
            url: "https://i.ytimg.com/vi/VCNLZflKQ7o/hqdefault.jpg",
            width: 480,
            height: 360,
          },
        },
        channelTitle: "Explore With Liana",
        liveBroadcastContent: "none",
        publishTime: "2024-08-16T10:15:14Z",
      },
    },
  ]);
  const [selectedSong, setSelectedSong] = useState({});
  const [selectedIndex, setSelectedIndex] = useState();
  const [audioUrl, setAudioUrl] = useState(null);
  const [songsLoading, setSongsLoading] = useState(true);
  const [rapidProcessing, setRapidProcessing] = useState(false);
  const checkLoggedIn = async () => {
    try {
      // Check localStorage first for token
      const token = localStorage.getItem("token");
      if (token) {
        // Validate token with backend (you'll need to implement this endpoint)
        const response = await fetch("/api/auth/validate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token invalid, remove it
          localStorage.removeItem("token");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setLoading(false);
    }
  };
  const getSongs = async () => {
    setSongsLoading(true);
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=14&chart=mostPopular&regionCode=IN&key=${api}&q=viral+bollywood+movie+songs&type=video`
    );
    console.log(response);
    if (response.status === 200) {
      setSongs(response.data.items);
      setSongsLoading(false);
    } else {
      setSongsLoading(false);
    }
  };

  const fetchData = async (id) => {
    console.log(id);
    setRapidProcessing(true);
    try {
      const options = {
        method: "GET",
        url: "https://youtube-mp36.p.rapidapi.com/dl",
        params: {id},
        headers: {
          "x-rapidapi-key": import.meta.env.VITE_RAPID_API_KEY,
          "x-rapidapi-host": "youtube-mp36.p.rapidapi.com",
        },
      };
      const response = await axios.request(options);

      if (response.data) {
        setAudioUrl(response.data.link);
        setRapidProcessing(false);
      } else {
        setRapidProcessing(false);
      }
    } catch (error) {
      console.error(error);
      setRapidProcessing(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {email, password});

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setUser(data.user);
      return {success: true};
    } catch (error) {
      console.error("Login error:", error);
      return {success: false, error: error.message};
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      setUser(data.user);
      return {success: true};
    } catch (error) {
      console.error("Registration error:", error);
      return {success: false, error: error.message};
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    signIn,
    signUp,
    signOut,
    getSongs,
    songs,
    songsLoading,
    selectedSong,
    setSelectedSong,
    audioUrl,
    setAudioUrl,
    selectedIndex,
    setSelectedIndex,
    fetchData,
    rapidProcessing,
    setRapidProcessing,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
