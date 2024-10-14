import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { login } from "../Auth";

function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      email,
      password,
    };

    fetch("http://127.0.0.1:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        if (data.access_token && data.refresh_token) {
          login({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          });
          navigate("/admin_dashboard");
        } else {
          setApiError("Login failed: Invalid response data.");
          alert("Login failed: Invalid email or password. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setApiError("Login failed: Please try again.");
        alert("Login failed: Invalid email or password. Please try again.");
      });
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          {apiError && <p className="error-message">{apiError}</p>}
        </form>
      </div>
    </div>
  );
}

export default Admin;
