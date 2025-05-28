require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Root route
app.get('/', (req, res) => {
  res.send('✅ Backend is up and running on Render!');
});

// Health check endpoint (optional)
app.get('/health', (req, res) => res.sendStatus(200));

// Get all entries
app.get('/api/entries', (req, res) => {
  db.query('SELECT * FROM entries ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database query error');
    }
    res.json(results);
  });
});

// Add a new entry
app.post('/api/entries', (req, res) => {
  const { name, amount, category } = req.body;
  const query = 'INSERT INTO entries (name, amount, category) VALUES (?, ?, ?)';
  db.query(query, [name, amount, category], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database insert error');
    }
    res.status(201).json({ message: 'Entry added', id: result.insertId });
  });
});

// Delete an entry
app.delete('/api/entries/:id', (req, res) => {
  const entryId = req.params.id;
  db.query('DELETE FROM entries WHERE id = ?', [entryId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database delete error');
    }
    res.json({ message: 'Entry deleted successfully' });
  });
});

// Get all categories
app.get('/api/categories', (req, res) => {
  db.query('SELECT * FROM categories ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database query error');
    }
    res.json(results);
  });
});

// Add a new category
app.post('/api/categories', (req, res) => {
  const { name, description, icon } = req.body;
  const query = 'INSERT INTO categories (name, description, icon) VALUES (?, ?, ?)';
  db.query(query, [name, description, icon], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database insert error');
    }
    res.status(201).json({ message: 'Category added', id: result.insertId });
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
