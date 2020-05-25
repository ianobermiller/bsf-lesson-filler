if (typeof global.TextEncoder === 'undefined') {
  const {TextEncoder, TextDecoder} = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

if (typeof global.crypto === 'undefined') {
  // global.crypto = require('webcrypto-shim');
  // global.crypto = require('@trust/webcrypto');
  const {Crypto} = require('@peculiar/webcrypto');
  global.crypto = new Crypto();
  console.log(global.crypto.subtle);
  // global.crypto.getRandomValues = require('crypto').randomFillSync;
}
