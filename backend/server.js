// Import tools
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

// ✅ IMPORT OUR CLEAN DATABASE CONFIGURATION
const db = require('./config/database');

// Initialize the server
const app = express();
const PORT = 3000;

// Set up Middleware (Security & Formatting)
app.use(cors()); // Allows your React frontend to talk to this server
app.use(express.json()); // Allows the server to read JSON data

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


// 4. Query the database using a Search Parameter!
app.get('/api/groceries', (req, res) => {
  // Grab the search term from the URL (e.g., ?q=milk)
  const searchQuery = req.query.q; 

  if (searchQuery) {
    // If the user typed something, use SQL to filter it
    console.log(`Searching database for: ${searchQuery}`);
    
    // The % symbols mean "anything before or after this word"
    const sql = `SELECT * FROM groceries WHERE name LIKE ?`;
    const safeQuery = `%${searchQuery}%`;
    
    db.all(sql, [safeQuery], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });

  } else {
    // If the search box is empty, return everything
    console.log("Fetching all groceries...");
    db.all(`SELECT * FROM groceries`, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }
});

// 5. The AI Brain: Smart Search Endpoint
app.post('/api/smart-search', async (req, res) => {
  const humanQuery = req.body.query; // e.g., "high protein breakfast"
  
  if (!humanQuery) {
    return res.status(400).json({ error: "Please provide a query." });
  }

  try {
    console.log(`🧠 AI is analyzing request: "${humanQuery}"`);
    
    // A. Ask the AI to figure out the ingredients (Using the NEW SDK!)
    const aiPrompt = `
      The user wants to make: "${humanQuery}". 
      Return a simple, comma-separated list of 3 basic grocery items needed to make this. 
      Do not use formatting, bullet points, or extra words. Just the items.
      Example output: eggs, milk, bacon
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: aiPrompt
    });
    
    // The new SDK stores the result directly in response.text
    const aiText = response.text.trim();
    console.log(`🤖 AI suggests: ${aiText}`);

    // B. Turn the AI string ("eggs, milk, bacon") into an array (['eggs', 'milk', 'bacon'])
    const suggestedItems = aiText.split(',').map(item => item.trim());

    // C. Search our SQLite database for these specific items!
    // We dynamically create enough '?' placeholders for however many items the AI suggests
    const placeholders = suggestedItems.map(() => 'name LIKE ?').join(' OR ');
    const sql = `SELECT * FROM groceries WHERE ${placeholders}`;
    
    // We format the array to work with SQL LIKE statements (e.g., '%eggs%')
    const safeQueryParams = suggestedItems.map(item => `%${item}%`);

    db.all(sql, safeQueryParams, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Send the matching groceries back to the frontend!
      res.json({
        aiSuggestion: aiText,
        results: rows
      });
    });

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to process AI request" });
  }
});

// 5. Turn the server on
app.listen(PORT, () => {
  console.log(`🚀 Grocery API is available at http://localhost:${PORT}/api/groceries`);
});