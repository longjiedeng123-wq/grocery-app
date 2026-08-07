const sqlite3 = require('sqlite3').verbose();

// 1. Connect to the database
const db = new sqlite3.Database('./groceries.db', (err) => {
  if (err) console.error("Database error:", err.message);
  else console.log('✅ Connected to the SQLite database.');
});

// 2. Create tables and seed data
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

// 3. Export the connected database so server.js can use it
module.exports = db;