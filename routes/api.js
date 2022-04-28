const express = require("express");
const router = express.Router();
var request = require("request");

const dotenv = require("dotenv");
dotenv.config();

const USER = process.env.RPC_USER;
const PASS = process.env.RPC_PASSWORD;
const RPC_PORT = process.env.RPC_PORT;

const headers = {
  "content-type": "text/plain;"
};

router.get("/test", (req, res) => res.json({ msg: "backend works" }));


// ... routes will go here
router.get("/getblockcount", (req, res) => {
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblockcount","params":[]}`;
    var options = {
      url: `http://${USER}:${PASS}@127.0.0.1:${RPC_PORT}/`,
      method: "POST",
      headers: headers,
      body: dataString
    };
    
    callback = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        res.send(data);
      }
    };
    request(options, callback);
  });


  router.get("/getpeerinfo", (req, res) => {
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getpeerinfo","params":[]}`;
    var options = {
      url: `http://${USER}:${PASS}@127.0.0.1:${RPC_PORT}/`,
      method: "POST",
      headers: headers,
      body: dataString
    };
    
    callback = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        res.send(data);
      }
    };
    request(options, callback);
  });


  router.get("/getrawmempool", (req, res) => {
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getrawmempool","params":[]}`;
    var options = {
      url: `http://${USER}:${PASS}@127.0.0.1:${RPC_PORT}/`,
      method: "POST",
      headers: headers,
      body: dataString
    };
    
    callback = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        res.send(data);
      }
    };
    request(options, callback);
  });

  router.get("/getblock/:hash", (req, res) => {
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblock","params":["${
      req.params.hash
    }"]}`;
    var options = {
      url: `http://${USER}:${PASS}@127.0.0.1:${RPC_PORT}/`,
      method: "POST",
      headers: headers,
      body: dataString
    };
    
    callback = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        res.send(data);
      }
    };
    request(options, callback);
  });

  router.get("/getblockhash/:index", (req, res) => {
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblockhash","params":[${
      req.params.index
    }]}`;
    var options = {
      url: `http://${USER}:${PASS}@127.0.0.1:${RPC_PORT}/`,
      method: "POST",
      headers: headers,
      body: dataString
    };
    
    callback = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        res.send(data);
      }
    };
    request(options, callback);
  });

  router.get("/getrawtransaction/:id", (req, res) => {
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getrawtransaction","params":["${
      req.params.id
    }"]}`;
    var options = {
      url: `http://${USER}:${PASS}@127.0.0.1:${RPC_PORT}/`,
      method: "POST",
      headers: headers,
      body: dataString
    };
    
    callback = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        res.send(data);
      }
    };
    request(options, callback);
  });

  router.get("/decoderawtransaction/:hex", (req, res) => {
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"decoderawtransaction","params":["${
      req.params.hex
    }"]}`;
    var options = {
      url: `http://${USER}:${PASS}@127.0.0.1:${RPC_PORT}/`,
      method: "POST",
      headers: headers,
      body: dataString
    };
    
    callback = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        res.send(data);
      }
    };
    request(options, callback);
  });

  router.get("/status", (req, res) => {
    var scansecret= req.query.scansecret;
    var spendpublic = req.query.spendpublic;

    var params = [];
    params.push(`"${scansecret}"`);
    params.push(`"${spendpublic}"`);
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getwatchonlystatus","params":[${params.join(',')}]}`;
    
    var options = {
      url: `http://${USER}:${PASS}@127.0.0.1:${RPC_PORT}/`,
      method: "POST",
      headers: headers,
      body: dataString
    };
    
    callback = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        res.send(data);
      }
    };
    request(options, callback);
  });

  router.get("/checkkeyimages", (req, res) => {
    var images = req.query.keyimages;

    console.log(images);
    let test = [];
    for(const item in images) {
      test.push(`"${images[item]}"`);
    }

    var params = [];
    params.push(`[${test}]`);
    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"checkkeyimages","params":[${params.join(',')}]}`;
    
    console.log(dataString);
    var options = {
      url: `http://${USER}:${PASS}@127.0.0.1:${RPC_PORT}/`,
      method: "POST",
      headers: headers,
      body: dataString
    };
    
    callback = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        res.send(data);
      }
    };
    request(options, callback);
  });

  router.get("/getanonoutputs", (req, res) => {
    var inputsize = req.query.inputsize;
    var ringsize = req.query.ringsize;

    if (typeof inputsize == 'undefined') {
        inputsize = 11;
    }

    if (typeof ringsize == 'undefined') {
        ringsize = 11;
    }

    var params = [inputsize, ringsize]

    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getanonoutputs","params":[${params}]}`;

    var options = {
      url: `http://${USER}:${PASS}@127.0.0.1:${RPC_PORT}/`,
      method: "POST",
      headers: headers,
      body: dataString
    };
    
    callback = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        res.send(data);
      } else if(!error) {
        res.send(JSON.parse(body));
      }
    };
    request(options, callback);
  });

  router.get("/getwatchonlytxes", (req, res) => {
    var scansecret = req.query.scansecret;
    var scanpublic = req.query.scanpublic;
    var spendsecret = req.query.spendsecret;

    var params = [];
    params.push(`"${scansecret}"`);

    if (typeof spendsecret == 'undefined' & typeof scanpublic !== 'undefined') {
        res.send('Must have valid scanpublic, and spendsecret');
        return;
    }

    if (typeof scanpublic == 'undefined' & typeof spendsecret !== 'undefined') {
        res.send('Must have valid scanpublic, and spendsecret');
        return;
    }

    if (typeof scanpublic == 'undefined') {
        scanpublic = "";
    } else {
        params.push(`"${scanpublic}"`);
    }
    
    if (typeof spendsecret == 'undefined') {
        spendsecret = "";
    } else {
        params.push(`"${spendsecret}"`);
    }

    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getwatchonlytxes","params":[${params.join(',')}]}`;
    
    var options = {
      url: `http://${USER}:${PASS}@127.0.0.1:${RPC_PORT}/`,
      method: "POST",
      headers: headers,
      body: dataString
    };
    
    callback = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        res.send(JSON.stringify(data));
      }
    };
    request(options, callback);
  });

  router.get("/importlightaddress", (req, res) => {
    var scansecret = req.query.scansecret;
    var spendpublic = req.query.spendpublic;
    var createdheight = req.query.createdheight;
   
    if (typeof scansecret == 'undefined') {
        res.send('Must have valid scansecret');
        return;
    }

    if (typeof spendpublic == 'undefined') {
        res.send('Must have valid scanpublic');
        return;
    }

    if (typeof createdheight == 'undefined') {
        res.send('Must have valid createdheight');
        return;
    }

    if (spendpublic.length != 66) {
        res.send('Use valid scanpublic key, size must be 66 characters');
        return;
    }

    if (createdheight < 0) {
        res.send('Created height must be a valid block height, or timestamp');
        return;
    }
    

    var params = [];
    params.push(`"${scansecret}"`);
    params.push(`"${spendpublic}"`);
    params.push(`${createdheight}`);

    var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"importlightwalletaddress","params":[${params.join(',')}]}`;
    
    var options = {
      url: `http://${USER}:${PASS}@127.0.0.1:${RPC_PORT}/`,
      method: "POST",
      headers: headers,
      body: dataString
    };
    
    callback = (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const data = JSON.parse(body);
        res.send(data);
      } else if(!error) {
        res.send(JSON.parse(body));
      }
    };
    request(options, callback);
  });
  

module.exports = router;