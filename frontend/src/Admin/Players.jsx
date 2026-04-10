import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Players.css";

function Players() {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    position: "",
  });

  const [errors, setErrors] = useState({});

  const BASE_URL = "https://kisima-football-club-website-27xr.onrender.com";

  // --------------------
  // GET PLAYERS
  // --------------------
  useEffect(() => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");

    if (!token) return;

    const accessToken = JSON.parse(token).access_token;

    fetch(`${BASE_URL}/players/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch(() => setError("Failed to fetch players"));
  }, []);

  // --------------------
  // HANDLE INPUT
  // --------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // --------------------
  // VALIDATION
  // --------------------
  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.position) newErrors.position = "Position is required";
    return newErrors;
  };

  // --------------------
  // ADD PLAYER
  // --------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    const accessToken = JSON.parse(token).access_token;

    setLoading(true);

    fetch(`${BASE_URL}/players/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        setPlayers((prev) => [...prev, data]);
        setForm({ name: "", position: "" });
        setErrors({});
        alert("Player added successfully!");
      })
      .catch(() => setError("Failed to add player"))
      .finally(() => setLoading(false));
  };

  // --------------------
  // DELETE PLAYER
  // --------------------
  const handleDeletePlayer = (id) => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    const accessToken = JSON.parse(token).access_token;

    fetch(`${BASE_URL}/players/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setPlayers((prev) => prev.filter((p) => p.id !== id));
        alert("Player deleted!");
      })
      .catch(() => setError("Failed to delete player"));
  };

  return (
    <div className="players">
      <Link to="/admin_dashboard">Back to Admin Dashboard</Link>

      <h1>Players</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="add-player-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <span>{errors.name}</span>}
        </label>

        <label>
          Position:
          <input
            type="text"
            name="position"
            value={form.position}
            onChange={handleChange}
          />
          {errors.position && <span>{errors.position}</span>}
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Player"}
        </button>
      </form>

      {/* LIST */}
      <h2>Player List</h2>

      {error && <p>{error}</p>}
      {players.length === 0 && <p>No players available.</p>}

      <ul>
        {players.map((player, index) => (
          <li key={player.id}>
            <p>
              {index + 1}. {player.name}
            </p>
            <p>Position: {player.position}</p>

            <button onClick={() => handleDeletePlayer(player.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Players;
