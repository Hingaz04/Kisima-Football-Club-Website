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
    <div className="fixturesPage">
      <h1 className="fixturesHeading">Fixtures</h1>
      {fixtures.length === 0 && (
        <p className="fixturesMessage">No fixtures available.</p>
      )}
      <ul className="fixturesList">
        {fixtures.map((fixture) => (
          <li className="fixtureItem" key={fixture.id}>
            <div className="fixtureTeam-row">
              <img
                className="fixtureTeam-image"
                src={`http://127.0.0.1:5000/fixture/${fixture.homeTeamImage}`}
                alt="Home Team"
              />
              <h2 className="fixtureVS">VS</h2>
              <img
                className="fixtureTeam-image"
                src={`http://127.0.0.1:5000/fixture/${fixture.awayTeamImage}`}
                alt="Away Team"
              />
            </div>
            <div className="fixtureDetails-row">
              <p className="fixtureTeam-name">{fixture.homeTeam}</p>
              <p className="fixtureTeam-name">{fixture.awayTeam}</p>
            </div>
            <p className="fixtureDetails">
              <span className="fixtureDetails-span">Venue:</span>{" "}
              {fixture.venue}
            </p>
            <p className="fixtureDetails">
              <span className="fixtureDetails-span">Date:</span> {fixture.date}
            </p>
          </li>
        ))}
      </ul>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Fixtures;
