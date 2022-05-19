const http = require('http');
const config = require('config');
const dotenv = require('dotenv');

const app = require('./src/lib/server');
const log = require('./src/lib/log');

dotenv.config();

const server = http.createServer(app);

const { port } = config.server;

server.listen(port, () => {
  log.info(`App listening on port ${port}!`);
});
