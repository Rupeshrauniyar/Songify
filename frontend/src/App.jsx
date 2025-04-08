import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import VideoConverter from "./pages/VideoConverter";
import Login from "./pages/Login";
import Register from "./pages/Register";
import {UserProvider} from "./context/UserContext";
import Home from "./pages/Home";
import TopNavbar from "./components/Top-Navbar";
import BottomNavbar from "./components/Bottom-Navbar";
import SongPlayer from "./components/SongPlayer";
const App = () => {
  return (
    <UserProvider>
      <div className="w-full h-screen bg-black text-white ">
        <Router>
          <TopNavbar />
          <BottomNavbar />
          <div className="pt-18"></div>
          <SongPlayer />
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/register"
              element={<Register />}
            />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
};

export default App;
