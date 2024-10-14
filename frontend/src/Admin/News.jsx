import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./News.css";

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

  useEffect(() => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) {
      console.error("Token not found");
      return;
    }

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    axios
      .get("http://127.0.0.1:5000/news/news", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log("Fetched news:", response.data);
        setNews(response.data);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setError("Failed to fetch news.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prevForm) => ({ ...prevForm, image: files[0] }));
    } else {
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
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
      setError(validationErrors);
      return;
    }

    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) {
      console.error("Token not found");
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
      .post("http://127.0.0.1:5000/news/news", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log("News added:", response.data);
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
        console.error("Error:", err);
        setError("Failed to add news.");
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) {
      console.error("Token not found");
      return;
    }

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    axios
      .delete(`http://127.0.0.1:5000/news/news/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        setNews(news.filter((item) => item.id !== id));
        alert("News deleted successfully!");
      })
      .catch((err) => {
        console.error("Error deleting news:", err);
        setError("Failed to delete news.");
      });
  };

  return (
    <div className="news-page news">
      <h1>News Page</h1>
      <Link to="/admin_dashboard">Back to Admin Dashboard</Link>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter news title"
            required
          />
        </div>
        <div className="form-group">
          <label>Image:</label>
          <input type="file" name="image" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter news description"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          Add News
        </button>
        {loading && <p>Loading...</p>}
        {Object.values(error).map((errMsg, index) => (
          <p key={index} className="error-message">
            {errMsg}
          </p>
        ))}
        {success && <p className="success-message">{success}</p>}
      </form>

      <h2>News List</h2>
      {news.length === 0 && <p>No news available.</p>}
      <ul>
        {news.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            {item.image && (
              <img
                src={`http://127.0.0.1:5000/news/${item.image}`}
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
