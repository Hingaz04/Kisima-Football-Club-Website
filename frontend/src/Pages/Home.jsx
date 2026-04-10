import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

function Home() {
  const [news, setNews] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const BASE_URL = "https://kisima-football-club-website-27xr.onrender.com";

  // ================= NEWS =================
  useEffect(() => {
    axios
      .get(`${BASE_URL}/news/`)
      .then((response) => {
        const sortedNews = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );
        setNews(sortedNews);
      })
      .catch(() => setError("Failed to fetch news."));
  }, []);

  // ================= WEEKEND IMAGES =================
  useEffect(() => {
    axios
      .get(`${BASE_URL}/weekend/`)
      .then((response) => setImages(response.data))
      .catch(() => setError("Failed to fetch images."));
  }, []);

  return (
    <div className="home">
      <div className="home-container">
        {/* NEWS */}
        <div className="home-news-section">
          <h2 className="section-title">Latest News</h2>

          {news.length === 0 && <p>No news available.</p>}

          <div className="news-grid">
            {news.map((item) => (
              <div key={item.id} className="news-card">
                {item.image && (
                  <img src={`${BASE_URL}${item.image}`} alt={item.title} />
                )}
                <div className="news-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="home-photos-section">
          <h2 className="section-title">Match Moments</h2>

          <div className="photo-grid">
            {images.length > 0 ? (
              images.map((item) => (
                <img
                  key={item.id}
                  src={`${BASE_URL}/weekend/uploads/${item.image}`}
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
