// db.js
// const mysql = require('mysql2');

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Hemanth@0453',
//   database: 'finance_dashboard',
// });

// db.connect((err) => {
//   if (err) {
//     console.error('MySQL connection error:', err);
//   } else {
//     console.log('Connected to MySQL database.');
//   }
// });

// module.exports = db;


const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
    process.exit(1);
  } else {
    console.log('✅ Connected to the database');
  }
});

module.exports = db;
