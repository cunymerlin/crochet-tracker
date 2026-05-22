import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function App() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ name: "", yarn_color: "", pattern: "", status: "In Progress", notes: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const res = await axios.get(`${API}/projects`);
    setProjects(res.data);
  };

  const handleSubmit = async () => {
    if (!form.name) return alert("Name is required");
    if (editingId) {
      await axios.put(`${API}/projects/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(`${API}/projects`, form);
    }
    setForm({ name: "", yarn_color: "", pattern: "", status: "In Progress", notes: "" });
    fetchProjects();
  };

  const handleEdit = (project) => {
    setForm({ name: project.name, yarn_color: project.yarn_color, pattern: project.pattern, status: project.status, notes: project.notes });
    setEditingId(project.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/projects/${id}`);
    fetchProjects();
  };

  const filtered = filter === "All" ? projects : projects.filter(p => p.status === filter);

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <h1>🧶 Crochet Project Tracker</h1>

      <div style={{ background: "#f9f9f9", padding: 20, borderRadius: 8, marginBottom: 24 }}>
        <h2>{editingId ? "Edit Project" : "Add Project"}</h2>
        <input placeholder="Project name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <input placeholder="Yarn color" value={form.yarn_color} onChange={e => setForm({ ...form, yarn_color: e.target.value })} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <input placeholder="Pattern" value={form.pattern} onChange={e => setForm({ ...form, pattern: e.target.value })} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: "100%", marginBottom: 8, padding: 8 }}>
          <option>In Progress</option>
          <option>Done</option>
          <option>Frogged</option>
        </select>
        <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ width: "100%", marginBottom: 8, padding: 8 }} />
        <button onClick={handleSubmit} style={{ padding: "8px 16px", background: "#6c4ab6", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
          {editingId ? "Update" : "Add Project"}
        </button>
        {editingId && <button onClick={() => { setEditingId(null); setForm({ name: "", yarn_color: "", pattern: "", status: "In Progress", notes: "" }); }} style={{ marginLeft: 8, padding: "8px 16px" }}>Cancel</button>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <strong>Filter: </strong>
        {["All", "In Progress", "Done", "Frogged"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ marginRight: 8, padding: "4px 12px", background: filter === s ? "#6c4ab6" : "#eee", color: filter === s ? "white" : "black", border: "none", borderRadius: 4, cursor: "pointer" }}>{s}</button>
        ))}
      </div>

      {filtered.map(p => (
        <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <h3 style={{ margin: "0 0 4px" }}>{p.name}</h3>
          <p style={{ margin: "2px 0" }}>🎨 {p.yarn_color} &nbsp; 📋 {p.pattern}</p>
          <p style={{ margin: "2px 0" }}>Status: <strong>{p.status}</strong></p>
          {p.notes && <p style={{ margin: "2px 0", color: "#666" }}>{p.notes}</p>}
          <button onClick={() => handleEdit(p)} style={{ marginTop: 8, marginRight: 8, padding: "4px 12px", cursor: "pointer" }}>Edit</button>
          <button onClick={() => handleDelete(p.id)} style={{ padding: "4px 12px", background: "#e74c3c", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;