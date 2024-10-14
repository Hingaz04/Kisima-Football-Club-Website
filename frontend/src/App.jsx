import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Team from "./Pages/Team";
import History from "./Pages/History";
import About from "./Pages/About";
import Schedule from "./Admin/Schedule";
import Admin from "./Pages/Admin";
import News from "./Admin/News";
import SchedulePage from "./Pages/SchedulePage";
import "./index.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import AdminPage from "./Admin/AdminPage";
import Players from "./Admin/Players";
import AcademyPlayerPage from "./Pages/AcademyPlayerPage";
import AcademyNewsPage from "./Pages/AcademyNewsPage";
import AcademyPage from "./Pages/AcademyPage";
import AcademyNews from "./Admin/AcademyNews";
import AcademyPlayers from "./Admin/AcademyPlayers";
import ResultAdmin from "./Admin/ResultAdmin";
import WeekendPics from "./Admin/WeekendPics";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />
        <Route path="/schedule-page" element={<SchedulePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin_dashboard" element={<AdminPage />} />
        <Route path="/news" element={<News />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/players" element={<Players />} />
        <Route path="/academy-players" element={<AcademyPlayerPage />} />
        <Route path="/academy-news" element={<AcademyNewsPage />} />
        <Route path="/academy-players-admin" element={<AcademyPlayers />} />
        <Route path="/academy-news-admin" element={<AcademyNews />} />
        <Route path="/academy" element={<AcademyPage />} />
        <Route path="/results-admin" element={<ResultAdmin />} />
        <Route path="/weekend-pics" element={<WeekendPics />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
