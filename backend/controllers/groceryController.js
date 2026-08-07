// backend/controllers/groceryController.js
require('dotenv').config();
const db = require('../config/database');
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Function 1: Get normal groceries
const getGroceries = (req, res) => {
  const searchQuery = req.query.q; 
  if (searchQuery) {
    const sql = `SELECT * FROM groceries WHERE name LIKE ?`;
    db.all(sql, [`%${searchQuery}%`], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  } else {
    db.all(`SELECT * FROM groceries`, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }
};

// Function 2: AI Smart Search
const smartSearch = async (req, res) => {
  const humanQuery = req.body.query;
  if (!humanQuery) return res.status(400).json({ error: "Please provide a query." });

  try {
    const aiPrompt = `The user wants to make: "${humanQuery}". Return a comma-separated list of 3 basic grocery items.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: aiPrompt
    });
    
    const suggestedItems = response.text.trim().split(',').map(item => item.trim());
    const placeholders = suggestedItems.map(() => 'name LIKE ?').join(' OR ');
    const sql = `SELECT * FROM groceries WHERE ${placeholders}`;
    const safeQueryParams = suggestedItems.map(item => `%${item}%`);

    db.all(sql, safeQueryParams, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ aiSuggestion: response.text.trim(), results: rows });
    });
  } catch (error) {
    console.error("🚨 CRITICAL AI ERROR:", error);
    res.status(500).json({ error: "Failed to process AI request" });
  }
};

// Export them so the router can use them
module.exports = { getGroceries, smartSearch };