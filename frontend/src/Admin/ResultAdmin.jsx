import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ResultAdmin.css";

const BASE_URL = "https://kisima-football-club-website-27xr.onrender.com";

function ResultAdmin() {
  const [results, setResults] = useState([]);
  const [formData, setFormData] = useState({
    homeTeamImage: null,
    awayTeamImage: null,
    homeTeam: "",
    awayTeam: "",
    result: "",
    venue: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // --------------------------
  // GET RESULTS
  // --------------------------
  useEffect(() => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) return;

    const accessToken = JSON.parse(token).access_token;

    axios
      .get(`${BASE_URL}/results/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => setResults(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch results");
      });
  }, []);

  // --------------------------
  // HANDLE INPUT
  // --------------------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --------------------------
  // VALIDATION
  // --------------------------
  const validateForm = () => {
    const errors = {};
    if (!formData.homeTeamImage) errors.homeTeamImage = "Home image required";
    if (!formData.awayTeamImage) errors.awayTeamImage = "Away image required";
    if (!formData.homeTeam) errors.homeTeam = "Home team required";
    if (!formData.awayTeam) errors.awayTeam = "Away team required";
    if (!formData.result) errors.result = "Result required";
    if (!formData.venue) errors.venue = "Venue required";
    if (!formData.date) errors.date = "Date required";
    return errors;
  };

  // --------------------------
  // SUBMIT
  // --------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    const accessToken = JSON.parse(
      localStorage.getItem("REACT_TOKEN_AUTH_KEY"),
    ).access_token;

    const form = new FormData();
    form.append("homeTeamImage", formData.homeTeamImage);
    form.append("awayTeamImage", formData.awayTeamImage);
    form.append("homeTeam", formData.homeTeam);
    form.append("awayTeam", formData.awayTeam);
    form.append("result", formData.result);
    form.append("venue", formData.venue);
    form.append("date", formData.date);

    setLoading(true);

    axios
      .post(`${BASE_URL}/results/`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setResults([res.data, ...results]);
        setSuccess("Result added successfully!");
        setLoading(false);

        setFormData({
          homeTeamImage: null,
          awayTeamImage: null,
          homeTeam: "",
          awayTeam: "",
          result: "",
          venue: "",
          date: "",
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to add result");
        setLoading(false);
      });
  };

  // --------------------------
  // DELETE
  // --------------------------
  const handleDelete = (id) => {
    const accessToken = JSON.parse(
      localStorage.getItem("REACT_TOKEN_AUTH_KEY"),
    ).access_token;

    axios
      .delete(`${BASE_URL}/results/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        setResults(results.filter((r) => r.id !== id));
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to delete result");
      });
  };

  // --------------------------
  // UI
  // --------------------------
  return (
    <div className="result-page">
      <h1>Results Admin Page</h1>

      <Link to="/admin_dashboard">Back</Link>

      <form onSubmit={handleSubmit}>
        <input type="file" name="homeTeamImage" onChange={handleChange} />
        <input type="text" name="homeTeam" onChange={handleChange} />

        <input type="file" name="awayTeamImage" onChange={handleChange} />
        <input type="text" name="awayTeam" onChange={handleChange} />

        <input type="text" name="result" onChange={handleChange} />
        <input type="text" name="venue" onChange={handleChange} />
        <input type="date" name="date" onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Add Result"}
        </button>

        {typeof error === "object"
          ? Object.values(error).map((e, i) => <p key={i}>{e}</p>)
          : error && <p>{error}</p>}

        {success && <p>{success}</p>}
      </form>

      <div className="results-grid">
        {results.map((r) => (
          <div key={r.id} className="card">
            <img src={`${BASE_URL}/${r.homeTeamImage}`} alt="home" />

            <h3>VS</h3>

            <img src={`${BASE_URL}/${r.awayTeamImage}`} alt="away" />

            <p>
              {r.homeTeam} vs {r.awayTeam}
            </p>
            <p>{r.result}</p>
            <p>{r.venue}</p>
            <p>{r.date}</p>

            <button onClick={() => handleDelete(r.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultAdmin;
