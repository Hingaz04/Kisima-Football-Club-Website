import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Players.css";

const API = "https://kisima-football-club-website-27xr.onrender.com";

function AcademyPlayers() {
  const [academyPlayers, setAcademyPlayers] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    position: "",
  });
  const [errors, setErrors] = useState({});

  // ================= TOKEN =================
  const getToken = () => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) return null;
    return JSON.parse(token).access_token;
  };

  // ================= FETCH PLAYERS =================
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError("Token not found");
      return;
    }

    fetch(`${API}/academy/players/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setAcademyPlayers(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch academy players");
      });
  }, []);

  // ================= FORM HANDLER =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.position) newErrors.position = "Position is required";
    return newErrors;
  };

  // ================= ADD PLAYER =================
  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    const token = getToken();
    if (!token) return;

    fetch(`${API}/academy/players/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: form.name,
        position: form.position,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add");
        return res.json();
      })
      .then((data) => {
        setAcademyPlayers((prev) => [...prev, data]);
        setForm({ name: "", position: "" });
        window.alert("Academy player added successfully!");
      })
      .catch((err) => console.error(err));
  };

  // ================= DELETE PLAYER =================
  const handleDelete = (id) => {
    const token = getToken();
    if (!token) return;

    fetch(`${API}/academy/players/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        setAcademyPlayers((prev) => prev.filter((player) => player.id !== id));
        window.alert("Deleted successfully!");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="players">
      <Link to="/admin_dashboard">Back to Admin Dashboard</Link>

      <h1>ACADEMY PLAYERS</h1>

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit} className="add-player-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
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
          />
          {errors.position && (
            <span className="error-message">{errors.position}</span>
          )}
        </label>

        <button type="submit">Add Player</button>
      </form>

      {/* ================= LIST ================= */}
      <section>
        <h2>Academy Players List</h2>

        {error && <p className="error-message">{error}</p>}

        {academyPlayers.length === 0 ? (
          <p>No academy players available.</p>
        ) : (
          <ul>
            {academyPlayers.map((player, index) => (
              <li key={player.id}>
                <p>
                  {index + 1}. {player.name}
                </p>
                <p>Position: {player.position}</p>

                <button onClick={() => handleDelete(player.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default AcademyPlayers;
