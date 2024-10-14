import React, { useState, useEffect } from "react";
import teamPhoto from "../assets/IKR_6003.jpg";
import axios from "axios";
import "./Team.css";

function Team() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/player/players");
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
    <div className="team-container">
      <img src={teamPhoto} alt="Team" />
      <h2>Players List</h2>
      <section className="players-section">
        {players.length > 0 ? (
          players.map((player) => (
            <div className="player-card" key={player.id}>
              <p className="name">{player.name}</p>
              <p className="position">{player.position}</p>
            </div>
          ))
        ) : (
          <p>No players available.</p>
        )}
      </section>
    </div>
  );
}

export default Team;
