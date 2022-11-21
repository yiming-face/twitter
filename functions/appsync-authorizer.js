const AWS = require('aws-sdk');
const {Magic} = require('@magic-sdk/admin');
const l = require('../lib/log');
const ddb = require('../lib/ddb');
const jwt = require('../lib/jwt');

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

  const token = authorizationToken;
  const magic = new Magic(MAGIC_SEC_KEY);

  do {
    try {
      let user = null;

      // Try jwt
      let payload = await jwt.verify(token);
      l.i('payload:', payload);
      if (payload) {
        user = await ddb.getUserById(payload.userId);
      } else {
        const metadata = await magic.users.getMetadataByToken(token);
        l.i('meta:', metadata);

        user = await ddb.getUserByEmail(metadata.email);
      }
      if (!user) {
        break;
      }

      rsp = {
        isAuthorized: true,
        resolverContext: {
          // The original feed vtl use 'username' as id
          username: user.id
        },

        ttlOverride: 100
      };
    } catch (e) {
      l.e(e);
      break;
    }
  } while (0);

  l.i('>>> RSP <<<', rsp);

  return rsp;
};
