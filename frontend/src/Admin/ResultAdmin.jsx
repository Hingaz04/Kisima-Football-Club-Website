import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ResultAdmin.css";

const BASE_URL = "https://kisima-football-club-website-27xr.onrender.com";

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}/${path.startsWith("/") ? path.slice(1) : path}`;
};

function Home() {
  const [news, setNews] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/news/`)
      .then((res) => setNews(res.data))
      .catch(() => setError("Failed to fetch news."));
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/weekend/`)
      .then((res) => setImages(res.data))
      .catch(() => setError("Failed to fetch images."));
  }, []);

  return (
    <div className="home">
      <h2>Latest News</h2>

      {news.map((item) => (
        <div key={item.id}>
          {item.image && <img src={getImageUrl(item.image)} alt={item.title} />}
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}

      <h2>Match Moments</h2>

      {images.map((item) => (
        <img key={item.id} src={item.weekendImages} alt="moment" />
      ))}

      {error && <p>{error}</p>}
    </div>
  );
}

export default Home;
