import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

function Home() {
  const [news, setNews] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/news")
      .then((response) => {
        const sortedNews = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );
        setNews(sortedNews);
      })
      .catch(() => setError("Failed to fetch news."));
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/weekend/weekends")
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
                  <img
                    src={`https://kisima-football-club-website-27xr.onrender.com/news/${item.image}`}
                    alt={item.title}
                  />
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
                  src={`https://kisima-football-club-website-27xr.onrender.com/weekend/${item.weekendImages}`}
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
