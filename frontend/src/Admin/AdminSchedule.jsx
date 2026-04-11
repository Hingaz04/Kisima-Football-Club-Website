import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AdminSchedule.css";

const BASE_URL = "https://kisima-football-club-website-27xr.onrender.com";

// 🔥 FIXED IMAGE HANDLER (CRITICAL)
const getImageUrl = (path) => {
  if (!path) return "";

  // Cloudinary or external image
  if (path.startsWith("http")) return path;

  // Remove leading slash to avoid //
  return `${BASE_URL}/${path.replace(/^\/+/, "")}`;
};

function AdminSchedulePage() {
  const [fixtures, setFixtures] = useState([]);
  const [formData, setFormData] = useState({
    homeTeamImage: null,
    awayTeamImage: null,
    homeTeam: "",
    awayTeam: "",
    venue: "",
    date: "",
  });

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));

    if (!token) return;

    axios
      .get(`${BASE_URL}/fixtures`, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      })
      .then((res) => setFixtures(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    axios
      .post(`${BASE_URL}/fixtures`, data, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      })
      .then((res) => setFixtures((prev) => [res.data, ...prev]))
      .catch(console.error);
  };

  const handleDelete = (id) => {
    const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));

    axios
      .delete(`${BASE_URL}/fixtures/${id}`, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      })
      .then(() => setFixtures((prev) => prev.filter((item) => item.id !== id)))
      .catch(console.error);
  };

  return (
    <div className="admin-schedule-page">
      <h1>Schedule Page</h1>

      <Link to="/admin_dashboard">Back to Admin Dashboard</Link>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Home Team Image</label>
          <input type="file" name="homeTeamImage" onChange={handleChange} />
        </div>

        <div>
          <label>Home Team</label>
          <input
            type="text"
            name="homeTeam"
            value={formData.homeTeam}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Away Team Image</label>
          <input type="file" name="awayTeamImage" onChange={handleChange} />
        </div>

        <div>
          <label>Away Team</label>
          <input
            type="text"
            name="awayTeam"
            value={formData.awayTeam}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Venue</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Add Fixture</button>
      </form>

      {/* LIST */}
      <h2>Fixtures List</h2>

      {fixtures.length === 0 ? (
        <p>No fixtures available.</p>
      ) : (
        fixtures.map((f) => (
          <div key={f.id} className="fixture-card">
            <p>
              <strong>Home:</strong> {f.homeTeam}
            </p>

            <img
              src={getImageUrl(f.homeTeamImage)}
              alt="home team"
              width="120"
            />

            <h3>VS</h3>

            <p>
              <strong>Away:</strong> {f.awayTeam}
            </p>

            <img
              src={getImageUrl(f.awayTeamImage)}
              alt="away team"
              width="120"
            />

            <p>
              <strong>Venue:</strong> {f.venue}
            </p>

            <p>
              <strong>Date:</strong> {f.date}
            </p>

            <button onClick={() => handleDelete(f.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminSchedulePage;
