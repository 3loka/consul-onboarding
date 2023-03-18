const http = require('http');
const axios = require('axios');

const hostname = '127.0.0.1';
const port = 3001;
const thirdPartyURL = 'http://127.0.0.1:4002'

const server = http.createServer((req, res) => {
  axios.get(thirdPartyURL)
    .then((response) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`Backend service calling Thirdparty service: ${response.data}\n\n`);
    })
    .catch((error) => {
      console.log(error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Error calling Thirdparty service\n');
    });
});

server.listen(port, hostname, () => {
  console.log(`Backend Server running at http://${hostname}:${port}/`);
});

