const l = require('./log');
const {SignJWT, jwtVerify, importPKCS8, importSPKI} = require('jose');

const {JWT_PUBLIC_KEY, JWT_PRIVATE_KEY} = process.env;

const sign = async payload => {
  return await new SignJWT(payload)
    .setProtectedHeader({alg: 'EdDSA'})
    .setExpirationTime('1m')
    .sign(await importPKCS8(JWT_PRIVATE_KEY, 'ed25519'));
};

const verify = async token => {
  try {
    return (await jwtVerify(token, await importSPKI(JWT_PUBLIC_KEY, 'ed25519'))).payload;
  } catch (e) {
    l.w('Error:', e);
  }

  return null;
};

module.exports = {
  sign,
  verify
};
