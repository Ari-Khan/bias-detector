import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.json()); 

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
  safetySettings: [
  ],
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 1.0,
  },
});

app.post('/pages/bias-detector.html', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided.' });
  }

  try {
    const formattedPrompt = `Here is an article or passage:\n"""${prompt}"""\n. Create points about misinformation and disinformation and anser EXACTLY in the provided format. DO NOT INCLUDE EXTRA TEXT BEFORE OR AFTER THE RESPONSE. Format: "Point 1|Point 2|Bias Towards Right out of 100|Bias Towards Left out of 100|Credibility out of 100". Example response: "There is not sufficient evidence to support the claim|The claim could have been made by biased individuals|30|70|40".`;
    
    const result = await geminiModel.generateContent(formattedPrompt);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (error) {
    console.error('Error with Gemini AI:', error);
    res.status(500).json({ error: 'Failed to generate AI response.' });
  }
});

app.use(express.static(path.join(__dirname, 'pages')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
