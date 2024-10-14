import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


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

  useEffect(() => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) {
      console.error("Token not found");
      return;
    }

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    axios
      .get("http://127.0.0.1:5000/academy-news/academy-news", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log("Fetched news:", response.data);
        setAcademyNews(response.data);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
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
      .post("http://127.0.0.1:5000/academy-news/academy-news", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log("News added:", response.data);
        setAcademyNews([response.data, ...academyNews]);
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
    if (!token) {
      console.error("Token not found");
      return;
    }

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    axios
      .delete(`http://127.0.0.1:5000/academy-news/academy-news/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        setAcademyNews(academyNews.filter((item) => item.id !== id));
        alert("News deleted successfully!");
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
        <div className="academy-form-group">
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
        <div className="academy-form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter news description"
            required
          ></textarea>
        </div>
        <div className="academy-form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="academy-form-group">
          <label>Image:</label>
          <input type="file" name="image" onChange={handleChange} required />
        </div>
        <button type="submit" disabled={loading}>
          Add News
        </button>
        {loading && <p>Loading...</p>}
        {error && <p className="academy-error-message">{error}</p>}
        {success && <p className="academy-success-message">{success}</p>}
      </form>

      <h2>Academy News List</h2>
      {academyNews.length === 0 && <p>No news available.</p>}
      <ul className="academy-news-list">
        {academyNews.map((item) => (
          <li key={item.id} className="academy-news-item">
            <h3>{item.title}</h3>
            {item.image && (
              <img
                src={`http://localhost:5000/academy-news/${item.image}`}
                alt={item.title}
                className="academy-news-image"
              />
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
