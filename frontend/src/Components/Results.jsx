import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Results.css";

function Results() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const BASE_URL = "https://kisima-football-club-website-27xr.onrender.com";

  useEffect(() => {
    axios
      .get(`${BASE_URL}/results`)
      .then((response) => {
        const sortedResults = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );
        setResults(sortedResults);
      })
      .catch((err) => {
        console.error("Error fetching results:", err);
        setError("Failed to fetch results.");
      });
  }, []);

  // ✅ SAFE IMAGE HANDLER
  const fixImageUrl = (img) => {
    if (!img) return "";

    if (img.startsWith("http")) return img;

    if (img.startsWith("/")) return `${BASE_URL}${img}`;

    return `${BASE_URL}/${img}`;
  };

  return (
    <div className="results-page">
      <h1 className="results-heading">Results</h1>

      {results.length === 0 && (
        <p className="results-message">No results available.</p>
      )}

      <ul className="results-list">
        {results.map((result) => (
          <li key={result.id} className="results-item">
            <div className="results-team-row">
              {/* HOME IMAGE */}
              <img
                className="results-team-image"
                src={fixImageUrl(result.homeTeamImage)}
                alt={result.homeTeam}
              />

              <h2 className="results-vs">VS</h2>

              {/* AWAY IMAGE */}
              <img
                className="results-team-image"
                src={fixImageUrl(result.awayTeamImage)}
                alt={result.awayTeam}
              />
            </div>

            <div className="results-details-row">
              <p className="results-team-name">{result.homeTeam}</p>
              <p className="results-team-name2">{result.awayTeam}</p>
            </div>

            <h2 className="results-final-head">
              <span className="results-final">Result:</span> {result.result}
            </h2>

            <p className="results-venue">
              <span className="results-final">Venue:</span> {result.venue}
            </p>

            <p className="results-date">
              <span className="results-final">Date:</span> {result.date}
            </p>
          </li>
        ))}
      </ul>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Results;
