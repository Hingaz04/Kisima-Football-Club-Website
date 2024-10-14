import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Schedule.css";

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

  // Fetch fixtures from the backend
  useEffect(() => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) {
      console.error("Token not found");
      return;
    }

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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevForm) => ({ ...prevForm, [name]: files[0] }));
    } else {
      setFormData((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  // Validate the form inputs
  const validateForm = () => {
    const newErrors = {};
    if (!formData.homeTeamImage)
      newErrors.homeTeamImage = "Home team image is required";
    if (!formData.homeTeam) newErrors.homeTeam = "Home team is required";
    if (!formData.awayTeamImage)
      newErrors.awayTeamImage = "Away team image is required";
    if (!formData.awayTeam) newErrors.awayTeam = "Away team is required";
    if (!formData.result) newErrors.result = "Result is required";
    if (!formData.venue) newErrors.venue = "Venue is required";
    if (!formData.date) newErrors.date = "Date is required";
    return newErrors;
  };

  // Submit the form to add or update fixtures
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
        // Add the new result to the beginning of the list
        setResults([response.data, ...results]);
        setSuccess("Result added successfully!");
        setLoading(false);
        setFormData({
          homeTeamImage: null,
          homeTeam: "",
          awayTeamImage: null,
          awayTeam: "",
          result: "",
          venue: "",
          date: "",
        });
      })
      .catch((err) => {
        console.error("Error adding result:", err);
        setError("");
        setLoading(false);
      });
  };

  // Delete a fixture
  const handleDelete = (id) => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) {
      console.error("Token not found");
      return;
    }

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    axios
      .delete(`http://127.0.0.1:5000/result/result/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        setResults(results.filter((result) => result.id !== id));
        alert("result deleted successfully!");
      })
      .catch((err) => {
        console.error("Error deleting result:", err);
        setError("Failed to delete result.");
      });
  };

  return (
    <div className="schedule-page">
      <h1>Results Page</h1>
      <Link to="/admin_dashboard">Back to Admin Dashboard</Link>

      <form onSubmit={handleSubmit}>
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
            placeholder="Enter Away Team Name"
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
            placeholder="Enter results"
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
            placeholder="Enter venue"
            required
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          Add Result
        </button>
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>

      <h2>Results List</h2>
      {results.length === 0 && <p>No results available.</p>}
      <ul>
        {results.map((result) => (
          <li key={result.id}>
            <img
              src={`http://127.0.0.1:5000/fixture/${result.homeTeamImage}`}
              alt="Home Team"
            />
            <p>Home Team: {result.homeTeam}</p>
            <h2>VS</h2>
            <img
              src={`http://127.0.0.1:5000/fixture/${result.awayTeamImage}`}
              alt="Away Team"
            />
            <p>Away Team: {result.awayTeam}</p>
            <p>Result:{result.result}</p>
            <p>Venue: {result.venue}</p>
            <p>Date: {result.date}</p>
            <button onClick={() => handleDelete(result.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResultAdmin;
