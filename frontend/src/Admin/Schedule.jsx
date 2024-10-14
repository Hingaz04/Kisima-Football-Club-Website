import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Schedule.css";

function SchedulePage() {
  const [fixtures, setFixtures] = useState([]);
  const [formData, setFormData] = useState({
    homeTeamImage: null,
    awayTeamImage: null,
    homeTeam: "",
    awayTeam: "",
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
      .get("http://127.0.0.1:5000/fixture/fixtures", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        setFixtures(response.data);
      })
      .catch((err) => {
        console.error("Error fetching fixtures:", err);
        setError("Failed to fetch fixtures.");
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

    const fixtureData = new FormData();
    fixtureData.append("homeTeamImage", formData.homeTeamImage);
    fixtureData.append("homeTeam", formData.homeTeam);
    fixtureData.append("awayTeamImage", formData.awayTeamImage);
    fixtureData.append("awayTeam", formData.awayTeam);
    fixtureData.append("venue", formData.venue);
    fixtureData.append("date", formData.date);

    setLoading(true);
    axios
      .post("http://127.0.0.1:5000/fixture/fixtures", fixtureData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        // Add the new fixture to the beginning of the list
        setFixtures([response.data, ...fixtures]);
        setSuccess("Fixture added successfully!");
        setLoading(false);
        setFormData({
          homeTeamImage: null,
          homeTeam: "",
          awayTeamImage: null,
          awayTeam: "",
          venue: "",
          date: "",
        });
      })
      .catch((err) => {
        console.error("Error adding fixture:", err);
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
      .delete(`http://127.0.0.1:5000/fixture/fixture/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        setFixtures(fixtures.filter((fixture) => fixture.id !== id));
        alert("Fixture deleted successfully!");
      })
      .catch((err) => {
        console.error("Error deleting fixture:", err);
        setError("Failed to delete fixture.");
      });
  };

  return (
    <div className="schedule-page">
      <h1>Schedule Page</h1>
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
          Add Fixture
        </button>
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>

      <h2>Fixture List</h2>
      {fixtures.length === 0 && <p>No fixtures available.</p>}
      <ul>
        {fixtures.map((fixture) => (
          <li key={fixture.id}>
            <img
              src={`http://127.0.0.1:5000/fixture/${fixture.homeTeamImage}`}
              alt="Home Team"
            />
            <p>Home Team: {fixture.homeTeam}</p>
            <h2>VS</h2>
            <img
              src={`http://127.0.0.1:5000/fixture/${fixture.awayTeamImage}`}
              alt="Away Team"
            />
            <p>Away Team: {fixture.awayTeam}</p>
            <p>Venue: {fixture.venue}</p>
            <p>Date: {fixture.date}</p>
            <button onClick={() => handleDelete(fixture.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SchedulePage;
