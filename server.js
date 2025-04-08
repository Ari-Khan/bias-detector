import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  // Import CORS
import dotenv from 'dotenv';  // Import dotenv for environment variables

// Initialize environment variables
dotenv.config();

const app = express();

// Middleware setup
app.use(cors());  // Enable CORS for all origins
app.use(bodyParser.json());  // Parse incoming JSON requests

// Route example (you can add your logic here)
app.get('/', (req, res) => {
  res.send('Hello from Express on Vercel!');
});

// Example POST endpoint (you can use this for your AI-related functionality)
app.post('/content/ai', (req, res) => {
  const { prompt } = req.body;
  if (prompt) {
    res.json({ response: `Received prompt: ${prompt}` });
  } else {
    res.status(400).json({ error: 'Prompt is required!' });
  }
});

// Export the app for Vercel to run as a serverless function
export default app;

// Vercel will call this handler when requests are sent to the API route
export const handler = app;

