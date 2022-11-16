const AWS = require('aws-sdk');
const {Magic} = require('@magic-sdk/admin');
const l = require('../lib/log');
const ddb = require('../lib/ddb');

const {MAGIC_SEC_KEY} = process.env;

exports.handler = async (event) => {
  l.d('>>> REQ <<<', event);

  let rsp = {
    isAuthorized: false
  };

  const {
    authorizationToken,
    requestContext
  } = event;

  const didToken = authorizationToken;
  const magic = new Magic(MAGIC_SEC_KEY);

  do {
    try {
      const metadata = await magic.users.getMetadataByToken(didToken);
      l.i('meta:', metadata);

      let user = await ddb.getUserByEmail(metadata.email);
      if (!user) {
        break;
      }
      rsp = {
        isAuthorized: true,
        resolverContext: {
          username: user.id
        },

        ttlOverride: 100000
      };
    } catch (e) {
      l.e(e);
      break;
    }
  } while (0);

  l.i('>>> RSP <<<', rsp);

  return rsp;
};
