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

  // ✅ FIX: normalize image URL properly
  const fixImageUrl = (img) => {
    if (!img) return "";

    if (img.startsWith("http")) return img;

    // already has leading slash
    if (img.startsWith("/")) return `${BASE_URL}${img}`;

    return `${BASE_URL}/${img}`;
  };

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

            {/* ✅ FIXED IMAGE HANDLING */}
            {item.image && (
              <img
                src={fixImageUrl(item.image)}
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
