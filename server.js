import express from 'express';
import path from 'path';  // For path resolution
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'pages')));

app.get("/:folder", (req, res, next) => {
  const folder = req.params.folder;
  const filePath = path.join(__dirname, 'pages', folder, 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});

app.get("/:folder/*", (req, res, next) => {
  const folder = req.params.folder;
  const subPath = req.params[0];
  const filePath = path.join(__dirname, 'pages', folder, subPath);
  res.sendFile(filePath, (err) => {
    if (err) next();
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
