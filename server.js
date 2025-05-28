const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('✅ Backend is up and running on Render!');
});

// Get all entries
app.get('/api/entries', (req, res) => {
  db.query('SELECT * FROM entries ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add a new entry
app.post('/api/entries', (req, res) => {
  const { name, amount, category } = req.body;
  const query = 'INSERT INTO entries (name, amount, category) VALUES (?, ?, ?)';
  db.query(query, [name, amount, category], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ message: 'Entry added', id: result.insertId });
  });
});

// Delete an entry
app.delete('/api/entries/:id', (req, res) => {
  const entryId = req.params.id;
  db.query('DELETE FROM entries WHERE id = ?', [entryId], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Entry deleted successfully' });
  });
});

// Get all categories
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add a new category
app.post('/api/categories', (req, res) => {
  const { name, description, icon } = req.body;
  const query = 'INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)';
  db.query(query, [name, description, icon], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ message: 'Category added', id: result.insertId });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
