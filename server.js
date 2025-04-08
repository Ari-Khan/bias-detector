import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json());

app.get('/:folder', (req, res, next) => {
  const folder = req.params.folder;
  const filePath = path.join(process.cwd(), 'pages', folder, 'index.js');

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      next();
    }
  });
});

app.use(express.static(path.join(process.cwd(), 'pages')));

app.get('/index.html', (req, res) => {
  res.redirect(301, '/');
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
