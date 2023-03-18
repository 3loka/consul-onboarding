const http = require('http');
const axios = require('axios');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3001;
// const thirdPartyURL = 'http://127.0.0.1:3002'
const thirdPartyProxyURL = 'http://127.0.0.1:' + process.env.THIRDPARTY_SERVICE_PORT || 1200;


const server = http.createServer((req, res) => {
  axios.get(thirdPartyProxyURL)
    .then((response) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`Backend service calling Third party service: ${response.data}\n\n`);
    })
    .catch((error) => {
      console.log(error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Error calling Third party service\n');
    });
});

server.listen(port, hostname, () => {
  console.log(`Backend Server running at http://${hostname}:${port}/`);
});

