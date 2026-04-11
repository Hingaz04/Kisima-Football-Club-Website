import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Auth";
import axios from "axios";
import "./AdminPage.css";

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
    Authorization: `Bearer ${JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"))?.access_token}`,
  });

  const fetchNews = async () => {
    try {
      const res = await axios.get(
        "https://kisima-football-club-website-27xr.onrender.com/news",
        { headers: getAuthHeader() },
      );
      setNews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching news:", err);
    }
  };

  const fetchWeekendPictures = async () => {
    try {
      const res = await axios.get(
        "https://kisima-football-club-website-27xr.onrender.com/weekend",
        { headers: getAuthHeader() },
      );
      setWeekendImages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching weekend:", err);
    }
  };

  const fetchAcademyNews = async () => {
    try {
      const res = await axios.get(
        "https://kisima-football-club-website-27xr.onrender.com/academy/news",
        { headers: getAuthHeader() },
      );
      setAcademyNews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching academy news:", err);
    }
  };

  const fetchAdminSchedule = async () => {
    try {
      const res = await axios.get(
        "https://kisima-football-club-website-27xr.onrender.com/fixtures",
        { headers: getAuthHeader() },
      );
      setAdminSchedule(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching fixtures:", err);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await axios.get(
        "https://kisima-football-club-website-27xr.onrender.com/results",
        { headers: getAuthHeader() },
      );
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching results:", err);
    }
  };

  const fetchPlayers = async () => {
    try {
      const res = await axios.get(
        "https://kisima-football-club-website-27xr.onrender.com/players",
        { headers: getAuthHeader() },
      );
      setPlayers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching players:", err);
    }
  };

  const fetchAcademyPlayers = async () => {
    try {
      const res = await axios.get(
        "https://kisima-football-club-website-27xr.onrender.com/academy/players",
        { headers: getAuthHeader() },
      );
      setAcademyPlayers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching academy players:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <div className="admin-page">
      <h1 className="h1-admin">Admin Page</h1>
      <button onClick={handleLogout}>Logout</button>

      <div>
        <button>
          <Link to="/news">Manage News</Link>
        </button>
        <button>
          <Link to="/admin-schedule">Manage Schedule</Link>
        </button>
        <button>
          <Link to="/players">Manage Players</Link>
        </button>
        <button>
          <Link to="/academy-players-admin">Manage Academy Players</Link>
        </button>
        <button>
          <Link to="/academy-news-admin">Manage Academy News</Link>
        </button>
        <button>
          <Link to="/results-admin">Manage Results</Link>
        </button>
        <button>
          <Link to="/weekend-pics">Manage Weekend Pictures</Link>
        </button>
      </div>

      {/* NEWS */}
      <section className="news-section">
        <h2 className="section-title">Team News</h2>
        <ul className="news-list">
          {news.length ? (
            news.map((item) => (
              <li className="news-item" key={item.id}>
                <img
                  className="news-image"
                  src={`https://kisima-football-club-website-27xr.onrender.com/${
                    item.image?.startsWith("uploads/")
                      ? item.image
                      : `uploads/${item.image}`
                  }`}
                  alt={item.title}
                />
                <h3>{item.title}</h3>
                <p className="news-description">{item.description}</p>
              </li>
            ))
          ) : (
            <p>No news available.</p>
          )}
        </ul>
      </section>

      {/* WEEKEND */}
      <section className="pictures-section">
        <h2 className="section-title">Team Pictures</h2>
        <ul className="pictures-list">
          {weekendImages.length ? (
            weekendImages.map((item) => (
              <li className="picture-item" key={item.id}>
                <img
                  className="picture-image"
                  src={`https://kisima-football-club-website-27xr.onrender.com/${
                    item.weekendImages?.startsWith("uploads/")
                      ? item.weekendImages
                      : item.weekendImages
                  }`}
                  alt=""
                />
                <p className="picture-date">Date: {item.date}</p>
              </li>
            ))
          ) : (
            <p>No pictures available.</p>
          )}
        </ul>
      </section>

      {/* ACADEMY NEWS */}
      <section className="academy-news-section">
        <h2 className="section-title">Academy News</h2>
        <ul className="academy-news-list">
          {academyNews.length ? (
            academyNews.map((item) => (
              <li className="academy-news-item" key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>

                <img
                  className="academy-news-image"
                  src={`https://kisima-football-club-website-27xr.onrender.com/${
                    item.image?.startsWith("uploads/")
                      ? item.image
                      : `uploads/${item.image}`
                  }`}
                  alt=""
                />
              </li>
            ))
          ) : (
            <p>No academy news available.</p>
          )}
        </ul>
      </section>

      {/* FIXTURES */}
      <section className="fixtures-section">
        <h2 className="section-title">Fixtures</h2>
        <ul className="fixtures-list">
          {AdminSchedule.length ? (
            AdminSchedule.map((item) => (
              <li className="fixture-item" key={item.id}>
                <img
                  className="fixture-image"
                  src={`https://kisima-football-club-website-27xr.onrender.com/${
                    item.homeTeamImage?.startsWith("uploads/")
                      ? item.homeTeamImage
                      : `uploads/${item.homeTeamImage}`
                  }`}
                  alt=""
                />
                <h1 className="vs">VS</h1>
                <img
                  className="fixture-image"
                  src={`https://kisima-football-club-website-27xr.onrender.com/${
                    item.awayTeamImage?.startsWith("uploads/")
                      ? item.awayTeamImage
                      : `uploads/${item.awayTeamImage}`
                  }`}
                  alt=""
                />
                <p className="fixture-venue">{item.venue}</p>
                <p className="fixture-date">{item.date}</p>
              </li>
            ))
          ) : (
            <p>No fixtures available.</p>
          )}
        </ul>
      </section>

      {/* RESULTS */}
      <section className="results-section">
        <h2 className="section-title">Results</h2>
        <ul className="results-list">
          {results.length ? (
            results.map((item) => (
              <li className="result-item" key={item.id}>
                <img
                  className="result-image"
                  src={`https://kisima-football-club-website-27xr.onrender.com/${
                    item.homeTeamImage?.startsWith("uploads/")
                      ? item.homeTeamImage
                      : `uploads/${item.homeTeamImage}`
                  }`}
                  alt=""
                />
                <h1 className="vs">VS</h1>
                <img
                  className="result-image"
                  src={`https://kisima-football-club-website-27xr.onrender.com/${
                    item.awayTeamImage?.startsWith("uploads/")
                      ? item.awayTeamImage
                      : `uploads/${item.awayTeamImage}`
                  }`}
                  alt=""
                />
                <p className="result-score">{item.result}</p>
                <p className="result-venue">{item.venue}</p>
                <p className="result-date">{item.date}</p>
              </li>
            ))
          ) : (
            <p>No results available.</p>
          )}
        </ul>
      </section>

      {/* PLAYERS */}
      <section className="players-section">
        <h2 className="section-title">Team Players</h2>
        <ul className="players-list">
          {players.length ? (
            players.map((p) => (
              <li className="player-item" key={p.id}>
                <p>
                  <span className="highlight-text">Name:</span> {p.name}
                </p>
                <p>
                  <span className="highlight-text">Position:</span> {p.position}
                </p>
              </li>
            ))
          ) : (
            <p>No players available.</p>
          )}
        </ul>
      </section>

      {/* ACADEMY PLAYERS */}
      <section className="academy-players-section">
        <h2 className="section-title">Academy Players</h2>
        <ul className="academy-players-list">
          {academyPlayers.length ? (
            academyPlayers.map((p) => (
              <li className="academy-player-item" key={p.id}>
                <p>
                  <span className="highlight-text">Name:</span> {p.name}
                </p>
                <p>
                  <span className="highlight-text">Position:</span> {p.position}
                </p>
              </li>
            ))
          ) : (
            <p>No academy players available.</p>
          )}
        </ul>
      </section>
    </div>
  );
}

export default AdminPage;
