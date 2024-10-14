import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AcademyNewsPage.css";

function AcademyNewsPage() {
  const [academyNews, setAcademyNews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/academy-news/academy-news")
      .then((response) => {
        // Sort news items to display the most recent first
        const sortedNews = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setAcademyNews(sortedNews);
      })
      .catch((err) => {
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
                src={`http://localhost:5000/academy-news/${item.image}`}
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
