// 1. Import our tools
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
// 2. Initialize the server
const app = express();
const PORT = 3000;

// 3. Set up Middleware (Security & Formatting)
app.use(cors()); // Allows your React frontend to talk to this server
app.use(express.json()); // Allows the server to read JSON data

const db = new sqlite3.Database('./groceries.db', (err) => {
  if (err) console.error("Database error:", err.message);
  else console.log('✅ Connected to the SQLite database.');
});

// 3. Create the table and add data (if it's empty)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS groceries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    store TEXT,
    price TEXT
  )`);

  db.get(`SELECT COUNT(*) AS count FROM groceries`, (err, row) => {
    if (row.count === 0) {
      console.log("Database is empty. Seeding initial data...");
      const insert = db.prepare(`INSERT INTO groceries (name, store, price) VALUES (?, ?, ?)`);
      insert.run("Milk", "Trader Joe's", "$3.99");
      insert.run("Milk", "Whole Foods", "$4.99");
      insert.run("Eggs", "Ralphs", "$2.99");
      insert.run("Bread", "Trader Joe's", "$2.49");
      insert.finalize();
    }
  });
});

// 5. Create our grocery API Routes
app.get('/api/groceries', (req, res) => {
  console.log("Fetching grocery data from SQLite database...");
  db.all(`SELECT * FROM groceries`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    // Send the SQL rows back to React as JSON
    res.json(rows);
  });
});


// 5. Turn the server on
app.listen(PORT, () => {
  console.log(`🚀 Grocery API is available at http://localhost:${PORT}/api/groceries`);
});