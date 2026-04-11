import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

function Home() {
  const [news, setNews] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const BASE_URL = "https://kisima-football-club-website-27xr.onrender.com";

  // ================= SAFE IMAGE HELPER =================
  const getImageUrl = (path) => {
    if (!path) return "";

    // Cloudinary or external URL
    if (path.startsWith("http")) return path;

    // remove leading slash if exists
    return `${BASE_URL}/${path.startsWith("/") ? path.slice(1) : path}`;
  };

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
        {/* ================= NEWS ================= */}
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

        {/* ================= MATCH MOMENTS ================= */}

        <div className="home-photos-section">
          <h2 className="section-title">Match Moments</h2>

          <div className="vertical-carousel">
            {images.length > 0 ? (
              images.map((item) => (
                <div className="vertical-item" key={item.id}>
                  <img src={getImageUrl(item.weekendImages)} alt="moment" />
                </div>
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
