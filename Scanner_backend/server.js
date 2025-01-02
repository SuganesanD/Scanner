const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/query-model', (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send('No prompt provided');
  }

  console.log('Received prompt:', prompt);

  // Mock response (replace with actual model logic if needed)
  const response = `Processed response for: ${prompt}`;
  res.send(response);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
