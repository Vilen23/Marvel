const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const port = 3000;

// Your Marvel API keys
const publicKey = 'e3a9ad29b3529796fdaba380bdaaac8c';
const privateKey = '82dc043b98e7625300cfa17c8da2a0c3613594f8';

// Middleware to calculate the hash
app.use((req, res, next) => {
  const timestamp = new Date().getTime().toString();
  const hash = crypto
    .createHash('md5')
    .update(timestamp + privateKey + publicKey)
    .digest('hex');

  req.marvelParams = {
    ts: timestamp,
    apikey: publicKey,
    hash: hash,
  };

  next();
});

// Example route to fetch comics
app.get('/comics', async (req, res) => {
  try {
    const response = await axios.get(
      'https://gateway.marvel.com/v1/public/comics',
      {
        params: req.marvelParams,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching comics:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
