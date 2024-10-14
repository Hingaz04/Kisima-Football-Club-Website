import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Players.css";

function Players() {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    position: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

    if (!token) {
      console.error("Token not found");
      return;
    }

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    fetch("http://127.0.0.1:5000/player/players", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched players:", data);
        setPlayers(data);
      })
      .catch((err) => {
        console.error("Error fetching players:", err);
        setError("Failed to fetch players.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.position) newErrors.position = "Position is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) {
      console.error("Token not found");
      return;
    }

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: form.name,
        position: form.position,
      }),
    };

    fetch("http://127.0.0.1:5000/player/players", requestOptions)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Player added:", data);
        setPlayers([...players, data]);
        window.alert("Player added successfully!");
      })
      .catch((err) => console.error("Error:", err));
  };

  const handleDeletePlayer = (id) => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) {
      console.error("Token not found");
      return;
    }

    const parsedToken = JSON.parse(token);
    const accessToken = parsedToken.access_token;

    fetch(`http://127.0.0.1:5000/player/player/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete player");
        }
        setPlayers(players.filter((player) => player.id !== id));
        window.alert("Player deleted successfully!");
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="players">
      <Link to="/admin_dashboard">Back to Admin Dashboard</Link>
      <h1>Players</h1>

      <form onSubmit={handleSubmit} className="add-player-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </label>
        <label>
          Position:
          <input
            type="text"
            name="position"
            value={form.position}
            onChange={handleChange}
            required
          />
          {errors.position && (
            <span className="error-message">{errors.position}</span>
          )}
        </label>
        <button type="submit">Add Player</button>
      </form>

      <section>
        <h2>Player List</h2>
        {error && <p className="error-message">{error}</p>}
        {players.length === 0 && <p>No players available.</p>}
        <ul>
          {players.map((player, index) => (
            <li key={player.id}>
              <p>
                {index + 1}. Name: {player.name}
              </p>{" "}
              {/* Numbered list */}
              <p>Position: {player.position}</p>
              <button onClick={() => handleDeletePlayer(player.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Players;
