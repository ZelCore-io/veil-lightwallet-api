const { randomBytes } = require('crypto');
const secp256k1 = require('secp256k1');
const SxAddress = require('./StealthAddress');


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

  function buf2hex(buffer) { // buffer is an ArrayBuffer
    return [...new Uint8Array(buffer)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
  }
  
  const scanPriv = generatePrivateKey();
  const spendPriv = generatePrivateKey();
  // pass all the data into the stealth address class
  const address = new SxAddress(
    scanPriv,
    generatePublicKey(scanPriv),
    spendPriv,
    generatePublicKey(spendPriv)
  );
  
  console.log(scanPriv.toString("hex"));
  console.log(spendPriv.toString("hex"));
  console.log(buf2hex(generatePublicKey(spendPriv).buffer));
  console.log(address.toJson());