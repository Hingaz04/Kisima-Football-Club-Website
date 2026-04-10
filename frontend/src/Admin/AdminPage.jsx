import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, logout } from "../Auth";
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

  const BASE_URL = "https://kisima-football-club-website-27xr.onrender.com";

  useEffect(() => {
    fetchNews();
    fetchAdminSchedule();
    fetchPlayers();
    fetchAcademyPlayers();
    fetchAcademyNews();
    fectchWeekendPictures();
    fetchResults();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/news/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("REACT_TOKEN_AUTH_KEY")}`,
        },
      });
      if (Array.isArray(response.data)) {
        setNews(response.data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fectchWeekendPictures = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/weekend/weekends`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("REACT_TOKEN_AUTH_KEY")}`,
        },
      });
      if (Array.isArray(response.data)) {
        setWeekendImages(response.data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fetchAcademyNews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/academy/news/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("REACT_TOKEN_AUTH_KEY")}`,
        },
      });
      if (Array.isArray(response.data)) {
        setAcademyNews(response.data);
      }
    } catch (error) {
      console.error("Error fetching academy news:", error);
    }
  };

  const fetchAdminSchedule = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/fixture/fixtures`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("REACT_TOKEN_AUTH_KEY")}`,
        },
      });
      if (Array.isArray(response.data)) {
        setAdminSchedule(response.data);
      }
    } catch (error) {
      console.error("Error fetching fixtures:", error);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/result/results`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("REACT_TOKEN_AUTH_KEY")}`,
        },
      });
      if (Array.isArray(response.data)) {
        setResults(response.data);
      }
    } catch (error) {
      console.error("Error fetching fixtures:", error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/player/players`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("REACT_TOKEN_AUTH_KEY")}`,
        },
      });
      setPlayers(response.data);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const fetchAcademyPlayers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/academy/players/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("REACT_TOKEN_AUTH_KEY")}`,
        },
      });
      setAcademyPlayers(response.data);
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

      {/* NEWS IMAGE FIX */}
      <section className="news-section">
        <h2 className="section-title">Team News</h2>
        <ul className="news-list">
          {news.length > 0 ? (
            news.map((item) => (
              <li className="news-item" key={item.id}>
                <img
                  className="news-image"
                  src={`${BASE_URL}/news/uploads/${item.image}`}
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

      {/* WEEKEND IMAGE FIX */}
      <section className="pictures-section">
        <h2 className="section-title">Team Pictures</h2>
        <ul className="pictures-list">
          {weekendImages.length > 0 ? (
            weekendImages.map((item) => (
              <li className="picture-item" key={item.id}>
                <img
                  className="picture-image"
                  src={`${BASE_URL}/weekend/${item.weekendImages}`}
                  alt={item.title}
                />
                <p className="picture-date">Date: {item.date}</p>
              </li>
            ))
          ) : (
            <p>No pictures available.</p>
          )}
        </ul>
      </section>

      {/* ACADEMY NEWS IMAGE FIX */}
      <section className="academy-news-section">
        <h2 className="section-title">Academy News</h2>
        <ul className="academy-news-list">
          {academyNews.length > 0 ? (
            academyNews.map((item) => (
              <li className="academy-news-item" key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <img
                  className="academy-news-image"
                  src={`${BASE_URL}/academy/news/uploads/${item.image}`}
                  alt={item.title}
                />
              </li>
            ))
          ) : (
            <p>No academy news available.</p>
          )}
        </ul>
      </section>

      {/* FIX FIXTURES IMAGES */}
      <section className="fixtures-section">
        <h2 className="section-title">Fixtures</h2>
        <ul className="fixtures-list">
          {AdminSchedule.length > 0 ? (
            AdminSchedule.map((item) => (
              <li className="fixture-item" key={item.id}>
                {item.homeTeamImage && (
                  <img
                    className="fixture-image"
                    src={`${BASE_URL}/fixture/${item.homeTeamImage}`}
                    alt="Home Team"
                  />
                )}
                <h1 className="vs">VS</h1>
                {item.awayTeamImage && (
                  <img
                    className="fixture-image"
                    src={`${BASE_URL}/fixture/${item.awayTeamImage}`}
                    alt="Away Team"
                  />
                )}
                <p className="fixture-venue">Venue: {item.venue}</p>
                <p className="fixture-date">Date: {item.date}</p>
              </li>
            ))
          ) : (
            <p>No fixtures available.</p>
          )}
        </ul>
      </section>

      {/* FIX RESULTS IMAGES */}
      <section className="results-section">
        <h2 className="section-title">Results</h2>
        <ul className="results-list">
          {results.length > 0 ? (
            results.map((item) => (
              <li className="result-item" key={item.id}>
                {item.homeTeamImage && (
                  <img
                    className="result-image"
                    src={`${BASE_URL}/result/${item.homeTeamImage}`}
                    alt="Home Team"
                  />
                )}
                <h1 className="vs">VS</h1>
                {item.awayTeamImage && (
                  <img
                    className="result-image"
                    src={`${BASE_URL}/result/${item.awayTeamImage}`}
                    alt="Away Team"
                  />
                )}
                <p className="result-score">Results: {item.result}</p>
                <p className="result-venue">Venue: {item.venue}</p>
                <p className="result-date">Date: {item.date}</p>
              </li>
            ))
          ) : (
            <p>No results available.</p>
          )}
        </ul>
      </section>

      {/* PLAYERS + ACADEMY PLAYERS unchanged */}
    </div>
  );
}

export default AdminPage;
