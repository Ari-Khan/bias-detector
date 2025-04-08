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
  model: 'gemini-1.5-flash',
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
    const formattedPrompt = `Here is an article or passage:\n"""${prompt}"""\n. Create points about misinformation and disinformation and anser EXACTLY in the provided format. A left-bias would be closer to the principles socialism while a right bias is closer to the principles of fascism. If the text is more right wing, increase the Right Wing Score. If the text is more left wing, increase the Left Wing Score. DO NOT INCLUDE EXTRA TEXT BEFORE OR AFTER THE RESPONSE, ONLY RESPOND WITH A COMPLETE RESPONSE, DO NOT RESPOND WITH THE TEMPLATE. Format: "Point 1|Point 2|Right-Wing Score NUMBER out of 100|Left-Wing Score NUMBER out of 100|Credibility NUMBER out of 100". Example prompt "Democrats are a weak party. - Fox News" Response: "There is not sufficient evidence to support the claim|The claim could have been made by biased individuals|20|80|40". Example prompt 2: "Trump is an unqualified candidate. - New York Times" Response: "There is not sufficient evidence to support the claim|The claim attempts to degrade a person by commenting about their experience|70|30|50"`;
    
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
