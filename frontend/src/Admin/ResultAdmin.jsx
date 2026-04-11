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

  // FETCH RESULTS
  useEffect(() => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) return;

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    axios
      .get(`${BASE_URL}/results`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        setResults(Array.isArray(response.data) ? response.data : []);
      })
      .catch((err) => {
        console.error("Error fetching results:", err);
        setError("Failed to fetch results.");
      });
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // VALIDATION
  const validateForm = () => {
    const newErrors = {};
    if (!formData.homeTeamImage) newErrors.homeTeamImage = "Required";
    if (!formData.homeTeam) newErrors.homeTeam = "Required";
    if (!formData.awayTeamImage) newErrors.awayTeamImage = "Required";
    if (!formData.awayTeam) newErrors.awayTeam = "Required";
    if (!formData.result) newErrors.result = "Required";
    if (!formData.venue) newErrors.venue = "Required";
    if (!formData.date) newErrors.date = "Required";
    return newErrors;
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError("Please fill all fields");
      return;
    }

    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) return;

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    const resultData = new FormData();
    Object.entries(formData).forEach(([k, v]) => resultData.append(k, v));

    setLoading(true);

    axios
      .post(`${BASE_URL}/results`, resultData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setResults((prev) => [response.data, ...prev]);
        setSuccess("Result added successfully!");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error adding result:", err);
        setError("Failed to add result.");
        setLoading(false);
      });
  };

  // DELETE
  const handleDelete = (id) => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) return;

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    axios
      .delete(`${BASE_URL}/results/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        setResults((prev) => prev.filter((r) => r.id !== id));
      })
      .catch((err) => {
        console.error("Error deleting result:", err);
        setError("Failed to delete result.");
      });
  };

  // ✅ FIXED IMAGE HANDLER (ONLY CHANGE)
  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;

    // avoid double uploads/ prefix
    const cleaned = img.startsWith("/") ? img.slice(1) : img;

    if (cleaned.startsWith("uploads/")) {
      return `${BASE_URL}/${cleaned}`;
    }

    return `${BASE_URL}/uploads/${cleaned}`;
  };

  return (
    <div className="result-page">
      <h1>Results Admin Page</h1>
      <Link to="/admin_dashboard">Back to Admin Dashboard</Link>

      <form className="result-form" onSubmit={handleSubmit}>
        <p>HOME TEAM</p>
        <input type="file" name="homeTeamImage" onChange={handleChange} />
        <input
          type="text"
          name="homeTeam"
          value={formData.homeTeam}
          onChange={handleChange}
        />
        <p>AWAY TEAM</p>
        <input type="file" name="awayTeamImage" onChange={handleChange} />
        <input
          type="text"
          name="awayTeam"
          value={formData.awayTeam}
          onChange={handleChange}
        />
        <p>VENUE</p>
        <input
          type="text"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
        />
        <p>RESULTS</p>
        <input
          type="text"
          name="result"
          value={formData.result}
          onChange={handleChange}
        />

        <p>DATE</p>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          Add Result
        </button>

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {success && <p>{success}</p>}
      </form>

      <h2>Results List</h2>

      {results.length === 0 && <p>No results available.</p>}

      <div className="results-grid">
        {results.map((result) => (
          <div key={result.id} className="card">
            <img src={getImageUrl(result.homeTeamImage)} alt="Home" />
            <h3>VS</h3>
            <img src={getImageUrl(result.awayTeamImage)} alt="Away" />

            <p>{result.homeTeam}</p>
            <p>{result.awayTeam}</p>
            <p>{result.result}</p>
            <p>{result.venue}</p>
            <p>{result.date}</p>

            <button onClick={() => handleDelete(result.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultAdmin;