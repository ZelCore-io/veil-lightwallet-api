const apicache = require('apicache');

const veilService = require('./services/veilService');

const cache = apicache.middleware;

module.exports = (app) => {
  app.get('/api/getblockcount', cache('10 seconds'), (req, res) => {
    veilService.getBlockCount(req, res);
  });
  app.get('/api/getpeerinfo', cache('2 minutes'), (req, res) => {
    veilService.getPeerInfo(req, res);
  });
  app.get('/api/getrawmempool', cache('10 seconds'), (req, res) => {
    veilService.getRawMempool(req, res);
  });
  app.get('/api/getblock/:hash?', cache('2 minutes'), (req, res) => {
    veilService.getBlock(req, res);
  });
  app.get('/api/getblockhash/:index?', cache('2 minutes'), (req, res) => {
    veilService.getBlockHash(req, res);
  });
  app.get('/api/getrawtransaction/:id?', cache('2 minutes'), (req, res) => {
    veilService.getRawTransaction(req, res);
  });
  app.get('/api/decoderawtransaction/:hex?', cache('2 minutes'), (req, res) => {
    veilService.decodeRawTransaction(req, res);
  });
  app.get('/api/gettxout/:txid?/:n?', cache('2 minutes'), (req, res) => {
    veilService.getTxOut(req, res);
  });
  app.get('/api/getanonoutputs/:inputsize?/:ringsize?', (req, res) => {
    veilService.getAnonOutputs(req, res);
  });
  app.get('/api/status/:scansecret?/:spendpublic?', cache('20 seconds'), (req, res) => {
    veilService.getWatchOnlyStatus(req, res);
  });
  app.get('/api/getwatchonlystatus/:scansecret?/:spendpublic?', cache('20 seconds'), (req, res) => {
    veilService.getWatchOnlyStatus(req, res);
  });
  app.get('/api/checkkeyimages/:keyimages?', cache('30 seconds'), (req, res) => {
    veilService.checkKeyImages(req, res);
  });
  app.get('/api/getwatchonlytxs/:scansecret?/:startingindex?', cache('30 seconds'), (req, res) => {
    veilService.getWatchOnlyTxs(req, res);
  });
  app.get('/api/importlightaddress/:scansecret?/:spendpublic?/:createdheight?', (req, res) => {
    veilService.importLightWalletAddress(req, res);
  });
  app.get('/api/importlightwalletaddress/:scansecret?/:spendpublic?/:createdheight?', (req, res) => {
    veilService.importLightWalletAddress(req, res);
  });

  app.post('/api/sendrawtransaction', (req, res) => {
    veilService.sendRawTransaction(req, res);
  });
};
