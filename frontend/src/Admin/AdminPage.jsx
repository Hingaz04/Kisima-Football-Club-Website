import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Auth";
import axios from "axios";
import "./AdminPage.css";

const BASE_URL = "https://kisima-football-club-website-27xr.onrender.com";

// SAFE IMAGE HANDLER (IMPORTANT FIX)
const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
};

function AdminPage() {
  const [news, setNews] = useState([]);
  const [AdminSchedule, setAdminSchedule] = useState([]);
  const [players, setPlayers] = useState([]);
  const [academyPlayers, setAcademyPlayers] = useState([]);
  const [academyNews, setAcademyNews] = useState([]);
  const [results, setResults] = useState([]);
  const [weekendImages, setWeekendImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
    fetchAdminSchedule();
    fetchPlayers();
    fetchAcademyPlayers();
    fetchAcademyNews();
    fetchWeekendPictures();
    fetchResults();
  }, []);

  const getAuthHeader = () => ({
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"))?.access_token
    }`,
  });

  const fetchNews = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/news`, {
        headers: getAuthHeader(),
      });
      setNews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWeekendPictures = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/weekend`, {
        headers: getAuthHeader(),
      });
      setWeekendImages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAcademyNews = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/academy/news`, {
        headers: getAuthHeader(),
      });
      setAcademyNews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdminSchedule = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/fixtures`, {
        headers: getAuthHeader(),
      });
      setAdminSchedule(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/results`, {
        headers: getAuthHeader(),
      });
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPlayers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/players`, {
        headers: getAuthHeader(),
      });
      setPlayers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAcademyPlayers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/academy/players`, {
        headers: getAuthHeader(),
      });
      setAcademyPlayers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <div className="admin-page">
      <h1>Admin Page</h1>
      <button onClick={handleLogout}>Logout</button>

      {/* LINKS */}
      <div>
        <Link to="/news">Manage News</Link>
        <Link to="/admin-schedule">Manage Schedule</Link>
        <Link to="/players">Manage Players</Link>
        <Link to="/academy-players-admin">Academy Players</Link>
        <Link to="/academy-news-admin">Academy News</Link>
        <Link to="/results-admin">Results</Link>
        <Link to="/weekend-pics">Weekend Pics</Link>
      </div>

      {/* NEWS */}
      <section>
        <h2>Team News</h2>
        {news.map((item) => (
          <div key={item.id}>
            <img src={getImageUrl(item.image)} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </section>

      {/* WEEKEND */}
      <section>
        <h2>Team Pictures</h2>
        {weekendImages.map((item) => (
          <div key={item.id}>
            <img src={getImageUrl(item.weekendImages)} alt="" />
            <p>{item.date}</p>
          </div>
        ))}
      </section>

      {/* ACADEMY NEWS */}
      <section>
        <h2>Academy News</h2>
        {academyNews.map((item) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
            <img src={getImageUrl(item.image)} alt="" />
            <p>{item.description}</p>
          </div>
        ))}
      </section>

      {/* FIXTURES */}
      <section>
        <h2>Fixtures</h2>
        {AdminSchedule.map((item) => (
          <div key={item.id}>
            <img src={getImageUrl(item.homeTeamImage)} alt="" />
            <h2>VS</h2>
            <img src={getImageUrl(item.awayTeamImage)} alt="" />
            <p>{item.venue}</p>
            <p>{item.date}</p>
          </div>
        ))}
      </section>

      {/* RESULTS */}
      <section>
        <h2>Results</h2>
        {results.map((item) => (
          <div key={item.id}>
            <img src={getImageUrl(item.homeTeamImage)} alt="" />
            <h2>VS</h2>
            <img src={getImageUrl(item.awayTeamImage)} alt="" />
            <p>{item.result}</p>
          </div>
        ))}
      </section>

      {/* PLAYERS */}
      <section>
        <h2>Players</h2>
        {players.map((p) => (
          <div key={p.id}>
            <p>{p.name}</p>
            <p>{p.position}</p>
          </div>
        ))}
      </section>

      {/* ACADEMY PLAYERS */}
      <section>
        <h2>Academy Players</h2>
        {academyPlayers.map((p) => (
          <div key={p.id}>
            <p>{p.name}</p>
            <p>{p.position}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default AdminPage;
