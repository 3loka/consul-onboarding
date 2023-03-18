const http = require('http');
const axios = require('axios');


const hostname = '127.0.0.1';
const port = 3000;
const backendURL = 'http://127.0.0.1:4001'


const server = http.createServer((req, res) => {

  axios.get(backendURL)
    .then((response) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`UI is calling Backend: ${response.data}\n\n`);
    })
    .catch((error) => {
      console.log(error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Error calling Backend\n');
    });
});

server.listen(port, hostname, () => {
  console.log(`UI Server running at http://${hostname}:${port}/`);
});

