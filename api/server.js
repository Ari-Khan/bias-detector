const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/detect', (req, res) => {
  const { text } = req.body;
  
  res.json({ received: text });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
