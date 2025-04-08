import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'pages')));

app.get("/:page", (req, res, next) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, 'pages', `${page}.js`);
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      next();
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.js'));
});

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
