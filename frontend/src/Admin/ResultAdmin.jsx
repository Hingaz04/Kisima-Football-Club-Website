import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ResultAdmin.css"; // new CSS file

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

  // Fetch results from backend
  useEffect(() => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) return;

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    axios
      .get("http://127.0.0.1:5000/result/results", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        setResults(response.data);
      })
      .catch((err) => {
        console.error("Error fetching results:", err);
        setError("Failed to fetch results.");
      });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.homeTeamImage) newErrors.homeTeamImage = "Home team image is required";
    if (!formData.homeTeam) newErrors.homeTeam = "Home team is required";
    if (!formData.awayTeamImage) newErrors.awayTeamImage = "Away team image is required";
    if (!formData.awayTeam) newErrors.awayTeam = "Away team is required";
    if (!formData.result) newErrors.result = "Result is required";
    if (!formData.venue) newErrors.venue = "Venue is required";
    if (!formData.date) newErrors.date = "Date is required";
    return newErrors;
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) return;
    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    const resultData = new FormData();
    resultData.append("homeTeamImage", formData.homeTeamImage);
    resultData.append("homeTeam", formData.homeTeam);
    resultData.append("awayTeamImage", formData.awayTeamImage);
    resultData.append("awayTeam", formData.awayTeam);
    resultData.append("result", formData.result);
    resultData.append("venue", formData.venue);
    resultData.append("date", formData.date);

    setLoading(true);
    axios
      .post("http://127.0.0.1:5000/result/results", resultData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setResults([response.data, ...results]);
        setSuccess("Result added successfully!");
        setFormData({
          homeTeamImage: null,
          awayTeamImage: null,
          homeTeam: "",
          awayTeam: "",
          result: "",
          venue: "",
          date: "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error adding result:", err);
        setError("Failed to add result.");
        setLoading(false);
      });
  };

  // Delete result
  const handleDelete = (id) => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) return;
    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    axios
      .delete(`http://127.0.0.1:5000/result/result/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        setResults(results.filter((result) => result.id !== id));
        alert("Result deleted successfully!");
      })
      .catch((err) => {
        console.error("Error deleting result:", err);
        setError("Failed to delete result.");
      });
  };

  return (
    <div className="result-page">
      <h1>Results Admin Page</h1>
      <Link to="/admin_dashboard">Back to Admin Dashboard</Link>

      <form className="result-form" onSubmit={handleSubmit}>
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
            placeholder="Home Team Name"
            required
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
            placeholder="Away Team Name"
            required
          />
        </div>
        <div className="form-group">
          <label>Result:</label>
          <input
            type="text"
            name="result"
            value={formData.result}
            onChange={handleChange}
            placeholder="Enter Result"
            required
          />
        </div>
        <div className="form-group">
          <label>Venue:</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="Venue"
            required
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <button type="submit" disabled={loading}>Add Result</button>
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{JSON.stringify(error)}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>

      <h2>Results List</h2>
      {results.length === 0 && <p>No results available.</p>}

      <div className="results-grid">
        {results.map((result) => (
          <div className="card" key={result.id}>
            <img
              src={`http://127.0.0.1:5000/fixture/${result.homeTeamImage}`}
              alt="Home Team"
            />
            <h3>VS</h3>
            <img
              src={`http://127.0.0.1:5000/fixture/${result.awayTeamImage}`}
              alt="Away Team"
            />
            <p>Home Team: {result.homeTeam}</p>
            <p>Away Team: {result.awayTeam}</p>
            <p>Result: {result.result}</p>
            <p>Venue: {result.venue}</p>
            <p>Date: {result.date}</p>
            <button onClick={() => handleDelete(result.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultAdmin;