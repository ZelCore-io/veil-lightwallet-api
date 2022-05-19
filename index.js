const http = require('http');
const config = require('config');

const app = require('./src/lib/server');
const log = require('./src/lib/log');

const server = http.createServer(app);

const { port } = config.server;

server.listen(port, () => {
  log.info(`App listening on port ${port}!`);
});
