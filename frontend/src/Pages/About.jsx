import React, { useState, useEffect } from "react";
import axios from "axios";
import "./About.css";

function About() {
  const [players, setPlayers] = useState({
    goalkeepers: [],
    defenders: [],
    midfielders: [],
    attackers: [],
  });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/player/players");
      console.log("API Response:", response.data); // Debugging line
      if (response.data && Array.isArray(response.data)) {
        const categorizedPlayers = categorizePlayers(response.data);
        setPlayers(categorizedPlayers);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const categorizePlayers = (playersData) => {
    const goalkeepers = playersData.filter(
      (player) => player.position === "Goalkeeper"
    );
    const defenders = playersData.filter(
      (player) => player.position === "Defender"
    );
    const midfielders = playersData.filter(
      (player) => player.position === "Midfielder"
    );
    const attackers = playersData.filter(
      (player) => player.position === "Attacking"
    );

    return {
      goalkeepers: goalkeepers || [],
      defenders: defenders || [],
      midfielders: midfielders || [],
      attackers: attackers || [],
    };
  };

  return (
    <div className="kisima-about-box">
      <h1 className="kisima-about-title">About Kisima FC</h1>
      <p className="kisima-about-text">
        Kisima FC is a passionate football club based in Nairobi, Kenya founded
        in 2011. Over the years, Kisima FC evolved from its casual roots into a
        competitive force in local football.
      </p>
      <p className="kisima-about-text">
        Today, Kisima FC competes fiercely in Nairobi’s county football league
        and continues to be a symbol of community and ambition. The team’s home
        ground, Mahiga Primary, serves as a hub for both seasoned players and
        young talents, all united by their love for football and commitment to
        excellence.
      </p>
      <p className="kisima-about-text">
        Kisima FC is more than just a football team; it is a community where
        friendships are forged, talent is nurtured, and the spirit of the game
        is celebrated. As the team looks to the future, it remains focused on
        its core values of sportsmanship, teamwork, and continuous improvement.
      </p>

      <h2 className="kisima-subtitle">Motto</h2>
      <p className="kisima-about-text">
        "Unity Through Football, Excellence Through Effort"
      </p>

      <h2 className="kisima-subtitle">Mission</h2>
      <p className="kisima-about-text">
        Our mission is to foster a love for football in our community by
        providing a platform for players to develop and compete.
      </p>

      <h2 className="kisima-subtitle">Vision</h2>
      <p className="kisima-about-text">
        Our vision is to be a leading football club in Nairobi, renowned for our
        commitment to nurturing young talent, achieving excellence on the field,
        and making a positive impact in our community through the sport we love.
      </p>

      <h2 className="kisima-subtitle">Team Officials</h2>
      <ul className="kisima-team-details">
        <li>
          <strong>Team Manager:</strong> Dan Njuguna
        </li>
        <li>
          <strong>Assistant Team Manager:</strong> Fredrick Mwangi
        </li>
        <li>
          <strong>Team Welfare:</strong> Kepha Momanyi
        </li>
        <li>
          <strong>Team Treasurer</strong> John Macharia
        </li>
        <li>
          <strong>Team Doctor</strong> Henry Wangai
        </li>
        <li>
          <strong>Coach:</strong> Pele Makana
        </li>
        <li>
          <strong>Assisant Coach:</strong> Dennis Wekesa
        </li>
        <li>
          <strong>Team Captain:</strong> Stanley Chege
        </li>
        <li>
          <strong>Assistant Team Captain:</strong> Dalmas Otieno
        </li>
        <li>
          <strong>Home Ground:</strong> Mahiga Primary
        </li>
      </ul>

      <h2 className="kisima-subtitle">Players</h2>
      <div className="kisima-players-container">
        <h3 className="kisima-players-category">Goalkeepers:</h3>
        <ul className="kisima-player-list">
          {Array.isArray(players.goalkeepers) &&
          players.goalkeepers.length > 0 ? (
            players.goalkeepers.map((player) => (
              <li key={player.id}>{player.name}</li>
            ))
          ) : (
            <li>No goalkeepers available.</li>
          )}
        </ul>
        <h3 className="kisima-players-category">Defenders:</h3>
        <ul className="kisima-player-list">
          {Array.isArray(players.defenders) && players.defenders.length > 0 ? (
            players.defenders.map((player) => (
              <li key={player.id}>{player.name}</li>
            ))
          ) : (
            <li>No defenders available.</li>
          )}
        </ul>
        <h3 className="kisima-players-category">Midfielders:</h3>
        <ul className="kisima-player-list">
          {Array.isArray(players.midfielders) &&
          players.midfielders.length > 0 ? (
            players.midfielders.map((player) => (
              <li key={player.id}>{player.name}</li>
            ))
          ) : (
            <li>No midfielders available.</li>
          )}
        </ul>
        <h3 className="kisima-players-category">Attackers:</h3>
        <ul className="kisima-player-list">
          {Array.isArray(players.attackers) && players.attackers.length > 0 ? (
            players.attackers.map((player) => (
              <li key={player.id}>{player.name}</li>
            ))
          ) : (
            <li>No attackers available.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default About;
