import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AcademyNewsPage.css";

function AcademyNewsPage() {
  const [academyNews, setAcademyNews] = useState([]);
  const [error, setError] = useState("");

  const BASE_URL = "https://kisima-football-club-website-27xr.onrender.com";

  useEffect(() => {
    axios
      .get(`${BASE_URL}/academy/news/`)
      .then((response) => {
        const sortedNews = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );
        setAcademyNews(sortedNews);
      })
      .catch(() => {
        setError("Failed to fetch news.");
      });
  }, []);

  return (
    <div className="academy">
      <h1 className="academy-heading">Academy News</h1>

      {academyNews.length === 0 && (
        <p className="academy-no-news">No news available.</p>
      )}

      <ul className="academy-list">
        {academyNews.map((item) => (
          <li key={item.id} className="academy-item">
            <h3 className="academy-item-title">{item.title}</h3>

            {item.image && (
              <img
                src={`${BASE_URL}/academy/news/uploads/${item.image}`}
                alt={item.title}
                className="academy-item-image"
              />
            )}

            <p className="academy-item-description">{item.description}</p>
          </li>
        ))}
      </ul>

      {error && <p className="academy-error">{error}</p>}
    </div>
  );
}

export default AcademyNewsPage;
