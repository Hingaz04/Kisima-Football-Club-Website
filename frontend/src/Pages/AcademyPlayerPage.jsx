import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AcademyPlayerPage.css";

function AcademyPlayerPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/academy-player/academy-players"
      );
      if (Array.isArray(response.data)) {
        setPlayers(response.data);
      } else {
        console.error("Unexpected response format for players:", response.data);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  return (
    <div className="academy-team-container">
      <h2 className="academy-players-title">Players List</h2>
      <ol className="academy-players-list">
        {players.length > 0 ? (
          players.map((player) => (
            <li className="academy-player-item" key={player.id}>
              <div className="academy-player-info">
                <span className="player-bold">Name: </span>
                {player.name}
              </div>
              <div className="academy-player-info">
                <span className="player-bold">Position: </span>
                {player.position}
              </div>
            </li>
          ))
        ) : (
          <p>No players available.</p>
        )}
      </ol>
    </div>
  );
}

export default AcademyPlayerPage;
