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

  const BASE_URL = "https://kisima-football-club-website-27xr.onrender.com";

  // ================= SAFE IMAGE HELPER =================
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/${path.startsWith("/") ? path.slice(1) : path}`;
  };

  // ================= GET IMAGES =================
  useEffect(() => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) return;

    const accessToken = JSON.parse(token).access_token;

    axios
      .get(`${BASE_URL}/weekend/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => setWeekendImages(res.data))
      .catch(() => setError("Failed to fetch images"));
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, files, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    const err = {};
    if (!form.image) err.image = "Image required";
    if (!form.date) err.date = "Date required";
    return err;
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateForm();
    if (Object.keys(validation).length > 0) {
      setError("Please fill all fields");
      return;
    }

    const token = JSON.parse(
      localStorage.getItem("REACT_TOKEN_AUTH_KEY"),
    ).access_token;

    const formData = new FormData();

    // ✅ FIXED: MUST MATCH BACKEND ("image")
    formData.append("image", form.image);
    formData.append("date", form.date);

    setLoading(true);

    axios
      .post(`${BASE_URL}/weekend/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setWeekendImages((prev) => [res.data, ...prev]);
        setSuccess("Uploaded successfully!");
        setForm({ image: null, date: "" });
      })
      .catch(() => setError("Upload failed"))
      .finally(() => setLoading(false));
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    const token = JSON.parse(
      localStorage.getItem("REACT_TOKEN_AUTH_KEY"),
    ).access_token;

    axios
      .delete(`${BASE_URL}/weekend/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setWeekendImages((prev) => prev.filter((item) => item.id !== id));
      })
      .catch(() => setError("Delete failed"));
  };

  return (
    <div className="weekend-page">
      <h1>Weekend Pictures</h1>
      <Link to="/admin_dashboard">Back to Admin Dashboard</Link>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input type="file" name="image" onChange={handleChange} />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Add Picture"}
        </button>

        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
      </form>

      {/* LIST */}
      <ul>
        {weekendImages.map((item) => (
          <li key={item.id}>
            <h3>{item.date}</h3>

            {item.weekendImages && (
              <img
                src={getImageUrl(item.weekendImages)}
                alt="weekend"
                width="200"
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
