// 1. Import our tools
const express = require('express');
const cors = require('cors');

// 2. Initialize the server
const app = express();
const PORT = 3000;

// 3. Set up Middleware (Security & Formatting)
app.use(cors()); // Allows your React frontend to talk to this server
app.use(express.json()); // Allows the server to read JSON data

// 4. Create our first API Route (The Endpoint)
app.get('/api/test', (req, res) => {
  console.log("Someone just hit the test endpoint!");
  res.json({ message: "Hello from your new Express Backend!" });
});

// 5. Turn the server on
app.listen(PORT, () => {
  console.log(`🚀 Backend Server is running on http://localhost:${PORT}/api/test`);
});