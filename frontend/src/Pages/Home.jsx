import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

function Home() {
  const [news, setNews] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const BASE_URL = "https://kisima-football-club-website-27xr.onrender.com";

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/${path.startsWith("/") ? path.slice(1) : path}`;
  };

  // ================= NEWS - Sort by ID (newest first) =================
  useEffect(() => {
    axios
      .get(`${BASE_URL}/news/`)
      .then((response) => {
        const sortedNews = [...response.data].sort((a, b) => b.id - a.id);
        setNews(sortedNews);
      })
      .catch(() => setError("Failed to fetch news."));
  }, []);

  // ================= WEEKEND IMAGES - Sort by ID (newest first) =================
  useEffect(() => {
    axios
      .get(`${BASE_URL}/weekend/`)
      .then((response) => {
        const sortedImages = [...response.data].sort((a, b) => b.id - a.id);
        setImages(sortedImages);
      })
      .catch(() => setError("Failed to fetch images."));
  }, []);

  return (
    <div className="home">
      <div className="home-container">
        <div className="home-news-section">
          <h2 className="section-title">Latest News</h2>
          {news.length === 0 && <p>No news available.</p>}
          <div className="news-grid">
            {news.map((item) => (
              <div key={item.id} className="news-card">
                <h3>{item.title}</h3>
                {item.image && (
                  <img src={getImageUrl(item.image)} alt={item.title} />
                )}
                <div className="news-content">
                  <p>{item.description}</p>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="home-photos-section">
          <h2 className="section-title">Match Moments</h2>
          <div className="photo-grid">
            {images.length > 0 ? (
              images.map((item) => (
                <img
                  key={item.id}
                  src={getImageUrl(item.weekendImages)}
                  alt="moment"
                />
              ))
            ) : (
              <p>No pictures available.</p>
            )}
          </div>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Home;
