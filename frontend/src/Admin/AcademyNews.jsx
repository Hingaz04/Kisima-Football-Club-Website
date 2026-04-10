import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API =
  "https://kisima-football-club-website-27xr.onrender.com";

function AcademyNews() {
  const [academyNews, setAcademyNews] = useState([]);
  const [form, setForm] = useState({
    title: "",
    image: null,
    description: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => {
    const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
    if (!token) return null;
    return JSON.parse(token).access_token;
  };

  // ================= FETCH =================
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    axios
      .get(`${API}/academy/news/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAcademyNews(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) return;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("image", form.image);
    formData.append("description", form.description);
    formData.append("date", form.date);

    setLoading(true);

    axios
      .post(`${API}/academy/news/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAcademyNews([res.data, ...academyNews]);
        setSuccess("News added!");
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to add news");
        setLoading(false);
      });
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    const token = getToken();
    if (!token) return;

    axios
      .delete(`${API}/academy/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setAcademyNews((prev) => prev.filter((n) => n.id !== id));
        alert("Deleted!");
      })
      .catch(() => setError("Delete failed"));
  };

  return (
    <div>
      <h1>Academy News</h1>
      <Link to="/admin_dashboard">Back</Link>

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        <input type="file" name="image" onChange={handleChange} />

        <button disabled={loading}>Add News</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      {/* LIST */}
      <ul>
        {academyNews.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>

            {item.image && (
              <img
                src={`${API}${item.image}`}
                alt={item.title}
                width="200"
              />
            )}

            <p>{item.description}</p>

            <button onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AcademyNews;