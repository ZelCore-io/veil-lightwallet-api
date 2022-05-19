const config = require('config');
const axios = require('axios');
// todo lru cache?

const serviceHelper = require('./serviceHelper');
const log = require('../lib/log');

const axiosConfig = {
  headers: {
    'Content-Type': 'text/plain',
  },
  timeout: 20000,
};

const veilURL = `http://${config.rpcUser}:${config.rpcPassword}@127.0.0.1:${config.rpcPort}/`;

async function performRPCcall(method, params = []) { // should throw
  const data = {
    jsonrpc: '1.0', id: 'curltext', method, params,
  };
  const stringData = serviceHelper.ensureString(data);
  const response = await axios.post(veilURL, stringData, axiosConfig);
  return response.data;
}

async function getBlockCount(req, res) {
  try {
    const response = await performRPCcall('getblockcount');
    res.json(response);
  } catch (error) {
    log.error(error);
    res.status(error.code || 500).send(error.message || 'Unexpected Error');
  }
}

async function getPeerInfo(req, res) {
  try {
    const response = await performRPCcall('getpeerinfo');
    res.json(response);
  } catch (error) {
    log.error(error);
    res.status(error.code || 500).send(error.message || 'Unexpected Error');
  }
}

async function getRawMempool(req, res) {
  try {
    const response = await performRPCcall('getrawmempool');
    res.json(response);
  } catch (error) {
    log.error(error);
    res.status(error.code || 500).send(error.message || 'Unexpected Error');
  }
}

async function getBlock(req, res) {
  try {
    let { hash } = req.params;
    hash = hash || req.query.hash;
    const response = await performRPCcall('getblock', [hash]);
    res.json(response);
  } catch (error) {
    log.error(error);
    res.status(error.code || 500).send(error.message || 'Unexpected Error');
  }
}

async function getBlockHash(req, res) {
  try {
    let { index } = req.params;
    index = index || req.query.index;
    const response = await performRPCcall('getblockhash', [index]);
    res.json(response);
  } catch (error) {
    log.error(error);
    res.status(error.code || 500).send(error.message || 'Unexpected Error');
  }
}

async function getRawTransaction(req, res) {
  try {
    let { id } = req.params;
    id = id || req.query.id;
    const response = await performRPCcall('getrawtransaction', [id]);
    res.json(response);
  } catch (error) {
    log.error(error);
    res.status(error.code || 500).send(error.message || 'Unexpected Error');
  }
}

async function decodeRawTransaction(req, res) {
  try {
    let { hex } = req.params;
    hex = hex || req.query.hex;
    const response = await performRPCcall('decoderawtransaction', [hex]);
    res.json(response);
  } catch (error) {
    log.error(error);
    res.status(error.code || 500).send(error.message || 'Unexpected Error');
  }
}

async function getTxOut(req, res) {
  try {
    let { txid } = req.txid;
    txid = txid || req.query.txid;
    let { n } = req.n;
    n = n || req.query.n;
    if (!txid || !n) {
      throw new Error('Missing transaction txid or n identifiers'); // TODO or let daemon handle it?
    }
    const response = await performRPCcall('gettxout', [txid, n, true]);
    res.json(response);
  } catch (error) {
    log.error(error);
    res.status(error.code || 500).send(error.message || 'Unexpected Error');
  }
}

async function getAnonOutputs(req, res) {
  try {
    let { inputsize } = req.params;
    inputsize = inputsize || req.query.inputsize || 11;
    let { ringsize } = req.params;
    ringsize = ringsize || req.query.ringsize || 11;
    const response = await performRPCcall('getanonoutputs', [inputsize, ringsize]);
    res.json(response);
  } catch (error) {
    log.error(error);
    res.status(error.code || 500).send(error.message || 'Unexpected Error');
  }
}

async function getWatchOnlyStatus(req, res) {
  try {
    let { scansecret } = req.params;
    scansecret = scansecret || req.query.scansecret;
    let { spendpublic } = req.params;
    spendpublic = spendpublic || req.query.spendpublic;
    const response = await performRPCcall('getwatchonlystatus', [scansecret, spendpublic]);
    res.json(response);
  } catch (error) {
    log.error(error);
    res.status(error.code || 500).send(error.message || 'Unexpected Error');
  }
}

async function checkKeyImages(req, res) { // iamge,imageB,imageC
  try {
    let { keyimages } = req.params;
    keyimages = keyimages || req.query.keyimages;

    const response = await performRPCcall('checkkeyimages', [keyimages]);
    res.json(response);
  } catch (error) {
    log.error(error);
    res.status(error.code || 500).send(error.message || 'Unexpected Error');
  }
}

async function getWatchOnlyTxs(req, res) {
  try {
    let { scansecret } = req.params;
    scansecret = scansecret || req.query.scansecret;
    let { scanpublic } = req.params;
    scanpublic = scanpublic || req.query.scanpublic;
    let { spendsecret } = req.params;
    spendsecret = spendsecret || req.query.spendsecret;

    if (!scansecret || !scanpublic || !spendsecret) {
      throw new Error('Must have a valid scanpublic and spendsecret and spendsecret');
    }

    const response = await performRPCcall('getwatchonlytxes', [scansecret, scanpublic, spendsecret]);
    res.json(response);
  } catch (error) {
    log.error(error);
    res.status(error.code || 500).send(error.message || 'Unexpected Error');
  }
}

async function importLightWalletAddress(req, res) {
  try {
    let { scansecret } = req.params;
    scansecret = scansecret || req.query.scansecret;
    let { spendpublic } = req.params;
    spendpublic = spendpublic || req.query.spendpublic;
    let { createdheight } = req.params;
    createdheight = createdheight || req.query.createdheight;

    if (!scansecret || !spendpublic || !createdheight) {
      throw new Error('Missing import parameter');
    }

    if (spendpublic.length !== 66) {
      throw new Error('Invalid scanpublic key');
    }

    if (serviceHelper.ensureNumber(createdheight) < 0) {
      throw new Error('Created height must be a blockheight or timestamp');
    }

    const response = await performRPCcall('importlightwalletaddress', [scansecret, spendpublic, createdheight]);
    res.json(response);
  } catch (error) {
    log.error(error);
    res.status(error.code || 500).send(error.message || 'Unexpected Error');
  }
}

async function sendRawTransaction(req, res) {
  let body = '';
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', async () => {
    try {
      const processedBody = serviceHelper.ensureObject(body);
      const tx = processedBody.rawhex;
      if (!tx) {
        throw new Error('No raw hex transaction submitted');
      }

      const response = await performRPCcall('sendrawtransaction', [tx]);
      res.json(response);
    } catch (error) {
      log.error(error);
      res.status(error.code || 500).send(error.message || 'Unexpected Error');
    }
  });
}

module.exports = {
  getBlockCount,
  getPeerInfo,
  getRawMempool,
  getBlock,
  getBlockHash,
  getRawTransaction,
  decodeRawTransaction,
  getTxOut,
  getAnonOutputs,
  getWatchOnlyStatus,
  checkKeyImages,
  getWatchOnlyTxs,
  importLightWalletAddress,
  sendRawTransaction,
};
