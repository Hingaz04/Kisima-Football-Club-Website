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

  const fetchNews = async () => {
    try {
      const response = await axios.get(
        "https://kisima-football-club-website-27xr.onrender.com/news",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("REACT_TOKEN_AUTH_KEY")}`,
          },
        },
      );
      setNews(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fetchWeekendPictures = async () => {
    try {
      const response = await axios.get(
        "https://kisima-football-club-website-27xr.onrender.com/weekend",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("REACT_TOKEN_AUTH_KEY")}`,
          },
        },
      );
      setWeekendImages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching weekend pictures:", error);
    }
  };

  const fetchAcademyNews = async () => {
    try {
      const response = await axios.get(
        "https://kisima-football-club-website-27xr.onrender.com/academy/news",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("REACT_TOKEN_AUTH_KEY")}`,
          },
        },
      );
      setAcademyNews(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching academy news:", error);
    }
  };

  const fetchAdminSchedule = async () => {
    try {
      const response = await axios.get(
        "https://kisima-football-club-website-27xr.onrender.com/fixture/fixtures",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("REACT_TOKEN_AUTH_KEY")}`,
          },
        },
      );
      setAdminSchedule(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get(
        "https://kisima-football-club-website-27xr.onrender.com/result/results",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("REACT_TOKEN_AUTH_KEY")}`,
          },
        },
      );
      setResults(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(
        "https://kisima-football-club-website-27xr.onrender.com/player/players",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("REACT_TOKEN_AUTH_KEY")}`,
          },
        },
      );
      setPlayers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const fetchAcademyPlayers = async () => {
    try {
      const response = await axios.get(
        "https://kisima-football-club-website-27xr.onrender.com/academy/players",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("REACT_TOKEN_AUTH_KEY")}`,
          },
        },
      );
      setAcademyPlayers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching academy players:", error);
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
          {news.length > 0 ? (
            news.map((item) => (
              <li className="news-item" key={item.id}>
                <img
                  className="news-image"
                  src={`https://kisima-football-club-website-27xr.onrender.com/news/${item.image}`}
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

      {/* WEEKEND IMAGES */}
      <section className="pictures-section">
        <h2 className="section-title">Team Pictures</h2>
        <ul className="pictures-list">
          {weekendImages.length > 0 ? (
            weekendImages.map((item) => (
              <li className="picture-item" key={item.id}>
                <img
                  className="picture-image"
                  src={`https://kisima-football-club-website-27xr.onrender.com/weekend/${item.weekendImages}`}
                  alt={item.title}
                />
                <p>Date: {item.date}</p>
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
          {academyNews.length > 0 ? (
            academyNews.map((item) => (
              <li key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <img
                  className="academy-news-image"
                  src={`https://kisima-football-club-website-27xr.onrender.com/academy/news/${item.image}`}
                  alt={item.title}
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
          {AdminSchedule.length > 0 ? (
            AdminSchedule.map((item) => (
              <li key={item.id}>
                <img
                  src={`https://kisima-football-club-website-27xr.onrender.com/fixture/${item.homeTeamImage}`}
                  alt="home"
                />
                <h1>VS</h1>
                <img
                  src={`https://kisima-football-club-website-27xr.onrender.com/fixture/${item.awayTeamImage}`}
                  alt="away"
                />
                <p>{item.venue}</p>
                <p>{item.date}</p>
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
          {results.length > 0 ? (
            results.map((item) => (
              <li key={item.id}>
                <img
                  src={`https://kisima-football-club-website-27xr.onrender.com/result/${item.homeTeamImage}`}
                  alt="home"
                />
                <h1>VS</h1>
                <img
                  src={`https://kisima-football-club-website-27xr.onrender.com/result/${item.awayTeamImage}`}
                  alt="away"
                />
                <p>{item.result}</p>
                <p>{item.venue}</p>
                <p>{item.date}</p>
              </li>
            ))
          ) : (
            <p>No results available.</p>
          )}
        </ul>
      </section>

      {/* PLAYERS */}
      <section className="players-section">
        <h2>Team Players</h2>
        <ul>
          {players.length > 0 ? (
            players.map((p) => (
              <li key={p.id}>
                <p>{p.name}</p>
                <p>{p.position}</p>
              </li>
            ))
          ) : (
            <p>No players available.</p>
          )}
        </ul>
      </section>

      {/* ACADEMY PLAYERS */}
      <section className="academy-players-section">
        <h2>Academy Players</h2>
        <ul>
          {academyPlayers.length > 0 ? (
            academyPlayers.map((p) => (
              <li key={p.id}>
                <p>{p.name}</p>
                <p>{p.position}</p>
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
