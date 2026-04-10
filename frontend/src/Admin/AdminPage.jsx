import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminPage.css";

const API = "https://kisima-football-club-website-27xr.onrender.com";

function AdminPage() {
  const [news, setNews] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [players, setPlayers] = useState([]);
  const [academyPlayers, setAcademyPlayers] = useState([]);
  const [academyNews, setAcademyNews] = useState([]);
  const [results, setResults] = useState([]);
  const [weekendImages, setWeekendImages] = useState([]);

  const navigate = useNavigate();

  // 🔐 TOKEN
  const getToken = () => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) return null;
    return JSON.parse(token).access_token;
  };

  const authHeader = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    fetchNews();
    fetchFixtures();
    fetchPlayers();
    fetchAcademyPlayers();
    fetchAcademyNews();
    fetchResults();
    fetchWeekend();
  };

  // ================= NEWS =================
  const fetchNews = async () => {
    try {
      const res = await axios.get(`${API}/news/news`, authHeader());
      setNews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("News error:", err);
    }
  };

  // ================= FIXTURES =================
  const fetchFixtures = async () => {
    try {
      const res = await axios.get(`${API}/fixture/fixtures`, authHeader());
      setFixtures(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fixtures error:", err);
    }
  };

  // ================= RESULTS =================
  const fetchResults = async () => {
    try {
      const res = await axios.get(`${API}/result/results`, authHeader());
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Results error:", err);
    }
  };

  // ================= PLAYERS =================
  const fetchPlayers = async () => {
    try {
      const res = await axios.get(`${API}/player/players`, authHeader());
      setPlayers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Players error:", err);
    }
  };

  // ================= ACADEMY PLAYERS =================
  const fetchAcademyPlayers = async () => {
    try {
      const res = await axios.get(
        `${API}/academy/player/academy/players`,
        authHeader(),
      );
      setAcademyPlayers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Academy players error:", err);
    }
  };

  // ================= ACADEMY NEWS =================
  const fetchAcademyNews = async () => {
    try {
      const res = await axios.get(
        `${API}/academy/news/academy/news`,
        authHeader(),
      );
      setAcademyNews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Academy news error:", err);
    }
  };

  // ================= WEEKEND PICTURES =================
  const fetchWeekend = async () => {
    try {
      const res = await axios.get(`${API}/weekend/weekends`, authHeader());
      setWeekendImages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Weekend error:", err);
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard (View Only)</h1>

      <button onClick={() => navigate("/admin")}>Logout</button>

      {/* NAVIGATION */}
      <div className="admin-nav">
        <Link to="/news">News</Link>
        <Link to="/admin-schedule">Schedule</Link>
        <Link to="/players">Players</Link>
        <Link to="/academy-players-admin">Academy Players</Link>
        <Link to="/academy-news-admin">Academy News</Link>
        <Link to="/results-admin">Results</Link>
        <Link to="/weekend-pics">Weekend Pictures</Link>
      </div>

      {/* NEWS */}
      <section>
        <h2>News</h2>
        {news.length === 0 ? (
          <p>No news available</p>
        ) : (
          news.map((n) => (
            <div key={n.id}>
              <h3>{n.title}</h3>
              <p>{n.description}</p>
            </div>
          ))
        )}
      </section>

      {/* FIXTURES */}
      <section>
        <h2>Fixtures</h2>
        {fixtures.length === 0 ? (
          <p>No fixtures available</p>
        ) : (
          fixtures.map((f) => (
            <div key={f.id}>
              <img
                src={`${API}/fixture/uploads/${f.homeTeamImage}`}
                alt="home"
                width="80"
              />
              <span> VS </span>
              <img
                src={`${API}/fixture/uploads/${f.awayTeamImage}`}
                alt="away"
                width="80"
              />
              <p>
                {f.homeTeam} vs {f.awayTeam}
              </p>
              <p>
                {f.venue} | {f.date}
              </p>
            </div>
          ))
        )}
      </section>

      {/* RESULTS */}
      <section>
        <h2>Results</h2>
        {results.length === 0 ? (
          <p>No results available</p>
        ) : (
          results.map((r) => (
            <div key={r.id}>
              <p>{r.result}</p>
              <p>
                {r.venue} | {r.date}
              </p>
            </div>
          ))
        )}
      </section>

      {/* PLAYERS */}
      <section>
        <h2>Players</h2>
        {players.length === 0 ? (
          <p>No players available</p>
        ) : (
          players.map((p) => (
            <div key={p.id}>
              <p>
                {p.name} - {p.position}
              </p>
            </div>
          ))
        )}
      </section>

      {/* ACADEMY PLAYERS */}
      <section>
        <h2>Academy Players</h2>
        {academyPlayers.length === 0 ? (
          <p>No academy players available</p>
        ) : (
          academyPlayers.map((p) => (
            <div key={p.id}>
              <p>
                {p.name} - {p.position}
              </p>
            </div>
          ))
        )}
      </section>

      {/* ACADEMY NEWS */}
      <section>
        <h2>Academy News</h2>
        {academyNews.length === 0 ? (
          <p>No academy news available</p>
        ) : (
          academyNews.map((n) => (
            <div key={n.id}>
              <p>{n.title}</p>
              <p>{n.description}</p>
            </div>
          ))
        )}
      </section>

      {/* WEEKEND PICTURES */}
      <section>
        <h2>Weekend Pictures</h2>
        {weekendImages.length === 0 ? (
          <p>No pictures available</p>
        ) : (
          weekendImages.map((w) => (
            <div key={w.id}>
              <img
                src={`${API}/weekend/${w.weekendImages}`}
                alt="weekend"
                width="120"
              />
              <p>{w.date}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default AdminPage;
