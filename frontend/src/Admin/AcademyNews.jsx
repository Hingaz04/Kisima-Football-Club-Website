import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AcademyNews.css"

function AcademyNews() {
  const [academyNews, setAcademyNews] = useState([]);
  const [form, setForm] = useState({
    title: "",
    image: null,
    description: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const BASE_URL = "https://kisima-football-club-website-27xr.onrender.com";

  // ✅ SAFE IMAGE HANDLER (FIX)
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return `${BASE_URL}${img}`;
    return `${BASE_URL}/${img}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) return;

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    axios
      .get(
        "https://kisima-football-club-website-27xr.onrender.com/academy/news",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
      .then((response) => {
        setAcademyNews(Array.isArray(response.data) ? response.data : []);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title) newErrors.title = "Title is required";
    if (!form.image) newErrors.image = "Image is required";
    if (!form.description) newErrors.description = "Description is required";
    if (!form.date) newErrors.date = "Date is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError("Please fill all fields correctly");
      return;
    }

    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) return;

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("image", form.image);
    formData.append("description", form.description);
    formData.append("date", form.date);

    setLoading(true);

    axios
      .post(
        "https://kisima-football-club-website-27xr.onrender.com/academy/news",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      .then((response) => {
        setAcademyNews((prev) => [response.data, ...prev]);
        setSuccess("News added successfully!");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError("Failed to add news.");
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) return;

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    axios
      .delete(
        `https://kisima-football-club-website-27xr.onrender.com/academy/news/${id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
      .then(() => {
        setAcademyNews((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => {
        console.error("Error deleting news:", err);
        setError("Failed to delete news.");
      });
  };

  return (
    <div className="academy-news-page">
      <h1>Academy News Page</h1>
      <Link to="/admin_dashboard">Back to Admin Dashboard</Link>

      <form onSubmit={handleSubmit} className="academy-news-form">
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Image:</label>
          <input type="file" name="image" onChange={handleChange} />
        </div>

        <button type="submit" disabled={loading}>
          Add News
        </button>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
      </form>

      <h2>Academy News List</h2>

      {academyNews.length === 0 && <p>No news available.</p>}

      <ul>
        {academyNews.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>

            {/* ✅ FIXED IMAGE */}
            {item.image && (
              <img src={getImageUrl(item.image)} alt={item.title} />
            )}

            <p>{item.description}</p>

            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AcademyNews;
