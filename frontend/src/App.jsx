import {BrowserRouter as Router, Routes, Route, useNavigate, useLocation} from "react-router-dom";
import {useState, useEffect} from "react";

import {UserProvider} from "./context/UserContext";
import Home from "./pages/Home";
import TopNavbar from "./components/Top-Navbar";
import BottomNavbar from "./components/Bottom-Navbar";
import SongPlayer from "./components/SongPlayer";
import SongPlayerOpened from "./middlewares/SongPlayerOpened";
import Search from "./pages/Search";
import Downloads from "./pages/Downloads";
import Playlist from "./pages/Playlist";
import History from "./pages/History";
import Notfound from "./components/Notfound";
import {SplashScreen} from "@capacitor/splash-screen";
import {App} from "@capacitor/app";

// Component to handle back button navigation
const BackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [lastBackPress, setLastBackPress] = useState(0);
  const EXIT_TIMEOUT = 2000; // 2 seconds to press back again to exit

  useEffect(() => {
    const handleBackButton = async () => {
      // Get URL parameters (for example, checking if player is open)
      const urlParams = new URLSearchParams(window.location.search);
      const isPlayerOpen = urlParams.get('open') === 'true';

      // If player is open, close it instead of navigating back
      if (isPlayerOpen) {
        navigate('?open=false');
        return;
      }

      // If we're on the home page, show exit confirmation
      if (location.pathname === '/') {
        const now = new Date().getTime();
        
        if (now - lastBackPress < EXIT_TIMEOUT) {
          // User pressed back button twice within timeout, exit app
          App.exitApp();
        } else {
          // First press, show toast and update timestamp
          setLastBackPress(now);
          
          // Show a toast message
          const toast = document.createElement('div');
          toast.className = 'fixed bottom-20 left-0 right-0 mx-auto w-64 p-2 bg-zinc-800 text-white text-center rounded-lg z-50';
          toast.textContent = 'Press back again to exit';
          document.body.appendChild(toast);
          
          // Remove toast after 2 seconds
          setTimeout(() => {
            if (document.body.contains(toast)) {
              document.body.removeChild(toast);
            }
          }, EXIT_TIMEOUT);
          
          return;
        }
      } else {
        // Otherwise go back in history
        navigate(-1);
      }
    };

    // Register hardware back button event handler
    const backButtonListener = App.addListener('backButton', handleBackButton);

    // Cleanup
    return () => {
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, [navigate, location.pathname, lastBackPress]);

  return null;
};

const AppWithRouter = () => {
  return (
    <Router>
      <BackButtonHandler />
      <TopNavbar />
      <div className="xl:w-[20%] w-full">
        <BottomNavbar />
      </div>
      <SongPlayer />
      <div className="xl:w-[80%] w-full ml-0 mt-0 xl:ml-[20%] mt-16">
        <Routes>
          <Route element={<SongPlayerOpened />}>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/search"
              element={<Search />}
            />
            <Route
              path="/downloads"
              element={<Downloads />}
            />
            <Route
              path="/playlist"
              element={<Playlist />}
            />
            <Route
              path="/history"
              element={<History />}
            />
          </Route>
          <Route
            path="*"
            element={<Notfound />}
          />
        </Routes>
      </div>
    </Router>
  );
};

const ReactApp = () => {
  useEffect(() => {
    const hideSplashScreen = async () => {
      try {
        await SplashScreen.hide();
      } catch (error) {
        console.error("Error hiding splash screen:", error);
      }
    };

    // Hide splash screen after components are loaded
    hideSplashScreen();
  }, []);

  return (
    <UserProvider>
      <div className="w-full h-screen bg-black text-white">
        <AppWithRouter />
      </div>
    </UserProvider>
  );
};

export default ReactApp;
