// 1. Import our tools
const express = require('express');
const cors = require('cors');

// 2. Initialize the server
const app = express();
const PORT = 3000;

// 3. Set up Middleware (Security & Formatting)
app.use(cors()); // Allows your React frontend to talk to this server
app.use(express.json()); // Allows the server to read JSON data

const GROCERY_DB = [
  { id: 1, name: "Milk", store: "Trader Joe's", price: "$3.99" },
  { id: 2, name: "Milk", store: "Whole Foods", price: "$4.99" },
  { id: 3, name: "Eggs", store: "Ralphs", price: "$2.99" },
  { id: 4, name: "Bread", store: "Trader Joe's", price: "$2.49" }
];
// 4. Create our first API Route (The Endpoint)
app.get('/api/test', (req, res) => {
  console.log("Someone just hit the test endpoint!");
  res.json({ message: "Hello from your new Express Backend!" });
});

// 5. Create our grocery API Routes
app.get('/api/groceries', (req, res) => {
  console.log("Fetching grocery data...");
  res.json(GROCERY_DB);
});

// 5. Turn the server on
app.listen(PORT, () => {
  console.log(`🚀 Backend Server is running on http://localhost:${PORT}/api/test`);
  console.log(`🚀 Grocery API is available at http://localhost:${PORT}/api/groceries`);
});