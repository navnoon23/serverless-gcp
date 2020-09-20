// [START gae_node_request_example]
const express = require('express');
const https = require('https');
const app = express();

app.get('/api', async function (req, res) {
  const state = (req.query.state || (req.body && req.body.state) || 'wi');

  const resp = await new Promise(resolve => {
    https.get(`https://api.covidtracking.com/v1/states/${state}/current.json`, resolve);
  });

  let data = await new Promise((resolve, reject) => {
    let data = '';
    resp.on('data', chunk => data += chunk);
    resp.on('error', err => reject(err));
    resp.on('end', () => resolve(data));
  });

  console.log(data);
  const parsedData = JSON.parse(data);
  console.log(parsedData);
  
  let covidData = `Date=${parsedData.date} State=${parsedData.state} Positive=${parsedData.positive}`;
  console.log(covidData);

  res.status(200).send(covidData).end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;