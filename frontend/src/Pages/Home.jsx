import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Home.css";

function Home() {
  const [news, setNews] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/news/news")
      .then((response) => {
        console.log("Fetched news:", response.data);
        const sortedNews = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setNews(sortedNews);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setError("Failed to fetch news.");
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/weekend/weekends")
      .then((response) => {
        console.log("Fetched news:", response.data);
        setImages(response.data);
      })
      .catch((err) => {
        console.error("Error fetching images:", err);
        setError("Failed to fetch images.");
      });
  }, []);

  return (
    <div className="home-container">
      <div className="home-news-section">
        <h1 className="home-heading">Team News</h1>
        {news.length === 0 && <p>No news available.</p>}
        <ul className="home-news-list">
          {news.map((item) => (
            <li key={item.id} className="home-news-item">
              <h3 className="home-news-title">{item.title}</h3>
              {item.image && (
                <img
                  className="home-news-image"
                  src={`http://127.0.0.1:5000/news/${item.image}`}
                  alt={item.title}
                  style={{ width: "200px", height: "auto" }}
                />
              )}
              <p className="home-news-description">{item.description}</p>
              <p className="home-news-date">{item.date}</p>
            </li>
          ))}
        </ul>
        {error && <p className="home-error-message">{error}</p>}
      </div>
      <div className="home-photos-section">
        <h2 className="home-heading">Team Moments</h2>
        <ul className="home-photo-list">
          {images.length > 0 ? (
            images.map((item) => (
              <li className="home-photo-item" key={item.id}>
                <img
                  className="home-photo-image"
                  src={`http://localhost:5000/weekend/${item.weekendImages}`}
                  alt={item.title}
                />
              </li>
            ))
          ) : (
            <p>No pictures available.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Home;
