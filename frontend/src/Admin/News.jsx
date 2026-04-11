import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./News.css";

const BASE_URL = "https://kisima-football-club-website-27xr.onrender.com";

// 🔥 SAFE IMAGE HANDLER (IMPORTANT FIX)
const getImageUrl = (path) => {
  if (!path) return "";

  // Cloudinary or full URL
  if (path.startsWith("http")) return path;

  // remove leading slashes
  return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
};

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

    axios
      .get(`${BASE_URL}/news/`, {
        headers: {
          Authorization: `Bearer ${parsedToken.access_token}`,
        },
      })
      .then((res) => setNews(res.data))
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

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
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
      setError("Please fill all fields correctly");
      return;
    }

    const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));

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
          Authorization: `Bearer ${token.access_token}`,
        },
      })
      .then((res) => {
        setNews((prev) => [res.data, ...prev]);
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
    const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));

    axios
      .delete(`${BASE_URL}/news/${id}`, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      })
      .then(() => {
        setNews((prev) => prev.filter((item) => item.id !== id));
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
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />

        <input type="file" name="image" onChange={handleChange} />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Add News"}
        </button>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>

      {/* NEWS LIST */}
      <h2>News List</h2>

      {news.length === 0 ? (
        <p>No news available.</p>
      ) : (
        news.map((item) => (
          <div key={item.id}>
            <h3>{item.title}</h3>

            {/* 🔥 FIXED IMAGE */}
            <img src={getImageUrl(item.image)} alt={item.title} width="200" />

            <p>{item.description}</p>
            <p>{item.date}</p>

            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default NewsPage;
