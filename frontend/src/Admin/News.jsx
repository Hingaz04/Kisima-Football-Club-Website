import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./News.css";

const BASE_URL = "https://kisima-football-club-website-27xr.onrender.com";

function NewsPage() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState({
    title: "",
    image: null,
    description: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------
  // GET NEWS
  // --------------------------
  useEffect(() => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

    if (!token) {
      setError("Token not found");
      return;
    }

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    axios
      .get(`${BASE_URL}/news/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setNews(response.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch news");
      });
  }, []);

  // --------------------------
  // HANDLE FORM CHANGE
  // --------------------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --------------------------
  // VALIDATION
  // --------------------------
  const validateForm = () => {
    const errors = {};
    if (!form.title) errors.title = "Title is required";
    if (!form.image) errors.image = "Image is required";
    if (!form.description) errors.description = "Description is required";
    if (!form.date) errors.date = "Date is required";
    return errors;
  };

  // --------------------------
  // SUBMIT NEWS
  // --------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

    if (!token) {
      setError("Token not found");
      return;
    }

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("image", form.image);
    formData.append("description", form.description);
    formData.append("date", form.date);

    setLoading(true);

    axios
      .post(`${BASE_URL}/news/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setNews([response.data, ...news]);
        setSuccess("News added successfully!");
        setLoading(false);

        setForm({
          title: "",
          image: null,
          description: "",
          date: "",
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to add news");
        setLoading(false);
      });
  };

  // --------------------------
  // DELETE NEWS
  // --------------------------
  const handleDelete = (id) => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

    if (!token) {
      setError("Token not found");
      return;
    }

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    axios
      .delete(`${BASE_URL}/news/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        setNews(news.filter((item) => item.id !== id));
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to delete news");
      });
  };

  // --------------------------
  // UI
  // --------------------------
  return (
    <div className="news-page news">
      <h1>News Page</h1>

      <Link to="/admin_dashboard">Back to Admin Dashboard</Link>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Image</label>
          <input type="file" name="image" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Add News"}
        </button>

        {/* ERRORS */}
        {typeof error === "object"
          ? Object.values(error).map((e, i) => (
              <p key={i} className="error-message">
                {e}
              </p>
            ))
          : error && <p className="error-message">{error}</p>}

        {success && <p className="success-message">{success}</p>}
      </form>

      {/* NEWS LIST */}
      <h2>News List</h2>

      {news.length === 0 && <p>No news available.</p>}

      <ul>
        {news.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>

            {item.image && (
              <img
                src={`${BASE_URL}/${item.image}`}
                alt={item.title}
                style={{ width: "200px", height: "auto" }}
              />
            )}

            <p>{item.description}</p>
            <p>{item.date}</p>

            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewsPage;
