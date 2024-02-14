const express = require('express');
const axios = require('axios');
const https = require('https');
const app = express();
const secretServerUrl = 'sercert server url';

app.use(express.json());

app.all('*', async (req, res) => {
  try {
   
    const { host, ...headers } = req.headers;
    const axiosConfig = {
      method: req.method,
      url: secretServerUrl + req.url,
      
      headers,
      data: req.method === 'GET' ? undefined : req.body,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      
    };
    const response = await axios(axiosConfig);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Error:', error);

    if (error.response) {
      console.error('Error Response:', error.response.data);
      res.status(error.response.status).send(error.response.data);
    } else {
      console.error('Internal Server Error');
      res.status(500).send('Internal Server Error');
    }
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
