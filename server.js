import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import next from 'next';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

server.use(cors());
server.use(bodyParser.json());

server.post('/content/ai', (req, res) => {
  const { prompt } = req.body;
  if (prompt) {
    res.json({ response: `Received prompt: ${prompt}` });
  } else {
    res.status(400).json({ error: 'Prompt is required!' });
  }
});

server.all('*', (req, res) => {
  return handle(req, res);
});

// Start Next.js app
app.prepare().then(() => {
  server.listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`);
  });
});

export default server;

export const handler = server;

