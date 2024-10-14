import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./News.css";

function WeekendPics() {
  const [weekendImages, setWeekendImages] = useState([]);
  const [form, setForm] = useState({
    image: null,
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
      .get("http://127.0.0.1:5000/weekend/weekends", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log("Fetched weekend images:", response.data);
        setWeekendImages(response.data);
      })
      .catch((err) => {
        console.error("Error fetching weekend images:", err);
        setError("Failed to fetch images.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "weekendImages") {
      setForm((prevForm) => ({ ...prevForm, image: files[0] }));
    } else {
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.image) newErrors.image = "Image is required";
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
    formData.append("weekendImages", form.image);
    formData.append("date", form.date);

    setLoading(true);
    axios
      .post("http://127.0.0.1:5000/weekend/weekends", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log("Image added:", response.data);
        setWeekendImages((prevImages) => [response.data, ...prevImages]);
        setSuccess("Image added successfully!");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError("Failed to add image.");
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
      .delete(`http://127.0.0.1:5000/weekend/weekend/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        setWeekendImages(weekendImages.filter((item) => item.id !== id));
        alert("Image deleted successfully!");
      })
      .catch((err) => {
        console.error("Error deleting image:", err);
        setError("Failed to delete image.");
      });
  };

  return (
    <div className="weekend-page">
      <h1>Weekend Pictures</h1>
      <Link to="/admin_dashboard">Back to Admin Dashboard</Link>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Image:</label>
          <input
            type="file"
            name="weekendImages"
            onChange={handleChange}
            required
          />
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
          Add Picture
        </button>
        {loading && <p>Loading...</p>}
        {Object.values(error).map((errMsg, index) => (
          <p key={index} className="error-message">
            {errMsg}
          </p>
        ))}
        {success && <p className="success-message">{success}</p>}
      </form>

      <h2>Weekend Images</h2>
      {weekendImages.length === 0 && <p>No images available.</p>}
      <ul>
        {weekendImages.map((item) => (
          <li key={item.id}>
            <h3>{item.date}</h3>
            {item.weekendImages && (
              <img
                src={`http://127.0.0.1:5000/weekend/${item.weekendImages}`}
                alt={item.date}
                style={{ width: "200px", height: "auto" }}
              />
            )}
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WeekendPics;
