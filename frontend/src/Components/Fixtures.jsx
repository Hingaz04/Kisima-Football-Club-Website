import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Fixtures.css";

function Fixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/fixture/fixtures")
      .then((response) => {
        const sortedFixtures = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setFixtures(sortedFixtures);
      })
      .catch((err) => {
        console.error("Error fetching fixtures:", err);
        setError("Failed to fetch fixtures.");
      });
  }, []);

  return (
    <div className="fixtures-page">
      <h1 className="fixtures-heading">Fixtures</h1>
      {fixtures.length === 0 && (
        <p className="fixtures-message">No fixtures available.</p>
      )}
      <ul className="fixtures-list">
        {fixtures.map((fixture) => (
          <li className="fixture-item" key={fixture.id}>
            <div className="fixture-team-row">
              <img
                className="fixture-team-image"
                src={`http://127.0.0.1:5000/fixture/${fixture.homeTeamImage}`}
                alt="Home Team"
              />
              <h2 className="fixture-vs">VS</h2>
              <img
                className="fixture-team-image"
                src={`http://127.0.0.1:5000/fixture/${fixture.awayTeamImage}`}
                alt="Away Team"
              />
            </div>
            <div className="fixture-details-row">
              <p className="fixture-team-name">{fixture.homeTeam}</p>
              <p className="fixture-team-name">{fixture.awayTeam}</p>
            </div>
            <p className="fixture-details">
              <span className="fixture-details-span">Venue:</span>{" "}
              {fixture.venue}
            </p>
            <p className="fixture-details">
              <span className="fixture-details-span">Date:</span> {fixture.date}
            </p>
          </li>
        ))}
      </ul>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Fixtures;
