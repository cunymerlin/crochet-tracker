const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// GET all projects
app.get("/projects", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single project
app.get("/projects/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new project
app.post("/projects", async (req, res) => {
  const { name, yarn_color, pattern, status, notes } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO projects (name, yarn_color, pattern, status, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, yarn_color, pattern, status, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update project
app.put("/projects/:id", async (req, res) => {
  const { name, yarn_color, pattern, status, notes } = req.body;
  try {
    const result = await pool.query(
      "UPDATE projects SET name=$1, yarn_color=$2, pattern=$3, status=$4, notes=$5 WHERE id=$6 RETURNING *",
      [name, yarn_color, pattern, status, notes, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE project
app.delete("/projects/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM projects WHERE id = $1", [req.params.id]);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));