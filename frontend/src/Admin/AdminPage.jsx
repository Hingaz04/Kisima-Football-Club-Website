import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Auth";
import axios from "axios";
import "./AdminPage.css";

const BASE_URL = "https://kisima-football-club-website-27xr.onrender.com";

const getImageUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}/${img}`;
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
    Authorization: `Bearer ${JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"))?.access_token}`,
  });

  const fetchNews = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/news`, {
        headers: getAuthHeader(),
      });
      setNews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {}
  };

  const fetchWeekendPictures = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/weekend`, {
        headers: getAuthHeader(),
      });
      setWeekendImages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {}
  };

  const fetchAcademyNews = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/academy/news`, {
        headers: getAuthHeader(),
      });
      setAcademyNews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {}
  };

  const fetchAdminSchedule = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/fixtures`, {
        headers: getAuthHeader(),
      });
      setAdminSchedule(Array.isArray(res.data) ? res.data : []);
    } catch (err) {}
  };

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/results`, {
        headers: getAuthHeader(),
      });
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {}
  };

  const fetchPlayers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/players`, {
        headers: getAuthHeader(),
      });
      setPlayers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {}
  };

  const fetchAcademyPlayers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/academy/players`, {
        headers: getAuthHeader(),
      });
      setAcademyPlayers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {}
  };

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <div className="admin-page">
      <h1 className="h1-admin">Admin Page</h1>
      <button onClick={handleLogout}>Logout</button>

      {/* unchanged buttons */}

      {/* NEWS */}
      <section className="news-section">
        <h2 className="section-title">Team News</h2>
        <ul className="news-list">
          {news.length ? (
            news.map((item) => (
              <li className="news-item" key={item.id}>
                <img
                  className="news-image"
                  src={getImageUrl(item.image)}
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
                  src={getImageUrl(item.weekendImages)}
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
                  src={getImageUrl(item.image)}
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
                  src={getImageUrl(item.homeTeamImage)}
                />
                <h1 className="vs">VS</h1>
                <img
                  className="fixture-image"
                  src={getImageUrl(item.awayTeamImage)}
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
                  src={getImageUrl(item.homeTeamImage)}
                />
                <h1 className="vs">VS</h1>
                <img
                  className="result-image"
                  src={getImageUrl(item.awayTeamImage)}
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

      {/* PLAYERS (UNCHANGED) */}
      {/* ACADEMY PLAYERS (UNCHANGED) */}
    </div>
  );
}

export default AdminPage;
