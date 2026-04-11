import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AdminSchedule.css";

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

    const accessToken = token.access_token;

    axios
      .get("https://kisima-football-club-website-27xr.onrender.com/fixtures", {
        headers: { Authorization: `Bearer ${accessToken}` },
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
    const accessToken = token.access_token;

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));

    axios
      .post(
        "https://kisima-football-club-website-27xr.onrender.com/fixtures",
        data,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
      .then((res) => setFixtures((prev) => [res.data, ...prev]))
      .catch(console.error);
  };

  const handleDelete = (id) => {
    const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));
    const accessToken = token.access_token;

    axios
      .delete(
        `https://kisima-football-club-website-27xr.onrender.com/fixtures/${id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      )
      .then(() => setFixtures((prev) => prev.filter((f) => f.id !== id)))
      .catch(console.error);
  };

  return (
    <div className="admin-schedule-page">
      <h1>Schedule Page</h1>

      <Link to="/admin_dashboard">Back to Admin Dashboard</Link>

      {/* FORM */}
      <form className="admin-schedule-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Home Team Image:</label>
          <input type="file" name="homeTeamImage" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Home Team:</label>
          <input
            type="text"
            name="homeTeam"
            value={formData.homeTeam}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Away Team Image:</label>
          <input type="file" name="awayTeamImage" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Away Team:</label>
          <input
            type="text"
            name="awayTeam"
            value={formData.awayTeam}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Venue:</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Date:</label>
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
      <h2>Fixture List</h2>

      <div className="admin-fixtures-grid">
        {fixtures.length > 0 ? (
          fixtures.map((f) => (
            <div className="admin-card" key={f.id}>
              <p>
                <strong>Home Team:</strong> {f.homeTeam}
              </p>
              {f.homeTeamImage && (
                <img
                  src={`https://kisima-football-club-website-27xr.onrender.com/fixture/${f.homeTeamImage}`}
                  alt="Home Team"
                />
              )}

              <h3>VS</h3>

              <p>
                <strong>Away Team:</strong> {f.awayTeam}
              </p> 

              {f.awayTeamImage && (
                <img
                  src={`https://kisima-football-club-website-27xr.onrender.com/fixture/${f.awayTeamImage}`}
                  alt="Away Team"
                />
              )}

              <p>
                <strong>Venue:</strong> {f.venue}
              </p>
              <p>
                <strong>Date:</strong> {f.date}
              </p>

              <button onClick={() => handleDelete(f.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No fixtures available.</p>
        )}
      </div>
    </div>
  );
}

export default AdminSchedulePage;
