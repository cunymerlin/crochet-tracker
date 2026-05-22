import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,400&family=Quicksand:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #fff5f7;
    background-image: radial-gradient(circle at 20% 20%, #ffe4ec 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, #ffd6e8 0%, transparent 50%);
    min-height: 100vh;
    font-family: 'Quicksand', sans-serif;
  }

  .app { max-width: 680px; margin: 0 auto; padding: 48px 24px; }

  .header { text-align: center; margin-bottom: 40px; }
  .header h1 {
    font-family: 'Nunito', sans-serif;
    font-size: 2.8rem;
    font-weight: 800;
    color: #b5446e;
    letter-spacing: -0.5px;
    line-height: 1.1;
  }
  .header p { color: #c47a95; font-size: 0.95rem; margin-top: 8px; font-weight: 300; }

  .card {
    background: white;
    border-radius: 20px;
    padding: 28px;
    margin-bottom: 24px;
    box-shadow: 0 4px 24px rgba(181, 68, 110, 0.08);
    border: 1px solid #ffe0ec;
  }

  .card h2 {
    font-family: 'Nunito', sans-serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #b5446e;
    margin-bottom: 20px;
  }

  input, textarea, select {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid #f5c6d8;
    border-radius: 12px;
    margin-bottom: 12px;
    font-family: 'Quicksand', sans-serif;
    font-size: 0.9rem;
    color: #4a2035;
    background: #fff9fb;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus, textarea:focus, select:focus { border-color: #b5446e; }
  textarea { resize: vertical; min-height: 80px; }

  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 12px;
    font-family: 'Quicksand', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-primary { background: #b5446e; color: white; }
  .btn-primary:hover { background: #9e3860; transform: translateY(-1px); }
  .btn-secondary { background: #ffe0ec; color: #b5446e; margin-left: 10px; }
  .btn-secondary:hover { background: #ffd0e4; }
  .btn-danger { background: #ffe0ec; color: #c0446e; padding: 6px 14px; font-size: 0.8rem; }
  .btn-danger:hover { background: #ffcce0; }
  .btn-edit { background: #fff0f5; color: #b5446e; padding: 6px 14px; font-size: 0.8rem; margin-right: 8px; }
  .btn-edit:hover { background: #ffe4f0; }

  .filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
  .filter-btn {
    padding: 8px 18px;
    border-radius: 20px;
    border: 1.5px solid #f5c6d8;
    background: white;
    color: #c47a95;
    font-family: 'Quicksand', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .filter-btn.active { background: #b5446e; color: white; border-color: #b5446e; }
  .filter-btn:hover:not(.active) { background: #fff0f5; }

  .project-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 14px;
    border: 1.5px solid #ffe0ec;
    box-shadow: 0 2px 12px rgba(181, 68, 110, 0.05);
    transition: transform 0.2s;
  }
  .project-card:hover { transform: translateY(-2px); }

  .project-name {
    font-family: 'Nunito', sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: #4a2035;
    margin-bottom: 6px;
  }

  .project-meta { font-size: 0.85rem; color: #c47a95; margin-bottom: 4px; }
  .project-notes { font-size: 0.85rem; color: #9e6b80; margin-top: 8px; font-style: italic; }

  .status-badge {
    display: inline-block;
    padding: 3px 12px;
    border-radius: 20px;
    font-size: 0.78rem;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .status-inprogress { background: #fff3cd; color: #a07840; }
  .status-done { background: #d4f5e4; color: #2d7a55; }
  .status-frogged { background: #ffe0ec; color: #b5446e; }

  .project-actions { margin-top: 12px; }
  .empty { text-align: center; color: #c47a95; padding: 40px; font-style: italic; }
`;

const statusClass = (s) => {
  if (s === "Done") return "status-badge status-done";
  if (s === "Frogged") return "status-badge status-frogged";
  return "status-badge status-inprogress";
};

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
    if (!form.name) return alert("Project name is required!");
    if (editingId) {
      await axios.put(`${API}/projects/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(`${API}/projects`, form);
    }
    setForm({ name: "", yarn_color: "", pattern: "", status: "In Progress", notes: "" });
    fetchProjects();
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, yarn_color: p.yarn_color, pattern: p.pattern, status: p.status, notes: p.notes });
    setEditingId(p.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/projects/${id}`);
    fetchProjects();
  };

  const filtered = filter === "All" ? projects : projects.filter(p => p.status === filter);

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <h1>Crochet Tracker</h1>
          <p>keep track of your beautiful projects</p>
        </div>

        <div className="card">
          <h2>{editingId ? "Edit Project" : "New Project"}</h2>
          <input placeholder="Project name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Yarn color" value={form.yarn_color} onChange={e => setForm({ ...form, yarn_color: e.target.value })} />
          <input placeholder="Pattern" value={form.pattern} onChange={e => setForm({ ...form, pattern: e.target.value })} />
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option>In Progress</option>
            <option>Done</option>
            <option>Frogged</option>
          </select>
          <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <button className="btn btn-primary" onClick={handleSubmit}>
            {editingId ? "Update Project" : "Add Project"}
          </button>
          {editingId && (
            <button className="btn btn-secondary" onClick={() => { setEditingId(null); setForm({ name: "", yarn_color: "", pattern: "", status: "In Progress", notes: "" }); }}>
              Cancel
            </button>
          )}
        </div>

        <div className="filters">
          {["All", "In Progress", "Done", "Frogged"].map(s => (
            <button key={s} className={`filter-btn ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}>{s}</button>
          ))}
        </div>

        {filtered.length === 0 && <p className="empty">no projects yet — start creating!</p>}

        {filtered.map(p => (
          <div key={p.id} className="project-card">
            <div className={statusClass(p.status)}>{p.status}</div>
            <div className="project-name">{p.name}</div>
            {p.yarn_color && <div className="project-meta">{p.yarn_color}</div>}
            {p.pattern && <div className="project-meta">{p.pattern}</div>}
            {p.notes && <div className="project-notes">"{p.notes}"</div>}
            <div className="project-actions">
              <button className="btn btn-edit" onClick={() => handleEdit(p)}>Edit</button>
              <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;