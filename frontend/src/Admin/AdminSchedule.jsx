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

  const BASE_URL = "https://kisima-football-club-website-27xr.onrender.com";

  // -------------------------
  // GET FIXTURES
  // -------------------------
  useEffect(() => {
    const token = JSON.parse(
      localStorage.getItem("REACT_TOKEN_AUTH_KEY"),
    ).access_token;

    axios
      .get(`${BASE_URL}/fixtures/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFixtures(res.data))
      .catch(console.error);
  }, []);

  // -------------------------
  // HANDLE INPUT
  // -------------------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // -------------------------
  // SUBMIT
  // -------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    const token = JSON.parse(
      localStorage.getItem("REACT_TOKEN_AUTH_KEY"),
    ).access_token;

    const data = new FormData();

    Object.entries(formData).forEach(([k, v]) => data.append(k, v));

    axios
      .post(`${BASE_URL}/fixtures/`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFixtures((prev) => [res.data, ...prev]))
      .catch(console.error);
  };

  // -------------------------
  // DELETE
  // -------------------------
  const handleDelete = (id) => {
    const token = JSON.parse(
      localStorage.getItem("REACT_TOKEN_AUTH_KEY"),
    ).access_token;

    axios
      .delete(`${BASE_URL}/fixtures/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setFixtures((prev) => prev.filter((f) => f.id !== id)))
      .catch(console.error);
  };

  return (
    <div className="admin-schedule-page">
      <h1>Schedule Page</h1>
      <Link to="/admin_dashboard">Back</Link>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input type="file" name="homeTeamImage" onChange={handleChange} />

        <input
          type="text"
          name="homeTeam"
          onChange={handleChange}
          placeholder="Home Team"
        />

        <input type="file" name="awayTeamImage" onChange={handleChange} />

        <input
          type="text"
          name="awayTeam"
          onChange={handleChange}
          placeholder="Away Team"
        />

        <input type="text" name="venue" onChange={handleChange} />

        <input type="date" name="date" onChange={handleChange} />

        <button type="submit">Add Fixture</button>
      </form>

      {/* LIST */}
      <div className="admin-fixtures-grid">
        {fixtures.map((f) => (
          <div className="admin-card" key={f.id}>
            <img src={`${BASE_URL}/${f.homeTeamImage}`} alt="Home" />

            <h3>VS</h3>

            <img src={`${BASE_URL}/${f.awayTeamImage}`} alt="Away" />

            <p>{f.homeTeam}</p>
            <p>{f.awayTeam}</p>
            <p>{f.venue}</p>
            <p>{f.date}</p>

            <button onClick={() => handleDelete(f.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminSchedulePage;
