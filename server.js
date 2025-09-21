// 1. Import all the necessary packages
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// 2. Configure the server
const app = express();
const port = 3000; // You can use any port you like

// 3. Set up middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to understand JSON data from requests

// 4. Initialize the Gemini Model
// Make sure you have GEMINI_API_KEY in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use the latest model

// 5. Define the API endpoint for your chatbot
app.post('/ask', async (req, res) => {
  try {
    const { prompt } = req.body; // Get the user's prompt from the request body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const systemPrompt = "You are an expert and friendly computer science tutor. Your specialty is explaining complex data structures and algorithms in a simple, clear, and encouraging way. You are helping a student learn sorting algorithms on an interactive website. Keep your answers concise, accurate, and focused on the student's question. Format your code snippets and technical terms appropriately using markdown-style formatting (e.g., backticks for code `like this`, and asterisks for *emphasis*).";

    // Ask Gemini for a response
    const result = await model.generateContent([systemPrompt, prompt]);
    const response = await result.response;
    const text = response.text();

    // Send the response back to the frontend
    res.json({ response: text });

    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: 'Failed to get a response from the AI.' });
  }
});

// 6. Start the server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});