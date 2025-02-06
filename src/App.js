import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
// import { CookiesProvider } from "react-cookie";

import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Game from "./Pages/Game";
import History from "./Pages/History";
import Manage from "./Pages/Manager";
import UserEdit from "./Pages/UserEdit";
import Leaderboard from "./Pages/Leaderboard";
import Profile from "./Pages/Profile";
import Openings from "./Pages/Opening";
import AddOpening from "./Pages/AddOpening";
import EditOpening from "./Pages/EditOpening";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/game" element={<Game />} />
          <Route path="/history" element={<History />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/manage/:_id/edit" element={<UserEdit />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile/:_id" element={<Profile />} />
          <Route path="/openings" element={<Openings />} />
          <Route path="/openings/add" element={<AddOpening />} />
          <Route path="/openings/edit/:_id" element={<EditOpening />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
