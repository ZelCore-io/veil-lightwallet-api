const { randomBytes } = require('crypto');
const { response } = require('express');
const { stat } = require('fs');
const secp256k1 = require('secp256k1');
const SxAddress = require('../stealth/StealthAddress');
const axios = require('axios').default;
var request = require("request");

const dotenv = require("dotenv");
dotenv.config();

const WATCHONLY_API_URL = "http://164.92.101.99:4444/api/";
const GET_BLOCCK_COUNT = "getblockcount";
const GET_ADDRESS_STATUS = "status";
const GET_IMPORT_ADDRESS = "importlightaddress";
const GET_TRANSACTIONS = "getwatchonlytxes";
const GET_CHECK_KEYIMAGES = "checkkeyimages";

const USER = process.env.RPC_USER;
const PASS = process.env.RPC_PASSWORD;
const RPC_PORT = process.env.LIGHT_WALLET_RPC_PORT;

const headers = {
    "content-type": "text/plain;"
  };

// Private Scan b159d2e0177706b1abbe770f94a962dc8c663243aaacceaf96eb209aa332949c
// Private Spend ac16a86d6c23ee28c7d7abe15556f273ce0cbda097540978a9cfda2470b670c6
// Public Spend 023e3442f0c3196d1e2819697955e60b39d8d60921200df785f9505613e9fa507b
// {
//   "scanPub": "2,174,96,113,132,115,194,223,34,253,16,213,47,88,160,105,17,16,198,231,81,109,178,158,74,169,63,110,203,252,32,192,62",
//   "spendPub": "2,62,52,66,240,195,25,109,30,40,25,105,121,85,230,11,57,216,214,9,33,32,13,247,133,249,80,86,19,233,250,80,123",
//   "scanPriv": "hidden",
//   "spendPriv": "hidden",
//   "options": 0,
//   "address": "3tXzvUU6PnWvZZaDt56uX8B9DT62QRVvAheWwRCyiG4TJyco8CdxbzkHUD24Ns7jdMP4GicdUMo5AmGCdTwfhq3QPHqUJvoZGF9sYWm",
//   "isStealth": {
//     "valid": false
//   }
// }

// generates a private key from a secure/random source

generatePrivateKey = () => {
    // generate privKey
    let privKey;
    do {
      privKey = randomBytes(32);
      // check if the seed is within the secp256k1 range
    } while (!secp256k1.privateKeyVerify(privKey));
  
    return privKey;
  };
  
  // generate a public key based on the current seeds
  generatePublicKey = privKey => {
    // get the public key in a compressed format
    return secp256k1.publicKeyCreate(privKey);
  };



  hex2Buf = hexString => {
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  };

  buf2hex = buffer => {
    return buffer.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  };
  

// Read keys 
const readScanPriv = hex2Buf("b159d2e0177706b1abbe770f94a962dc8c663243aaacceaf96eb209aa332949c", "hex");
if(!secp256k1.privateKeyVerify(readScanPriv)) {
    console.log("Failed to read scan private key");
}

const readPublicSpend = hex2Buf("023e3442f0c3196d1e2819697955e60b39d8d60921200df785f9505613e9fa507b");
if(readPublicSpend.length != 33) {
    console.log("Failed to read public scan key");
}

const readSpendPriv = hex2Buf("ac16a86d6c23ee28c7d7abe15556f273ce0cbda097540978a9cfda2470b670c6");
if(!secp256k1.privateKeyVerify(readSpendPriv)) {
    console.log("Failed to read spend private key");
}

let addressVerified = false;
let utxos = [];
let utxosKeyImages = [];

// Create Stealth Address
const address = new SxAddress(
    readScanPriv,
    generatePublicKey(readScanPriv),
    readSpendPriv,
    generatePublicKey(readSpendPriv)
  );

// Check if address is synced to watchonly server

async function checkAddressStatus() {
    try {
        const params = { scansecret: buf2hex(readScanPriv), spendpublic: buf2hex(readPublicSpend)};
        let response = await axios.get(WATCHONLY_API_URL+GET_ADDRESS_STATUS, {params});
        console.log("Address Status: " + response.data.result.status);
        if (response.data.result.status === "synced") {
            addressVerified = true;
        }
        return response.data.result;
    } catch(error) {
        console.log(error);
        return error;
    }
}

async function importAddress() {
    try {
        const params = { scansecret: buf2hex(readScanPriv), spendpublic: buf2hex(readPublicSpend), createdheight: 0};
        let response = await axios.get(WATCHONLY_API_URL+GET_IMPORT_ADDRESS, {params});
        if (response.data.result === "Success") {
            console.log("Imported address " + response.data.stealth_address_normal + ".\n Scanning from block " + response.data.created_on + ".\n Imported on " + response.data.imported_on);
            return true;
        } else {
            console.log(response.data);
            return false;
        }
    } catch(error) {
        console.log(error);
        return false;
    }
}

async function getTransactions() {
    try {
        if (!addressVerified) {
            console.log("Address not verified by server");
            return false;
        }
        const params = { scansecret: buf2hex(readScanPriv), spendpublic: buf2hex(readPublicSpend) };
        let response = await axios.get(WATCHONLY_API_URL+GET_TRANSACTIONS, {params});

        let objStr = JSON.stringify(response.data.result);
        utxos = JSON.parse(objStr);
        return true;
    } catch(error) {
        console.log(error);
        return false;
    }
}

async function checkKeyImages() {
    try {
        if (!utxosKeyImages.length) {
            console.log("No Key images to find");
            return false;
        }

        var keys = [];
        for (item in utxosKeyImages) {
            keys.push(utxosKeyImages[item].keyimage);
        }

        const params = { keyimages: keys };
        let response = await axios.get(WATCHONLY_API_URL+GET_CHECK_KEYIMAGES, {params});

        // update our keyimage list
        for (item in response.data.result) {
            if (response.data.result[item].status === 'valid') {
                utxosKeyImages[item].spent = response.data.result[item].spent;
            } else {
                utxosKeyImages[item].spent = null;
            }
        }
       
        return true;
    } catch(error) {
        console.log(error);
        return false;
    }
}

function checkcallback() {
    console.log("Checking keys now!");
    checkKeyImages();
};

/// Get the keyimages from the light wallet
/// This would be done by Zelcore running the daemon with -lightwallet=1
/// calling getkeyimages and passing in the correct params
async function getKeyImages(checkcallback) {
    try {
        console.log("Call getKeyImages()");
        var keyimages = [];
        for (const item in Object.keys(utxos)) {
            keyimages.push(`"${utxos[item].raw}"`);
        }

        var params = [];
        params.push(`[${keyimages}]`);
        params.push(`"${buf2hex(readSpendPriv)}"`);
        params.push(`"${buf2hex(readScanPriv)}"`);
        params.push(`"${buf2hex(readPublicSpend)}"`);
        var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getkeyimages","params":[${params.join(',')}]}`;

        var options = {
            url: `http://${USER}:${PASS}@127.0.0.1:${RPC_PORT}/`,
            method: "POST",
            headers: headers,
            body: dataString
        };
        function callback(error, response, body) {
            console.log("Call getKeyImages() callback");
            if (!error && response.statusCode == 200) {
                const data = JSON.parse(body);
                for(const item in data.result) {
                    console.log("Got keyimage")
                    utxosKeyImages.push(data.result[item]);
                }
                console.log(utxosKeyImages)
                return checkcallback();
            } else if(!error) {
                console.log(response);
            } else {
                console.log(error);
            }
        };
        return request(options, callback)
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function checkSpendableAmount() {
    var amount = 0;
    for (const item in utxosKeyImages) {
        if (utxosKeyImages[item].spent === false) {
            amount += utxosKeyImages[item].amount;
        }
    }
    return amount;
}

// API - Check address status - If address not imported, import it. 
// API - Fetch transactions for address
// Light Daemon - Get keyimages
// API - Check keyimage is spent
// API - Fetch anonoutputs
// Light Daemon - Build Tx

async function run() {
    try {
        var imported = false;
        // See if address is imported
        await checkAddressStatus().then(function(value) {
            if (value.status === "failed") {
                imported = false;
            } else if (value.status === "scanning") {
                console.log("Server is scanning the blockchain for address transactions");
                return;
            } else {
                imported = true;
            }
        });

        if (!imported) {
            await importAddress().then(function(value) {
                console.log("importing address finished");
            });
        }

        // Get the transactions
        await getTransactions().then(function(value) {
            if(value) {
                console.log("Found ", utxos.length, " ringct transactions!!!");
            } else {
                console.log("Get transactions failed");
            }
        });

        await getKeyImages(checkcallback)


        await checkSpendableAmount().then(function(value) {
            console.log("Spendable amount is : ", value);
        })





    } catch (error) {
        console.log(error);
    }
}




run();





















 


