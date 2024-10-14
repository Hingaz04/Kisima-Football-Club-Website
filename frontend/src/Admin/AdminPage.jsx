import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, logout } from "../Auth";
import axios from "axios";
import "./AdminPage.css";

function AdminPage() {
  const [news, setNews] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [players, setPlayers] = useState([]);
  const [academyPlayers, setAcademyPlayers] = useState([]);
  const [academyNews, setAcademyNews] = useState([]);
  const [results, setResults] = useState([]);
  const [weekendImages, setWeekendImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
    fetchFixtures();
    fetchPlayers();
    fetchAcademyPlayers();
    fetchAcademyNews();
    fectchWeekendPictures();
    fetchResults();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/news/news", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "REACT_TOKEN_AUTH_KEY"
          )}`,
        },
      });
      if (Array.isArray(response.data)) {
        setNews(response.data);
      } else {
        console.error("Unexpected response format for news:", response.data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fectchWeekendPictures = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/weekend/weekends",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "REACT_TOKEN_AUTH_KEY"
            )}`,
          },
        }
      );
      if (Array.isArray(response.data)) {
        setWeekendImages(response.data);
      } else {
        console.error("Unexpected response format for news:", response.data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fetchAcademyNews = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/academy-news/academy-news",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "REACT_TOKEN_AUTH_KEY"
            )}`,
          },
        }
      );
      if (Array.isArray(response.data)) {
        setAcademyNews(response.data);
      } else {
        console.error(
          "Unexpected response format for academy news:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching academy news:", error);
    }
  };

  const fetchFixtures = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/fixture/fixtures",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "REACT_TOKEN_AUTH_KEY"
            )}`,
          },
        }
      );
      if (Array.isArray(response.data)) {
        setFixtures(response.data);
      } else {
        console.error(
          "Unexpected response format for fixtures:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching fixtures:", error);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get("http://localhost:5000/result/results", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "REACT_TOKEN_AUTH_KEY"
          )}`,
        },
      });
      if (Array.isArray(response.data)) {
        setResults(response.data);
      } else {
        console.error("Unexpected response format for results:", response.data);
      }
    } catch (error) {
      console.error("Error fetching fixtures:", error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/player/players", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "REACT_TOKEN_AUTH_KEY"
          )}`,
        },
      });
      console.log("Fetched players:", response.data);
      setPlayers(response.data);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const fetchAcademyPlayers = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/academy-player/academy-players",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "REACT_TOKEN_AUTH_KEY"
            )}`,
          },
        }
      );
      console.log("Fetched academy players:", response.data);
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
          <Link to="/schedule">Manage Schedule</Link>
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

      <section className="news-section">
        <h2 className="section-title">Team News</h2>
        <ul className="news-list">
          <div className="news-container">
            {news.length > 0 ? (
              news.map((item) => (
                <li className="news-item" key={item.id}>
                  <h3>{item.title}</h3>
                  <p className="news-description">{item.description}</p>
                  <img
                    className="news-image"
                    src={`http://localhost:5000/news/${item.image}`}
                    alt={item.title}
                  />
                </li>
              ))
            ) : (
              <p>No news available.</p>
            )}
          </div>
        </ul>
      </section>

      <section className="pictures-section">
        <h2 className="section-title">Team Pictures</h2>
        <ul className="pictures-list">
          {weekendImages.length > 0 ? (
            weekendImages.map((item) => (
              <li className="picture-item" key={item.id}>
                <img
                  className="picture-image"
                  src={`http://localhost:5000/weekend/${item.weekendImages}`}
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
                  src={`http://localhost:5000/academy-news/${item.image}`}
                  alt={item.title}
                />
              </li>
            ))
          ) : (
            <p>No academy news available.</p>
          )}
        </ul>
      </section>

      <section className="fixtures-section">
        <h2 className="section-title">Fixtures</h2>
        <ul className="fixtures-list">
          {fixtures.length > 0 ? (
            fixtures.map((item) => (
              <li className="fixture-item" key={item.id}>
                {item.homeTeamImage && (
                  <img
                    className="fixture-image"
                    src={`http://127.0.0.1:5000/fixture/${item.homeTeamImage}`}
                    alt="Home Team"
                  />
                )}
                <h1 className="vs">VS</h1>
                {item.awayTeamImage && (
                  <img
                    className="fixture-image"
                    src={`http://127.0.0.1:5000/fixture/${item.awayTeamImage}`}
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

      <section className="results-section">
        <h2 className="section-title">Results</h2>
        <ul className="results-list">
          {results.length > 0 ? (
            results.map((item) => (
              <li className="result-item" key={item.id}>
                {item.homeTeamImage && (
                  <img
                    className="result-image"
                    src={`http://127.0.0.1:5000/result/${item.homeTeamImage}`}
                    alt="Home Team"
                  />
                )}
                <h1 className="vs">VS</h1>
                {item.awayTeamImage && (
                  <img
                    className="result-image"
                    src={`http://127.0.0.1:5000/result/${item.awayTeamImage}`}
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

      <section className="players-section">
        <h2 className="section-title">Team Players</h2>
        <ul className="players-list">
          {players.length > 0 ? (
            players.map((player) => (
              <li className="player-item" key={player.id}>
                <p>
                  <span className="highlight-text">Name:</span> {player.name}
                </p>
                <p>
                  <span className="highlight-text">Position:</span>{" "}
                  {player.position}
                </p>
              </li>
            ))
          ) : (
            <p>No players available.</p>
          )}
        </ul>
      </section>

      <section className="academy-players-section">
        <h2 className="section-title">Academy Team Players</h2>
        <ul className="academy-players-list">
          {academyPlayers.length > 0 ? (
            academyPlayers.map((academyPlayer) => (
              <li className="academy-player-item" key={academyPlayer.id}>
                <p>
                  <span className="highlight-text">Name:</span>{" "}
                  {academyPlayer.name}
                </p>
                <p>
                  <span className="highlight-text">Position:</span>{" "}
                  {academyPlayer.position}
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
