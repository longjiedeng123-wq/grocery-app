// Import tools
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');


// ✅ IMPORT OUR CLEAN DATABASE CONFIGURATION
const db = require('./config/database');

const { getGroceries, smartSearch } = require('./controllers/groceryController');
// Initialize the server
const app = express();
const PORT = 3000;

// Set up Middleware (Security & Formatting)
app.use(cors()); // Allows your React frontend to talk to this server
app.use(express.json()); // Allows the server to read JSON data


app.get('/api/groceries', getGroceries);
app.post('/api/smart-search', smartSearch);

// 5. Turn the server on
app.listen(PORT, () => {
  console.log(`🚀 Grocery API is available at http://localhost:${PORT}/api/groceries`);
});