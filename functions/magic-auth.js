const AWS = require('aws-sdk');
const {Magic} = require('@magic-sdk/admin');
const l = require('../lib/log');
const ddb = require('../lib/ddb');

const {MAGIC_SEC_KEY} = process.env;

exports.handler = async (event) => {
  l.d('>>> REQ <<<', event);
  l.d('env:', process.env);

  const {didToken, email} = JSON.parse(event.body);

  const magic = new Magic(MAGIC_SEC_KEY);

  let rsp = {
    code: 1,
    message: 'Unknown error',
    data: {}
  };

  do {
    try {
      magic.token.validate(didToken);

      const metadata = await magic.users.getMetadataByToken(didToken);
      l.i('meta:', metadata);

      if (!metadata || metadata.email !== email) {
        l.e('email not match:', metadata.email, email);
        break;
      }

      let user = await ddb.getUserByEmail(email);
      if (!user) {
        await ddb.createUser(email);
      }

      rsp = {
        code: 1000,
        message: 'OK',
        data: {}
      };
    } catch (error) {
      l.e(error.message);
      break;
    }
  } while (0);

  l.d('>>> RSP <<<', rsp);
  return rsp;
};
