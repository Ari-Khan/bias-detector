import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
  safetySettings,
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 1.0,
  },
});

app.post('/content/ai', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided.' });
  }

  try {
    const formattedPrompt = `Here is an article or passage:
"""
${prompt}
"""

Give exactly two key points about whether it contains misinformation or disinformation, and why.`;

    const result = await geminiModel.generateContent(formattedPrompt);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (error) {
    console.error('Error with Gemini AI:', error);
    res.status(500).json({ error: 'Failed to generate AI response.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'pages', 'index.js'));
});

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});